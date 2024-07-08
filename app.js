require('dotenv').config(); 

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose =require('mongoose')
const passport = require('passport')
const session = require('express-session');
const flash = require('connect-flash');

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport Middleware
require('./config/passport.js')(passport)
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Middleware para mensajes flash
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Conectar a base de datos

const connectDB = require('./config/db.js');
connectDB();

app.use(express.static(__dirname + '/public'));

//EJS
app.use(expressLayouts);
app.set('layout', './layouts/layout');
app.set('view engine', 'ejs')

//Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))



const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`http://localhost:${PORT}`))