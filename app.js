const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


const MONODB_URI = 'mongodb+srv://Anubha:agrawal@cluster0-cwp44.mongodb.net/test?retryWrites=true&w=majority'
//mongoose connection
mongoose.connect(MONODB_URI , {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log('Mongoose is Connected !!')
});

const app = express();

//passport config

require('./config/passport')(passport);


//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: false}));

//Express Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
   
  }))

//Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());


//connect Flash

app.use(flash());

//Global vars

app.use((req, res, next) => {

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/user'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));