const express = require('express');
const router = express.Router();

// import della funzione ensureAuthenticated
const {ensureAuthenticated} = require('../config/auth');
const Operation = require('../models/Operation');

router.get('/', ensureAuthenticated, (req, res) => {
    res.status(200).render('./dashboard_views/dashboard', {
        name: req.user.name,
        surname: req.user.surname,
        balance: req.user.balance
    });
});

router.get('/insertIn', ensureAuthenticated, (req, res) => {
    res.status(200).render('./dashboard_views/insertIn');
});

router.get('/insertOut', ensureAuthenticated, (req, res) => {
    res.status(200).render('./dashboard_views/insertOut');
});

router.get('/news', ensureAuthenticated, (req,res) => {
    res.status(200).render('./dashboard_views/news');
});

router.get('/summary', ensureAuthenticated, async (req, res) => {

    // ricerco tutte le spese dell'utente nel DB e le ordino dalla piu' recente alla meno recente
    const ops = await Operation.find({username: currentUser}).sort({dateOp: -1, type: -1});
    res.status(200).render('./dashboard_views/summary', {
        data: JSON.stringify(ops)
    });
});

router.get('/summary/allOperations', ensureAuthenticated, async (req,res) => {
    const ops = await Operation.find({username: currentUser}).sort({dateOp: -1, type: -1});
    res.status(200).render('./dashboard_views/summary_allOperation', {
        data: JSON.stringify(ops)
    });
});

module.exports = router;