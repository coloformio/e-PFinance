const express = require('express');

// render per i layouts
const expressLayouts = require('express-ejs-layouts');

// Flash e Session per inviare i messaggi dopo redirect
const flash = require('connect-flash');
const session = require('express-session');

// Passport Config
const passport = require('passport');
require('./config/passport');

// Server Creation
const app = express();

// MongoDB Connection
const connectionDb = require('./functionJS/connectionDB');
connectionDb();

// EJS Setting Up
app.use(expressLayouts);
app.set('view engine', 'ejs');

// BODY PARSER Setting Up -> prendere i dati dalle richieste POST
app.use(express.urlencoded({extended: false}));

// STATIC Setting Up
app.use(express.static('./public'))

// EXPRESS SESSION Setting UP -> secret = chiave di sessione | resave = fa salvare nel session storage anche se sessione non viene modificata | saveUninitialized = sessioni non inizializzate vengono salvate nel sessione storage
app.use(session({
    secret: 'jkasdnkopafjanf',
    resave: true,
    saveUninitialized: true
}));

// PASSPORT MIDDLEWARE Setting Up
// inizializzo passport e lo connetto al server
app.use(passport.initialize());
// seleziono
app.use(passport.session());
require('./config/passport')(passport);

// FLASH Setting UP
app.use(flash());

// VARIABILI GLOBALI PER ERRORI
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/main'));
app.use('/api', require('./routes/api'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/api/user', require('./routes/api_user'));


// Server Setting Up
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
    if(err){
        console.log(err);
    }
    console.log(`Server is listening on port: ${PORT}`);
});
