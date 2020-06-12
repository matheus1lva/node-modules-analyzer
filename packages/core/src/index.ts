import path from 'path';
import { readdirSync, Dirent } from 'fs';
import { convertBytes } from './sizeUtils';
import { getAllNodeModules } from './finders';
import { Problems } from './Problems';

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

const cleanupDirName = (fullPath: string) => {
  const splittedPath = fullPath.split('/');
  const rootPackage = splittedPath[splittedPath.length - 3];
  const packageName = splittedPath.pop();
  if (fullPath.includes('@')) {
    let parentOfScopped = splittedPath[splittedPath.length - 2];
    if(parentOfScopped === 'node_modules') {
      parentOfScopped = splittedPath[splittedPath.length - 3];
    }
    const scope = splittedPath[splittedPath.length - 1];
    return `${parentOfScopped}/${scope}/${packageName}`;
  }

  return `${rootPackage}/${packageName}`;
};

const mountGraph = (rootDir: string[]) => {
  const results = {
    totalSaved: 0,
    perPackage: {}
  };

  rootDir.forEach((dir: string) => {
    const subDirectories = getSubDirectories(dir);
    if (!hasNMInside(dir)) {
      const { report } = new Problems(subDirectories);
      if (report.problems.length) {
        results.totalSaved += report.totalSize;
        results.perPackage[cleanupDirName(dir)] = {
          problems: Array.from(report.problems),
          saved: convertBytes(report.totalSize)
        };
      }
    }

    if (isNamespaceDependency(dir)) {
      const readTopRootDir = getSubDirectories(dir);
      const subReport = mountGraph(readTopRootDir);
      Object.assign(results, subReport);
    }
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
    debugger;
    const { perPackage, totalSaved } = mountGraph(initialDirs);
    result.perPackage = { ...result.perPackage, ...perPackage };
    result.totalSaved += totalSaved;
  });

  return result;
}

export * from './reporters';
