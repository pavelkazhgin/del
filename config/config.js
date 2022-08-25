const dotenv = require('dotenv');

dotenv.config();
let path;
switch (process.env.NODE_ENV) {
  case "dev":
    path = `${__dirname}/../../.env.test`;
    break;
  case "production":
    path = `${__dirname}/../../.env.production`;
    break;
  default:
    path = `${__dirname}/../../.env.development`;
}
dotenv.config({ path: path });

const DIRS = process.env.DIRS.split(',');
const MAX_SIZE = process.env.MAX_SIZE;
const MAX_SUBDIR = process.env.MAX_SUBDIR;


module.exports = { DIRS, MAX_SIZE, MAX_SUBDIR  }
