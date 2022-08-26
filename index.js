const { promisify } = require('util');
const path = require('path');

const fastFolderSize = require('fast-folder-size');
const fastFolderSizeAsync = promisify(fastFolderSize);

const fse = require('fs-extra');
const { stat, readdir,  } = require('fs/promises');

const { DIRS, MAX_SIZE, MAX_SUBDIR, FILE_EXTENSIONS, CURRENTS_FILE, SIZE_CURR_FILE } = require("./config/config");
const { exec } = require('child_process');

// console.log('MAXSUBDIR', MAX_SUBDIR);


async function validator(arr){
    // console.log('This is arr in validator', arr)
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

async function clearMemory(arr, maxSize, maxSizeDir, extensions) {

  for (let i = 0; i < arr.length; i++) {
    // const sizeOfDir = (await fastFolderSizeAsync(arr[i]))/1073741824;  //GB
    const sizeOfDir = (await fastFolderSizeAsync(arr[i]))/1048576;  //MB
      
    if (sizeOfDir >= Number(maxSize)) {
      try {
        (await readdir(arr[i])).forEach(async (el) => {
          const isDir =  (await stat(`${arr[i]}/${el}`)).isDirectory();
     
          if (isDir){
            const sizeDir = (await fastFolderSizeAsync(`${arr[i]}/${el}`))/1048576;

            if(sizeDir > maxSizeDir){
              
             (await readdir(`${arr[i]}/${el}`)).forEach(e => {
              fse.remove(`${arr[i]}/${el}/${e}`)
             }
              )
            }
          } ;

           if(!isDir && !extensions.includes(path.extname(`${arr[i]}/${el}`))) {
            exec(`echo '' > ${arr[i]}/${el}`)
          };
          
        })
      } catch (error) {
        throw error
      }
    }

  }
  return true
}

async function clearCurrsFile(arr, sizeCurrFile){
  for(let i = 0; i < arr.length; i++){
    let sizeOfFile = (await stat(arr[i])).size/1048576; //MB
    if(sizeOfFile > sizeCurrFile)  exec(`echo '' > ${arr[i]}`)
  }
}

async function cleaner(arr, maxSize, maxSizeDir, extensions) {
  let flag = await validator(arr)
  try {
    if (flag) return await clearMemory(arr, maxSize, maxSizeDir, extensions)
  } catch (error) {
    throw error
  }

}

async function cleanerCurrsFile(arr, sizeCurrFile) {
  let flag = await validator(arr)
  try {
    if (flag) return await clearCurrsFile(arr, sizeCurrFile)
  } catch (error) {
    throw error
  }

}


setInterval(() => {
  let flagCleanerDirs =true;
  let flagCleanerFile =true;

  if (DIRS && Number(MAX_SIZE) && Number(MAX_SUBDIR) && FILE_EXTENSIONS) {
    console.log('App is start');
    cleaner(DIRS, Number(MAX_SIZE), Number(MAX_SUBDIR), FILE_EXTENSIONS)
  }
  else {
    console.log("No data provided");
    flagCleanerDirs = false
  }
  if (CURRENTS_FILE && Number(SIZE_CURR_FILE)) {
    console.log('Cleaner of current file is start');
    cleanerCurrsFile(CURRENTS_FILE, Number(SIZE_CURR_FILE))
  }
  else {
    console.log("Path oh Current File not exists");
    flagCleanerFile =false;
  }
  if(!flagCleanerDirs && !flagCleanerFile) process.exit(0)

}, 5000)



