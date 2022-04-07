'use strict';

/* Initialisation du module pg */
const MongoClient = require('mongodb').MongoClient;
const connexFilePath = '../../config/database_config.json';
const connexFile = require.resolve(connexFilePath);

/* Fonction de connexion à la base */

async function dbconnect() {
	var client = null;
    delete require.cache[connexFile];
	const config = require(connexFilePath);

	try {
	  const uri = "mongodb+srv://"+config.username+":"+config.password+"@"+config.server;
	  client = new MongoClient(uri);
	// Connect to the MongoDB cluster
	  
	  // Connect to the MongoDB cluster
	  return client;

	} catch (e) {
	  console.error(e);
	} 
  }

/* Exportation le la fonction de connexion */
module.exports.dbconnect = dbconnect;