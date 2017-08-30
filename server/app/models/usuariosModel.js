
module.exports = function (sequelize, DataTypes) {
  const usuariosModel = sequelize.define('usuariosModel', {
    id: {
      type         : DataTypes.INTEGER,
      allowNull    : false,
      primaryKey   : true,
      autoIncrement: true
    },
    nome: {
      type     : DataTypes.TEXT,
      allowNull: false
    },
    senha: {
      type     : DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type     : DataTypes.TEXT,
      allowNull: false
    },
        /* situação
         0 - aguarda confirmação
         1 - confirmado
         2 - aguarda troca de senha
         */
    situacao: {
      type        : DataTypes.INTEGER,
      allowNull   : true,
      defaultValue: 0
    },
        /* tipo
         0 - usuário padrão
         1 - usuário premium
         99 - administrador
         */
    tipo: {
      type        : DataTypes.INTEGER,
      allowNull   : true,
      defaultValue: 0
    },
    criacao: {
      type        : DataTypes.DATE,
      allowNull   : true,
      defaultValue: DataTypes.NOW
    },
    foto: {
      type     : 'BYTEA',
      allowNull: true
    }

  }, {
    tableName      : 'usuarios',
    freezeTableName: true
        // classMethods: {
        //      associate: function (models) {
        //          usuariosModel.hasMany(models.andamentos, {foreignKey: 'jogador_id', targetKey: 'id'});
        //          usuariosModel.hasMany(models.tabuleiros, {foreignKey: 'jogador_id', targetKey: 'id'});
        //      }
        // }
  });

  return usuariosModel;
};
