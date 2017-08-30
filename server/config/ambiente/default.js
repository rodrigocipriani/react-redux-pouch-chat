module.exports = {
  publicFolder     : './client/build',
  corsOriginsAccept: ['*'],
  port             : 80,
  lib              : {
    bcrypt: 'bcriptjs'
  },
  mailer: {
    auth: {
      user: 'usr.war@gmail.com',
      pass: 'aerolitos51'
    },
    defaultFromAddress: 'nao_responda <nao_responda@guerra.com>'
  },
  redis: {
    host  : 'redis-11942.c2.eu-west-1-3.ec2.cloud.redislabs.com',
    port  : 11942,
    pass  : '',
    // pass  : process.env.REDIS_PASSWD,
    client: ''
        // ttl :  260
  },
  postgres  : {
    usuario: 'pthhbdxn',
    senha  : 'YGpZA5KEVBMht0saqWGePAHvOAb3CWtp',
    db     : 'pthhbdxn',
    config : {
      host           : 'horton.elephantsql.com',
      port           : 5432,
      dialect        : 'postgres',
      dialectOptions : {
        ssl: true
      },
      // logging : false,
      freezeTableName: true,
      define         : {timestamps: false},
      pool           : {max: 9, min: 0, idle: 10000}
    }
  },
  // postgres: {
  //   usuario: process.env.POSTGRES_USER,
  //   senha  : process.env.POSTGRES_PASSWD,
  //   db     : 'fidello',
  //   config : {
  //     host           : 'localhost',
  //     port           : 5432,
  //     dialect        : 'postgres',
  //     freezeTableName: true,
  //     define         : { timestamps: false },
  //     pool           : { max: 100, min: 0, idle: 10000 }
  //   }
  // },
  secretSession: 'fiu fiu',
  secretCookie : 'há gluglu',
  servidor     : 'localhost:3000'
};
