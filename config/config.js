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
const FILE_EXTENSIONS = process.env.FILE_EXTENSIONS.split(',');
const CURRENT_FILE  = process.env.CURRENT_FILE ;
const SIZE_CURR_FILE  = process.env.SIZE_CURR_FILE ;


module.exports = { DIRS, MAX_SIZE, MAX_SUBDIR, CURRENT_FILE, FILE_EXTENSIONS, SIZE_CURR_FILE  }
