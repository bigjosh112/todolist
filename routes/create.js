const express = require('express')
const User =  require('../models/user');
const router = express.Router();
const jwt =  require('jsonwebtoken');
const bcrypt = require('bcryptjs');


//signup endpoint
router.post('/signup', async (req, res) => {

    //get endpoints from  the request from the body
    const {name, email, password: plainTextPassword} = req.body;

    //encrypting password
    const password = await bcrypt.hash(plainTextPassword, 10)

    //checks
    if (!email || !password || !name) {
        return res.status(400).send({status: 'error', msg: 'All field must be filled'});
    }

    //checks for email Validation
    const valid = /@gmail.com || @yahoo.com/.test(email)
        if(!valid)
        return res.status(400).send({status: 'error', msg: 'Enter the right email'})

try {
    // for time
    const timestamp = Date.now();
    //create user document
    let user = new User();
    user.email = email;
    user.password = password;
    user.name = name;
    user.username = `${email}_${timestamp}`;

    //save document on database
    user = await user.save();


    return res.status(200).send({ status: 'ok', msg: 'User created successfully', user})
} catch(error){
    return res.status(400).send({status: 'error', msg: 'error', error});
}


});


//login endpoint
router.post('/login', async (req, res) => {

    //getting endoint from request body
    const {email, password } = req.body;

    //checks
    if(!email || !password) 
        return res.status(400).send({ status: 'error', msg: 'All field must be filled'})

    try{

        //find user by email
        const user = await User.findOne({email: email}).lean();
        if(!user) {
            return res.status(404).send({status: "error", msg: `No user with email: ${email} found`})
        }

        if( await bcrypt.compare(password, user.password)){

            // generate token
            const token =  jwt.sign ({
                id: user.id,
                email: user.email
            }, process.env.JWT_SECRET);

            return res.status(200).send({ status: 'ok', msg: 'Login sucessfully', user, token}); }
        
            // confirm the passwords
            if(user.password != password){
                return res.status(400).send({status: 'error', msg: 'Email or Password incorrect'});
            }
    
            delete user.password
    

    } catch (e) {
        return res.status(400).send({ status: 'error', msg: 'error occurred'})
    }
    
});

//endpoint to delete a user
router.post('/deleteuser', async (req, res) => {
    
    //getting the User_id from the request body
    const {user_id} = req.body;

    //checks 
    if(!user_id) {
        return res.status(400).send({ status: 'error', msg: 'All field must be filled'})
    }

    try {

        //delete the user found
        await User.deleteOne({_id: user_id });
    
        return res.status(200).send({ status: "ok", msg: "delete successful" });

      } catch (e) {
        
        console.log(e)
        
        return res.status(400).send({ status: "error", msg: "Some error occured", e });
      }


});

router.post('/change_password', async(req,res) =>{

    //getting the parameters from the request body
    const {email, password, token, new_password, confirm_new_password } = req.body

    
    //find the user through the email
    const user = await User.findOne({email: email}).lean();
    
    //check if the  user is the database
    if(!user){
            return res.status(404).send({status: 'error', msg: `No user with email: ${email} found`});
        }

    //compare passwords
    if(await bcrypt.compare(password, user.password)){
        
    }

    // check if the email, token and password fields are filled
    if(!email || !password || !token || !new_password || !confirm_new_password){
        return res.status(400).send({status:'error', msg:'All fields must be field'})
   }

   //verify token
   let users = jwt.verify(token, process.env.JWT_SECRET);
    
    //check if the old pasword and the confirm new password are the same
    if(password === new_password) {
            return res.status(400).send({status: 'error', msg: 'cannot use the same password'})
    
    }

    //check if the new pasword and the new password are the same
    if(new_password !== confirm_new_password) {
        return res.status(400).send({status: 'error', msg: 'mismatch password'})
        
}

    //to get a user and update the password
    try{

        const  password = await bcrypt.hash(new_password, 10)
            const change_password = await User.findOneAndUpdate({email},
                {password}, {new:true})
                
                //equate new_passowrd to password

   
            if(!change_password){
                    res.status(400).send({status:'err', msg:'unable to change password'})
                 }
        
             
             delete change_password
            return res.status(200).send({staus:200, msg:'Success'})
        }catch(e){
            console.log(e);

            return res.status(400).send({staus:'error', msg:'error'})
        }


})
module.exports = router;