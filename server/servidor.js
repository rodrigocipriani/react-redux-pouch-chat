/**
 * Evite alterar este arquivo
 * */
const http = require('http');
const app = require('./config/express')();
const sequelize = app.models.modelo.sequelize;


sequelize.sync().done(() => {
  http.createServer(app).listen(app.get('port'), () => {
    console.log(`Express Server escutando na porta ${ app.get('port') }`);
  });
});
