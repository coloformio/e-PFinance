module.exports = {
    ensureAuthenticated: function(req, res, next){
        // metodo per verificare la presenza cookie inserito in autonomia da passport una volta effettuato il login
        if(req.isAuthenticated()){
            return next();
        }

        req.flash('error_msg', 'E\' necessario autenticarsi. Per favore effettua il login');
        res.status(401).redirect('/login');
    }
}
