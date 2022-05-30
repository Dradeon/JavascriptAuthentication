const {verify} = require('jsonwebtoken');

function verifyToken(req,res) {
    const accessheader = req.headers['access']
    if(!accessheader){
        return false;
    }
    try{
        decoded = verify(accessheader,process.env.TOKEN_SECRET);
        return decoded;
    }
    catch(err){
        console.log(err)
        return false;
    }
}

module.exports = {verifyToken};