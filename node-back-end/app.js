
require('rootpath')();

/* Initialisation de toutes les modules nécessaires */
const http = require('http');
const express = require('express');
const cors = require('cors');

/* Initialisation des controllers */

/* Fin initialisation*/ 


/* Configuration de la constante app */
const app = express();
/* Création du serveur à partir de la constante app d'Express */
const server = http.createServer(app);


app.use(express.json({
  limit: '50mb'
}));
app.use(express.urlencoded({
  limit: '50mb', extended: true
}));

app.use(cors());


app.use('/', express.static(__dirname + '/'));



/* Intégration des controllers à la constante app */

    /*  Mbola ho integrena */

/* Fin integration Controllers*/

/* Configuration du PORT du serveur */
server.listen(3000);
console.log('Projet-MEAN-M1-Server is running on port 3000');