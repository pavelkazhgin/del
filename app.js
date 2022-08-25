const { statSync } = require('fs');


const cat = statSync('./logs').isFile();
const dog = statSync('./logs').isDirectory();
console.log("this is file", cat, dog);

