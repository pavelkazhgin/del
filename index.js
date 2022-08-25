const { promisify } = require('util');
const path = require('path');

const fastFolderSize = require('fast-folder-size');
const fastFolderSizeAsync = promisify(fastFolderSize);

const fse = require('fs-extra');
const { stat, readdir, writeFile } = require('fs/promises');

const { DIRS, MAX_SIZE, MAX_SUBDIR } = require("./config/config");

console.log('MAXSUBDIR', MAX_SUBDIR);


async function validateDirs(arr){
    console.log('This is arr in validator', arr)
    let flag = true
    for (let i = 0; i < arr.length; i++) {
      try {
        await stat(arr[i]);
      } catch (error) {
        console.log(error)
        return flag = false
      }
    }
    return flag
  }

async function clearMemory(arr, maxSize, maxSizeDir) {

  for (let i = 0; i < arr.length; i++) {
    // const sizeOfDir = (await fastFolderSizeAsync(arr[i]))/1073741824;  //GB
    const sizeOfDir = (await fastFolderSizeAsync(arr[i]))/1048576;  //GB
    console.log('This is size of Dir', sizeOfDir);
      
    if (sizeOfDir >= Number(maxSize)) {
      try {
        (await readdir(arr[i])).forEach(async (el) => {
          const isDir =  (await stat(`${arr[i]}/${el}`)).isDirectory();
          console.log(`${arr[i]}/${el} is Direction`, isDir);
     
          if (isDir){
            const sizeDir = (await fastFolderSizeAsync(`${arr[i]}/${el}`))/1048576;
            console.log('this is size ofDir', sizeDir);
            console.log('this is max size', maxSizeDir);
            if(sizeDir > maxSizeDir){
              console.log('Зашел сюда');
              
             (await readdir(`${arr[i]}/${el}`)).forEach(e => fse.remove(`${arr[i]}/${el}/${e}`))
            }
          } else {
            // await writeFile(`${arr[i]}/${el}`, `echo '' > bitokk.log`)
            echo '' > bitokk.log
          }  
        })
      } catch (error) {
        throw error
      }
    }

  }
  return true
}

// .txt .log

async function cleaner(arr, maxSize, maxSizeDir) {
  let flag = await validateDirs(arr)
  console.log("This is flag", flag)
  try {
    if (flag) return await clearMemory(arr, maxSize, maxSizeDir)
  } catch (error) {
    throw error
  }

}

cleaner(DIRS, Number(MAX_SIZE), Number(MAX_SUBDIR))

// setInterval(() => {
//   if (DIRS && Number(MAX_SIZE) && Number(MAX_SIZE_SUBDIR)) {
//     console.log('App is start');
//     cleaner(DIRS, Number(MAX_SIZE), Number(MAX_SIZE_SUBDIR))
//   }
//   else {
//     console.log("No data provided")
//     process.exit(0)
//   }
// }, 1000)



