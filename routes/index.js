const express = require('express');
const router = express.Router();
const {ensureAuthenticated } = require('../config/auth');
const User = require('../models/User');
router.get('/', (req, res) => res.render('welcome'));

//Dasboarpage
router.get('/dashboard', ensureAuthenticated, (req, res) => 
res.render('dashboard', {
    todoList: req.user
    
})
);

router.post("/dashboard/newtodo", function(req, res){
    console.log("item submitted" + req.user.name);
    var mongodb = require('mongodb');

User.update({'_id': new mongodb.ObjectID(req.user._id)}, 
{ $push: {  'notes' :  {
    'value': req.body.item,
 
  }} },function(err, Todo){
    if(err) console.log(err);
    else{
        console.log("Edited Item: " + req.user._id);
    }
});

    res.redirect("/dashboard");
});

router.get('/destroy', function(req, res){
    console.log("item Deleted " +req.user._id);
    var mongodb = require('mongodb');
 
    res.redirect("/dashboard");
});

module.exports = router;