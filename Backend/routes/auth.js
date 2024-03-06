const express = require('express');
const router = express.Router();
const User = require('../models/user')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// Route 1: route for the api with the route og localhost/api/auth/createuser
router.post('/createuser',
    [body('email', 'Enter valid email id!').isEmail(), body('password', "Password should atleast be of length 2").isLength({ min: 2 })],
    async (req, res) => {
        const result = validationResult(req);
        let success = false;
        if (!result.isEmpty()) {
            return res.status(400).json({ success, errors: result.array() })
        }

        try {
            userEmail = (await User.find({ email: req.body.email })).length
            if (userEmail == 0) {
                let salt = bcrypt.genSaltSync(10);
                let securedPass = bcrypt.hashSync(req.body.password, salt);
                const user = await User.create({
                    fullname: req.body.fullname,
                    rollNo: req.body.rollNo,
                    email: req.body.email,
                    password: securedPass,
                    role: req.body.role,
                    commiteeName: req.body.committeeName,
                    department: req.body.department,
                })

                const data = {
                    user: {
                        id: user.id,
                        role: user.role
                    }
                }

                const authtoken = jwt.sign(data, JWT_SECRET);

                success = true;
                res.json({ success, authtoken });
            } else {
                return res.status(400).json({ error: "Email Id already Exists" })
            }
        } catch (err) {
            res.status(500).send("Internal Server Error occured while Authennticating")
        }


    })

// Route 2: route for the api with the route og localhost/api/auth/login
router.post('/login',[
    body('email','Enter valid email id!').isEmail(), body('password','Password cannot be blank').exists()
],async(req, res)=>{
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const user = await User.findOne({email: req.body.email, role: req.body.role})
        if(user){
            const comparePass = bcrypt.compareSync(req.body.password, user.password);
            if(comparePass){
                const data = {
                user: {
                    id: user.id,
                    role: user.role
                }
            }
            success = true;
            const authtoken = jwt.sign(data, JWT_SECRET);    
            res.json({success,authtoken});
            }
            else{
                return res.status(400).json({error: "User does not Exists / Invalid Credentials"
            })
        }
            
            
        }else{
            return res.status(400).json({error: "User does not Exists / Invalid Credentials"})
        }
    } catch (err) {
        res.status(500).send("Internal Server Error occured while Authennticating")
    }


})

// Route 3: route for the api with the route of localhost/api/auth/getuser with a MIDDLEWARE
router.get('/getuser', fetchuser,async(req, res)=>{

    try {
        const userId = req.user.id; 
        const user = await User.findById(userId).select("-password"); 
        res.send(user);


    } catch (err) {
        res.status(500).send("Internal Server Error occured while getting the user from JWT token || MiddleWare")
    }


})




module.exports = router;