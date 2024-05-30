const { GuestVisit } = require('./GVisit');


const Visit = {
  async initialize(req, res) {
    if (req.cookies.UID && req.cookies.UID.length != 0) {
      
    }else if(req.cookies.GID && req.cookies.GID.length != 0){
      await GuestVisit.initialize(req, res);
    }else{
      await GuestVisit.addNewGuest(req, res);
    }
  }
};
  
module.exports = {Visit}
