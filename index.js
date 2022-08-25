const { promisify } = require('util');
const path = require('path');

const fastFolderSize = require('fast-folder-size');
const fastFolderSizeAsync = promisify(fastFolderSize);

const fse = require('fs-extra');
const { stat, readdir } = require('fs/promises');

const { DIRS, MAX_SIZE } = require("./config/config");


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

async function clearMemory(arr, maxSize) {

  for (let i = 0; i < arr.length; i++) {
    const sizeOfDir = (await fastFolderSizeAsync(arr[i]))/1073741824;  //GB
    console.log('This is size of Dir', sizeOfDir);
      
    if (sizeOfDir >= Number(maxSize)) {
      try {
        (await readdir(arr[i])).forEach(el =>  fse.remove(`${arr[i]}/${el}`))
      } catch (error) {
        throw error
      }
    }

  }
  return true
}


async function cleaner(arr, maxSize) {
  let flag = await validateDirs(arr)
  console.log("This is flag", flag)
  try {
    if (flag) return await clearMemory(arr, maxSize)
  } catch (error) {
    throw error
  }

}

// cleaner(DIRS, Number(MAX_SIZE))

setInterval(() => {
  if (DIRS && Number(MAX_SIZE)) {
    console.log('App is start');
    cleaner(DIRS, Number(MAX_SIZE))
  }
  else {
    console.log("No data provided")
    process.exit(0)
  }
}, 1000)



