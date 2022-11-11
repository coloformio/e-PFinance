const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const router = express.Router();


// importo UserSchema
const User = require('../models/User.js');

router.post('/registration', async (req,res) => {
    // dal corpo della richiesta salvo i vari campi nelle sequenti variabili
    const {name, surname, username, email, password, password2} = req.body;

    // creo array per la gestione degli errori
    const errors = [];

    // FASE CHECK
    // 1) voglio che tutti i campi siano stati compilati
    if( !name || !surname || !username || !email || !password || !password2){
        errors.push({msg: ' Tutti i campi devono essere compilati'});
    }

    // 2) le due password devono combaciare
    if( password !== password2){
        errors.push({msg: 'Le due password inserite non combaciano'});
    }

    // 3) password almeno di 8 caratteri
    if (password.length < 8){
        errors.push({msg: 'La password deve avere lunghezza almeno di 8 caratteri'});
    }

    // se almeno una di queste 3 condizioni non sono rispettate devo avvisare utente
    if(errors.length > 0){
        res.render('./main_views/register', {
            errors,
            name,
            surname,
            username,
            email,
            password,
            password2
        });
    } else {
        // Username e' identificativo dell'utente del DB -> deve essere unico per utente
        // ricerco username nel DB, se trovo qualcosa username non e' utilizzabile
        const user = await User.findOne({username: username});
        if(user){
            errors.push({msg: 'Username gia utilizzato. Perfavore scegliere un \'altro username'});
            res.render('./main_views/register', {
                errors,
                name,
                surname,
                username,
                email,
                password,
                password2
            });
        } else {
            // balance e' un intero che tiene il conto del bilancio
            const balance = 0;
            date = new Date();
            // creo oggetto per nuovo utente
            const newUser = await new User({
                name,
                surname,
                username,
                email,
                password,
                balance,
                date
            });

            // calcolo hash della password in quanto non memorizzo password in chiaro
            newUser.password = await bcrypt.hash(newUser.password, 10);
        
            // a questo punto salvo utente nel DB
            await newUser.save()
                .then(user => {
                    req.flash('success_msg', 'Registrazione confermata, puoi loggarti');
                    res.status(200).redirect('/login');
                })
                .catch(error => console.log(error));
        }
    }
});

router.post('/login', (req,res,next) => {
    
    if(!req.body.username || !req.body.password){
        req.flash('error_msg', 'Credenziali mancanti');
        res.redirect('/login');
    } else {
        global.currentUser = req.body.username;
        passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/login',
            failureFlash: true
        })(req,res,next);
    }
});

router.post('/logout', (req,res,next) => {
    
    req.logout((err) => {
        if(err){
            console.log(err);
            return next();
        }
        else {
            req.flash('success_msg', 'Logout effettuato correttamente');
            res.status(200).redirect('/login');
            return next();
        }
    });
});

module.exports = router;
