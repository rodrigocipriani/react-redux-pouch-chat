/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  const cadastrosModel = sequelize.define('cadastrosModel', {
    usuario_id: {
      type         : DataTypes.INTEGER,
      allowNull    : false,
      primaryKey   : true,
      autoIncrement: true
    },
    tipo: {
      type     : DataTypes.INTEGER,
      allowNull: false
    },
    token: {
      type        : DataTypes.UUID,
      allowNull   : false,
      defaultValue: DataTypes.UUIDV4
    },
    criacao: {
      type        : DataTypes.DATE,
      allowNull   : true,
            // defaultValue: DataTypes.NOW
      defaultValue: sequelize.literal("(now() at time zone '0003')")
    }
  }, {
    tableName      : 'cadastros',
    freezeTableName: true,
    classMethods   : {
      associate: (models) => {
        cadastrosModel.belongsTo(models.usuariosModel, { foreignKey: 'usuario_id' });
      }
    }
  });
  return cadastrosModel;
};
