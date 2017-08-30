

module.exports = function (app) {
  const service = {};
  const extratoModel = app.models.modelo.extratoModel;

  service.findAll = () => {
    return extratoModel.findAll();
  };

  return service;
};
