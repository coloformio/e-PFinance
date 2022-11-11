const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).render('./main_views/homepage');
});

router.get('/registration', (req,res) => {
    res.status(200).render('./main_views/register');
});

router.get('/login', (req,res) => {
    res.status(200).render('./main_views/login');
});

router.get('/*', (req,res) => {
    res.status(404).render('./main_views/nonFound');
})

module.exports = router;