// file di configurazione per passportjs
// viene fatto import della strategia scelta (local) e viene settata -> modulo che e' necessario installare con NPM
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// definizione ed export della strategia, cosa deve essere quando si fa login
module.exports = async function(passport){
    passport.use(
        // creo nuova strategia per login | ha come parametri opzioni (nel caso si utilizzi un qualcosa di diverso da username per auth) e la funzione di callback
        // done e' una funzione che viene eseguita quando si finisce un "ciclo di esecuzione", indipendentemente dal risultato del ciclo => done(err, user, options);
        new LocalStrategy(async (username, password, done) => {
            // ricerco se esiste utente con quel nome utente
            await User.findOne({username: username})
                .then(user => {
                    if(!user){
                        // se non trova entry nel DB con username allora username e' errato
                        // ritorno il messaggio di errore
                        return done(null, false, {message: 'Username o password errati!'});
                    }

                    // se ho trovato user allora e' necessario verificare che la password inserita dall'utente sia corretta
                    // visto che SALT e' casuale non e' possibile creare hash della password e poi fare semplice comparazione delle stringhe. Devo usare BCRYPT.COMPARE
                    bcrypt.compare(password, user.password, (err, isMatch) =>{
                        if(err) throw err;

                        if(isMatch){
                            // se isMatch == true allora sono riuscito ad autenticare utente e posso continuare
                            return done(null, user)
                        } else {
                            // isMatch == false allora non sono riuscito ad autenticare quindi ritorno messaggio
                            return done(null, false, {message: 'Username o password errati!'});
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    // creazione cookie per la sessione dell'utente
    // serailizeUser salva l'id dell'utente all'interno del session storage
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    // deserializeUser permette di aggiungere al body della richieste obj user trovato tramite ID salvato dalla funzione precedente
    passport.deserializeUser((id,done) => {
        User.findById(id, (err, user) => {
            done(err,user);
        });
    });
}