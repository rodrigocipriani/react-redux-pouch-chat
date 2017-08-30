/**
 * Created by thiago on 04/02/2016.
 */


const config    = require('../../config/config');
const path      = require('path');
const fs        = require('fs');
const Sequelize   = require('sequelize');
let sequelize   = null;
let modelo    = null;
const cls       = require('continuation-local-storage');
const namespace = cls.createNamespace('cls-postgre-invest');


module.exports = (app) => {
  if (!modelo) {
    console.log('Inicializa modelos do pg');
    if (!sequelize) {
      console.log('-> instancia sequelize com cls');
      Sequelize.cls = namespace;
      sequelize = new Sequelize(config.postgres.db, config.postgres.usuario, config.postgres.senha, config.postgres.config);
    }
    const db = {};
    fs.readdirSync(__dirname)
            .filter((file) => {
              return (file.indexOf('.') !== 0) && (file !== 'modelo.js') && (file !== 'auto');
            })
            .forEach((file) => {
              const model = sequelize.import(path.join(__dirname, file));
              console.log('model: ', model.name);
              db[model.name] = model;
            });

    Object.keys(db).forEach((model) => {
      if ('associate' in db[model]) {
        db[model].associate(db);
      }
    });

    db.Sequelize = Sequelize;
    db.sequelize = sequelize;
    modelo = db;
  }
  return modelo;
};
