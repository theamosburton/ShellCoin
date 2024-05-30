const requestIp = require('request-ip');
const useragent = require('express-useragent');
const cookieOnly = require('cookie');
const { Database } = require('./db');
const { createNewID, encrypt, decrypt } = require('./BaiscModules');

const GuestVisit = {};

GuestVisit.initialize = async (req, res) => {
    const checkCookieResult = await GuestVisit.checkCookie(req);
    if (checkCookieResult.status) {
        req.session.USI = null;
        res.clearCookie('UID');
        var guestID = checkCookieResult.log;
        const sessionStatus = await GuestVisit.checkSession(req.session.GSI);
        if (sessionStatus) {
            await GuestVisit.updateVisits(req.session.GSI, guestID, req);
        } else {
            await GuestVisit.makeSession(guestID, req);
        }
    } else {
        await GuestVisit.addNewGuest(req,res);
    }
}

GuestVisit.checkCookie = async (req)=>{
  const guestID = req.cookies.GID;
  const database = await Database.connect();
  if(database.status){
    const conn = database.conn;
    const collection = conn.collection('Guests');
    const decGuestID = decrypt(guestID);
    const result = await collection.findOne({ guestID: decGuestID });
    if (result ) {
      return {status:true, log:decGuestID};
    }else{
      return {status:false, log:"No Guest Found"};
    }
  }else{
    console.log(database.conn);
  }
  await Database.disconnect();
}

GuestVisit.addNewGuest = async (req, res)=>{
    var guestID = await createNewID("Guests", "GID");
    if (!guestID.status) {
      return false;
    }
    const database = await Database.connect();
    if(database.status){
      const conn = database.conn;
      const collection = conn.collection('Guests');
      const userDevice = useragent;
      const deviceInfo = {
        browserName: userDevice.browser,
        deviceType: userDevice.isDesktop ? 'Desktop' : userDevice.isMobile ? 'Mobile' : 'Tablet',
        platform: userDevice.platform,
        browser: userDevice.browser
      }
      guestID = guestID.log;
      const dateTime = Date.now();
      const date = new Date().toISOString().split('T')[0];
      const encryptedID = encrypt(guestID);
      const setCookieHeader = cookieOnly.serialize('GID', encryptedID, {
        path: '/',
        httpOnly: true,
        maxAge: 3600 * 24 * 30 * 365 * 2 // Cookie will expire in 2 years
      });
      res.setHeader('Set-Cookie', setCookieHeader);
      const guestData = {
        date: date,
        guestID: guestID,
        deviceInfo:deviceInfo
      };
      const result = await collection.insertOne(guestData);
      if (result.acknowledged) {
        await GuestVisit.makeSession(guestID, req)
      }
    }
    await Database.disconnect();
}

GuestVisit.makeSession = async (guestID, req)=>{
  var sessionID = await createNewID("Sessions", "GSI");
  if (!sessionID.status) {
    return false;
  }
  sessionID = sessionID.log;
  const database = await Database.connect();
  if(database.status){
    const conn = database.conn;
    const collection = conn.collection('Sessions');
    req.session.GSI = sessionID;
    const guestIP = req.clientIp;
    const date = new Date().toISOString().split('T')[0];
    await GuestVisit.updateVisits(sessionID, guestID, req);
    const sessionData = {
      date: date,
      sessionID: sessionID,
      personID: guestID,
      ipAddress: guestIP
    };
    await collection.insertOne(sessionData);
  }
  await Database.disconnect();
}

GuestVisit.updateVisits = async (sessionID, guestID, req)=> {
  const visitedPage = req.originalUrl;
  if (visitedPage == '/env') {
    return false;
  }
  const database = await Database.connect();
  if(database.status){
    const conn = database.conn;
    const collection = conn.collection('Visits');
    const visitTime = Math.floor(Date.now() / 1000);
    const httpReferer = req.headers['referer'] || '';
    const referedByPage = httpReferer.replace(/(^https?:\/\/)/, "");
    const referedByPerson = req.query.ref || '';
    const visitedPage = req.originalUrl;

    const visitData = {
        sessionID: sessionID,
        personID: guestID,
        visitTime: visitTime,
        visitedPage: visitedPage,
        referedByPerson: referedByPerson,
        referedByPage: referedByPage
    };
    const result = await collection.insertOne(visitData);
    return true;
  }
  await Database.disconnect();
}
  
GuestVisit.existInDB = async (gID)=> {
    const database = await Database.connect();
    if(database.status){
      const conn = database.conn;
      const collection = conn.collection('Guests');
      const result = await collection.findOne({ guestID: gID });
      return !!result; // Convert result to boolean and return
    }else{
      return false;
    }
    await Database.disconnect();
}

GuestVisit.sessionExist = async (req)=> {
  const sessionPresent = {};
  if (req.session.GSI) {
      const session = req.session.GSI;
      if (await GuestVisit.checkSession(session)) {
          sessionPresent.status = true;
          sessionPresent.log = session;
      } else {
          sessionPresent.status = false;
          sessionPresent.log = "New Session detected";
      }
  } else {
      sessionPresent.status = false;
      sessionPresent.log = "Session does not exist";
  }

  return sessionPresent;
}

GuestVisit.checkSession = async (sess) => {
  const database = await Database.connect();
    if(database.status){
      const conn = database.conn;
      const collection = conn.collection('Sessions');
      const result = await collection.findOne({ sessionID: sess });
      if (result) {
          return true;
      } else{
          return false;
      }
    }
    await Database.disconnect();
}
      

module.exports = {GuestVisit};