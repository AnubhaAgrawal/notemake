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
        console.log("Inserted Item: " + req.user._id);
    }
});

    res.redirect("/dashboard");
});

router.get('/destroy/:id', function(req, res){
    console.log("item Deleted " +req.params.id);
    var mongodb = require('mongodb');
    var delItem ={_id: new mongodb.ObjectID(req.params.id)};
    
    User.updateOne({'_id': new mongodb.ObjectID(req.user._id)}, 
    { $pull: {  'notes' :  delItem} }, { safe: true, multi:true }, function(err, Todo){
        if(err) console.log(err);
        else{
            console.log("Deleted Item: " + delItem._id);
        }
    });
 
    res.redirect("/dashboard");
});

router.get('/dashboard', ensureAuthenticated, (req, res) => 
res.render('dashboard', {
    todoList: req.user
    
})
);
router.get('/edit/:id', ensureAuthenticated,  function(req, res){
    var mongodb = require('mongodb');
    var delItem ={_id: new mongodb.ObjectID(req.params.id)};
    User.find({}, function(err, todoList){
        if(err) console.log(err);
        else{
            res.render("todoEdit.ejs", {todoList: req.user, Todoid: delItem._id});
        }
    })
router.post('/edit/:id', function(req, res){
    console.log("item Edited");
    var mongodb = require('mongodb');
   
    var r_name = req.body.items;
    console.log("Edited Item: "+ r_name);
    
    User.updateOne({'_id': new mongodb.ObjectID(req.user.id), 'notes._id': new mongodb.ObjectID(req.params.id)}, 
    { $set: {"notes.$.value": r_name} },function(err, Todo){
        if(err) console.log(err);
        else{
            console.log("Edited Item: "+ req.params.id);
        }
    });

    res.redirect("/dashboard");
});
});

module.exports = router;