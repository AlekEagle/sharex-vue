'use strict';

import Sequelize from 'sequelize';
let { DataTypes, Model } = Sequelize,
  { STRING, BOOLEAN, ARRAY, DATE, JSONB, INTEGER } = DataTypes;

const sequelize = new Sequelize({
  database: process.env.SERVERDB,
  username: process.env.SERVERUSERNAME,
  password: process.env.SERVERPASSWORD,
  host: process.env.SERVERIP,
  port: 5432,
  dialect: 'postgres',
  logging: false
});

export class User extends Model {}
User.init(
  {
    id: {
      type: STRING,
      primaryKey: true
    },
    username: STRING(60),
    displayName: STRING,
    email: STRING(60),
    staff: STRING,
    password: STRING(2000),
    domain: STRING,
    subdomain: STRING,
    bannedAt: DATE,
    sessions: ARRAY(JSONB)
  },
  {
    sequelize
  }
);
User.sync({
  force: false
})
  .then(() => {
    console.log('Users synced to database successfully!');
  })
  .catch(err => {
    console.error('an error occurred while performing this operation', err);
  });
export class Uploads extends Model {}
Uploads.init(
  {
    filename: {
      type: STRING,
      primaryKey: true
    },
    userid: STRING,
    size: INTEGER
  },
  {
    sequelize
  }
);
Uploads.sync({
  force: false
})
  .then(() => {
    console.log('Uploads synced to database successfully!');
  })
  .catch(err => {
    console.error('an error occurred while performing this operation', err);
  });
export class Domains extends Model {}
Domains.init(
  {
    domain: {
      type: STRING,
      primaryKey: true
    },
    allowsSubdomains: BOOLEAN
  },
  {
    sequelize
  }
);
Domains.sync({
  force: false
})
  .then(() => {
    console.log('Domains synced to database successfully!');
  })
  .catch(err => {
    console.error('an error occurred while performing this operation', err);
  });
export class Instructions extends Model {}
Instructions.init(
  {
    name: {
      primaryKey: true,
      type: STRING
    },
    steps: ARRAY(STRING(2000)),
    filename: STRING(500),
    fileContent: STRING(5000),
    description: STRING(300),
    displayName: STRING
  },
  {
    sequelize
  }
);
Instructions.sync({
  force: false
})
  .then(() => {
    console.log('Instructions synced to database successfully!');
  })
  .catch(err => {
    console.error('an error occurred while performing this operation', err);
  });

export { sequelize as __sequelize };
