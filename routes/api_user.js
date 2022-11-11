const express = require('express');
const router = express.Router();

// import della funzione ensureAuthenticated e updateBalance
const {ensureAuthenticated} = require('../config/auth');
const updateBalance = require('../functionJS/updateBalance');
const correctBalance = require('../functionJS/correctBalance');
const reBalance = require('../functionJS/reBalance');

// importo OperationSchema
const Operation = require('../models/Operation');
const User = require('../models/User');
const { findByIdAndUpdate } = require('../models/User');

// post per inserimento ingresso
router.post('/insertIn', ensureAuthenticated, async(req,res) => {

    const {title, description, amount, date,selectedCategory} = req.body;
    
    // vettore contenente tutti i possibili messaggi di errore
    const errors = [];

    // check che siano stati inviati correttamente i dati
    if(!title || !amount || !selectedCategory || !date){
        errors.push({msg: 'Compila tutti i campi obbligatori'});
    }

    if(amount < 0){
        errors.push({msg: 'Stai cercando di inserire un Ingresso con valore negativo'});
    }

    if(errors.length > 0){
        res.render('./dashboard_views/insertIn', {
            errors,
            title,
            description,
            amount,
            date,
            selectedCategory
        });
    }
    else{

        // creazione del nuovo oggetto da inserire e salvataggio su collezione Operation
        const newOp = await new Operation({
            username: currentUser,
            type: 'in',
            title: title,
            description: description,
            amount: amount,
            dateOp: date,
            category: selectedCategory,
        });


        try{
            await newOp.save();
            // aggiorno balance su db collezione User
            await updateBalance(Number(amount));
        } catch(err) {
            console.log(err);
            req.flash('error_msg', 'Qualcosa e\' andato storto. Riprovare');
            res.redirect('/dashboard/insertIn');
        }

        // se tutto Ok invia messaggio Success
        req.flash('success_msg', 'Inserimento avvenuto correttamente');
        res.redirect('/dashboard/insertIn');
        
    }
});

// post per inserimento spese
router.post('/insertOut', ensureAuthenticated, async(req,res) => {

    const {title, description, amount, date,selectedCategory} = req.body;
    
    // vettore contenente tutti i possibili messaggi di errore
    const errors = [];

    if(!title || !amount || !date || !selectedCategory){
        errors.push({msg: 'Compila tutti i campi obbligatori'});
    }

    if(amount < 0){
        errors.push({msg: 'Inserire il valore della spesa senza segno'})
    }

    if(errors.length > 0){
        res.render('./dashboard_views/insertIn', {
            errors,
            title,
            description,
            amount,
            date,
            selectedCategory
        });
    } 
    else{

        // creazione del nuovo oggetto da inserire e salvataggio su collezione Operation
        const newOp = await new Operation({
            username: currentUser,
            type: 'out',
            title: title,
            description: description,
            amount: amount,
            dateOp: date,
            category: selectedCategory,
        });

        try{
            await newOp.save();
            // aggiorno balance
            await updateBalance(0 - Number(amount));
        } catch(error){
            console.log(error);
            req.flash('error_msg', 'Qualcosa e\' andato storto. Riprovare');
            res.redirect('/dashboard/insertIn');
        }

        // se tutto Ok invia messaggio Success
        req.flash('success_msg', 'Inserimento avvenuto correttamente');
        res.redirect('/dashboard/insertOut');
    }            
});

router.post('/deleteTransaction/:id', ensureAuthenticated, async(req,res) => {
    const id = req.params.id;
    
    try{
        const result = await Operation.findByIdAndDelete(id);
        await correctBalance(result);
    } catch(error) {
        console.log(error);
        req.flash('error_msg', 'Qualcosa e\' andato storto');
        res.redirect('/dashboard/summary/allOperations');
    }

    req.flash('success_msg', 'Cancellazione avvenuta con successo');
    res.redirect('/dashboard/summary/allOperations');
    
});

router.post('/updateTransaction/:id', ensureAuthenticated, async(req,res) => {
    
    const id = req.params.id;
    const {title, amount, date} = req.body;

    if(!title && !amount && !date){
        req.flash('error_msg', 'Compila almeno un campo per effettuare la modifica');
        res.redirect('/dashboard/summary/allOperations');
    } else {

        if(!amount && !date && title){
            try{
                const result = await Operation.findByIdAndUpdate(id, {
                    title: title
                });
            } catch(error){
                console.log(error);
                req.flash('error_msg', 'Qualcosa e\' andato storto');
                res.redirect('/dashboard/summary/allOperations');
            }
        } else if(amount && !date && !title){
            try{
                const result = await Operation.findByIdAndUpdate(id, {
                    amount: amount
                });
                await reBalance(result, amount);
            } catch(error){
                console.log(error);
                req.flash('error_msg', 'Qualcosa e\' andato storto');
                res.redirect('/dashboard/summary/allOperations');
            }
        } else if(!amount && date && !title){
            try{
                const result = await Operation.findByIdAndUpdate(id, {
                    dateOp: date
                });
            } catch(error){
                console.log(error);
                req.flash('error_msg', 'Qualcosa e\' andato storto');
                res.redirect('/dashboard/summary/allOperations');
            }
        } else if(!amount && date && title){
            try{
                const result = await Operation.findByIdAndUpdate(id, {
                    title: title,
                    dateOp: date
                });
            } catch(error){
                console.log(error);
                req.flash('error_msg', 'Qualcosa e\' andato storto');
                res.redirect('/dashboard/summary/allOperations');
            }
        } else if(amount && !date && title){
            try{
                const result = await Operation.findByIdAndUpdate(id, {
                    title: title,
                    amount: amount
                });
                await reBalance(result, amount);
            } catch(error){
                console.log(error);
                req.flash('error_msg', 'Qualcosa e\' andato storto');
                res.redirect('/dashboard/summary/allOperations');
            }
        } else if(amount && date && !title){
            try{
                const result = await Operation.findByIdAndUpdate(id, {
                    amount: amount,
                    dateOp: date
                });
                await reBalance(result, amount);
            } catch(error){
                console.log(error);
                req.flash('error_msg', 'Qualcosa e\' andato storto');
                res.redirect('/dashboard/summary/allOperations');
            }
        } else if(amount && date && title){
            try{
                const result = await Operation.findByIdAndUpdate(id, {
                    title: title,
                    amount: amount,
                    dateOp: date
                });
                await reBalance(result, amount);
            } catch(error){
                console.log(error);
                req.flash('error_msg', 'Qualcosa e\' andato storto');
                res.redirect('/dashboard/summary/allOperations');
            }
        }
        req.flash('success_msg', 'Modifica avvenuta con successo');
        res.redirect('/dashboard/summary/allOperations');
    }

});

router.get('/getTransaction', ensureAuthenticated, async (req,res) => {
    const op = await Operation.find({username: currentUser}).sort({dateOp: 1});
    res.send(op);
    
});

router.get('/getUserAmount', ensureAuthenticated, async (req,res) => {
    const user = await User.find({username: currentUser});
    res.send(user);
});

module.exports = router;