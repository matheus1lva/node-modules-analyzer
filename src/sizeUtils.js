/* eslint-disable security/detect-non-literal-fs-filename */
const fs = require('fs');
const path = require('path');

const getAllFiles = (dirPath) => {
  const files = fs.readdirSync(dirPath);

  let arrayOfFiles = [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
};

const convertBytes = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) {
    return 'n/a';
  }

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

  if (i === 0) {
    return `${bytes} ${sizes[i]}`;
  }

  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const getFolderSize = (directoryPath) => {
  if (fs.statSync(directoryPath).isDirectory()) {
    const arrayOfFiles = getAllFiles(directoryPath);
    let totalSize = 0;

    arrayOfFiles.forEach(function(filePath) {
      totalSize += fs.statSync(filePath).size;
    });

    return totalSize;
  }
  return fs.statSync(directoryPath).size;
};

module.exports = {
  getFolderSize,
  convertBytes
};
