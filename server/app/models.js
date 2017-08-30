const path = require('path');
const fs = require('fs');
const cls = require('continuation-local-storage');
const namespace = cls.createNamespace('cls-mysql-usi');
const Sequelize = require('sequelize');
let sequelize = null;
let models = null;

const config = require('../config/config');
const configExpress = config.CONFIG_EXPRESS;

module.exports = (app) => {
  console.log('configExpress', configExpress);

  if (!models) {
    if (!sequelize) {
      Sequelize.cls = namespace;
      sequelize = new Sequelize(configExpress.mysql.db, configExpress.mysql.usuario, configExpress.mysql.senha, configExpress.mysql.config);
      sequelize.dialect.supports.schemas = true;
    }
    const db = {};

        // Carrega modulos dinamicamente
    const carregarModulos = (dir, fileList = [], searchWord) => {
      fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
          carregarModulos(filePath, fileList, searchWord);
        } else {
                    // console.log('searchWord>>>>', searchWord);
                    // console.log('filePath', filePath, filePath.indexOf(searchWord), searchWord);
          if (filePath.indexOf(searchWord) >= 0) {
            const model = sequelize.import(filePath);
            db[model.name] = model;
          }
        }
      });

      return fileList;
    };
        /**
         * Carrega models do sistema **Model.js
         * */
    carregarModulos(__dirname, [], 'Model.js');
        /**
         * Carrega modules de terceiros
         * Colocar em um arquivo json separado
         * */
    carregarModulos(`${ __dirname }/../node_modules/bb-common/models`, [], 'Model.js');
    Object.keys(db).forEach((model) => {
      if ('associate' in db[model]) {
        db[model].associate(db);
      }
    });

    db.Sequelize = Sequelize;
    db.sequelize = sequelize;
    models = db;
  }
  return models;
};
