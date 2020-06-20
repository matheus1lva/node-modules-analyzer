import path from 'path';
import { readdirSync, Dirent, lstatSync } from 'fs';
import { convertBytes } from './sizeUtils';
import { getAllNodeModules } from './finders';
import { Problems } from './Problems';
import { deepMerge } from './utils';
import { cleanupDirName } from './NameUtilities';
import Graph from './Graph';

const storagePaths = ['.bin', 'cache', '.cache'];

function getDirectories(source: string) {
  return readdirSync(source, { withFileTypes: true })
    .filter((dirent) => {
      return dirent.isDirectory() && !storagePaths.includes(dirent.name);
    })
    .map((dirent) => {
      return path.resolve(path.join(source, dirent.name));
    });
}

export const getSubDirectories = (root: string) => {
  return readdirSync(root, { withFileTypes: true }).map((dirent) => {
    return path.join(root, dirent.name);
  });
};

function hasNMInside(source: string) {
  // @ts-ignore
  return readdirSync(source).some((dir: Dirent) => {
    return dir.name === 'node_modules';
  });
}

function isNamespaceDependency(source: string) {
  const currentFolder = source.split('/').pop();
  return currentFolder.includes('@');
}

const graph = new Graph();

const mountGraph = (rootDir: string[]) => {
  let results = {
    totalSaved: 0,
    perPackage: {}
  };

  
  rootDir.forEach((dir: string) => {
    graph.walkGraph(dir);
    //   const subDirectories = getSubDirectories(dir);

  //   if (isNamespaceDependency(dir)) {
  //     const readTopRootDir = getSubDirectories(dir);
  //     const subReport = mountGraph(readTopRootDir);
  //     results = deepMerge(results, subReport);
  //   }else if (!hasNMInside(dir)) {

  //     // prevent from scanning eslint folders!
  //     // Some of the files inside eslint-* are actually useful
  //     if(lstatSync(dir).isDirectory() && dir.includes('eslint')) {
  //       return;
  //     }

  //     const { report } = new Problems(subDirectories);
  //     if (report.problems.length) {
  //       const cleanedUpName = cleanupDirName(dir);
  //       results.totalSaved += report.totalSize;
  //       results.perPackage[cleanedUpName] = {
  //         problems: report.problems,
  //         saved: convertBytes(report.totalSize)
  //       };
  //     }
  //   }
  });

  return results;
};

export function analyze(pathToNodeModules) {
  const initialPath = pathToNodeModules || process.cwd();
  const pathNM = getAllNodeModules(initialPath);
  const result = {
    perPackage: [],
    totalSaved: 0
  };

  pathNM.forEach((nodePath: string) => {
    const initialDirs = getDirectories(nodePath);
    mountGraph(initialDirs);
    // result.perPackage = {
    //   ...result.perPackage,
    //   ...perPackage
    // };
    // result.totalSaved += totalSaved;
  });

  return result;
}

export * from './reporters';
