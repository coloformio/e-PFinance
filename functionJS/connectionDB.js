const mongoose = require('mongoose');

// useNewUrlParser -> per evitare warning in quanto e' stato deprecato il parser standard
// useUnifiedTopology -> rimuove la gestione di opzioni di connessione che non sono piu rilevanti con il nuovo topology engine
async function connectionDb() {
    try{
        await mongoose.connect('mongodb://localhost:27017/epFinance', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB successfully connected');
    }
    catch(error){
        console.log(error);
    }
}

module.exports = connectionDb;
