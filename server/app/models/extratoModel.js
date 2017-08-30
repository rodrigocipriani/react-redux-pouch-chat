module.exports = function (sequelize, DataTypes) {
  const extratoModel = sequelize.define('extratoModel', {
    id: {
      type         : DataTypes.INTEGER,
      allowNull    : false,
      primaryKey   : true,
      autoIncrement: true
    },
    timestampInclusao: {
      type     : DataTypes.DATE,
      allowNull: true
    },
    pontos: {
      type     : DataTypes.CHAR(10),
      allowNull: true
    },
    observacao: {
      type     : DataTypes.TEXT,
      allowNull: true
    },

  }, {
    tableName      : 'extrato',
    freezeTableName: true
  });

  return extratoModel;
};
