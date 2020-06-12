import fs from 'fs';
import path from 'path';

export function getAllFiles(dirPath: string): Array<string> {
  const files = fs.readdirSync(dirPath);

  let arrayOfFiles = [];

  files.forEach((file) => {
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      arrayOfFiles = getAllFiles(`${dirPath}/${file}`);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
}

export function convertBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) {
    return 'n/a';
  }

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  if (i === 0) {
    return `${bytes} ${sizes[i]}`;
  }

  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export function getFolderSize(directoryPath: string): number {
  if (fs.statSync(directoryPath).isDirectory()) {
    const arrayOfFiles = getAllFiles(directoryPath);
    let totalSize = 0;

    arrayOfFiles.forEach((filePath) => {
      totalSize += fs.statSync(filePath).size;
    });

    return totalSize;
  }
  return fs.statSync(directoryPath).size;
}
