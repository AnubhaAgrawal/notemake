const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//User model
const User = require('../models/User');
//Login Page
router.get('/login', (req, res) => res.render('login'));

//Register Page
router.get('/register', (req, res) => res.render('register'));

//Register Handle
router.post('/register', (req, res) =>{
    //console.log(req.body);
    //res.send('Hello');
    const {name, email, password, password2 } = req.body;
    let errors =[];
    // Check required fields

    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields'})
        
    }

    //Password match check

    if(password != password2){
        errors.push({msg: 'passwords do not match'});
    }

    //check pass Length

    if(password.length < 8){
        errors.push({msg: 'Password should be at least 8 character'});
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email, 
            password,
            password2
        });
    } else{
        //res.send('pass');
        //validation passed

        User.findOne({email: email})
        .then(user =>{
            if(user) {
                //user exists
                errors.push({msg: 'Email is already registered'});
                
                res.render('register', {
                    errors,
                    name,
                    email, 
                    password,
                    password2
                });
            } else{
                const newUser = new User({
                    name,
                    email,
                    password
                });
                //hash Password

                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) =>{
                        if(err) throw err;
                        // Set password to hashed

                        newUser.password = hash;
                        //save user
                        newUser.save()
                            .then(user =>{
                                req.flash('success_msg', 'you are now registered and can log in');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                }))

                //console.log(newUser)
                //res.send('hello');

            }
        });
    }
});

//login Handle

router.post('/login', (req, res, next) =>{
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


// Logout Handle

router.get('/logout', (req, res) =>{
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});
module.exports = router;