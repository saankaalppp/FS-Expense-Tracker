const User = require('../models/user');

function isstringinvalid(string) {
    if(string == undefined || string.length=== 0){
        return true;
    }else {
        return false;
    }
}

exports.signUp = async (req,res,next) => {
    try{
        const { name, email , password } = req.body;
        console.log('email',email,password)
        if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err: "Bad params . something is missing"})
        }
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err,hash) => {
        await User.create( { name:name,email:email,password:hash})
           res.status(201).json({message: 'Succesfully done'})
           })
    } catch(err) {
        res.status(500).json(err);

    }
}