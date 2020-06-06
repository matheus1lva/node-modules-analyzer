import path from 'path';
import { readdirSync, Dirent } from 'fs';
import { getFolderSize, convertBytes } from './sizeUtils';
import blacklisted from './blacklisted';
import { getAllNodeModules } from './finders';

function getDirectories(source: string) {
  return readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => {
      return path.resolve(path.join(source, dirent.name));
    });
}

const getSubDirectories = (root: string) => {
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

const getProblems = (name: string[]) => {
  const subReport = {
    problems: [],
    totalSize: 0
  };

  name.forEach((dir: string) => {
    const dirName = dir.split('/').pop();

    const problemsFound = blacklisted
      .filter((blackListed) => {
        return blackListed === dirName;
      })
      .map((itemBlacklisted) => {
        if (itemBlacklisted) {
          const size = getFolderSize(dir);
          subReport.totalSize += size;
          return itemBlacklisted;
        }
      });
    subReport.problems = [...subReport.problems, ...problemsFound];
  });
  return subReport;
};

const cleanupDirName = (fullPath: string) => {
  const splittedPath = fullPath.split('/');
  const rootPackage = splittedPath[splittedPath.length -3];
  const packageName = splittedPath.pop();
  if (fullPath.includes('@')) {
    const parentOfScopped = splittedPath[splittedPath.length -5];
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
      const report = getProblems(subDirectories);
      if (report.problems.length) {
        results.totalSaved += report.totalSize;
        results.perPackage[cleanupDirName(dir)] = {
          problems: report.problems,
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
  const pathNM = pathToNodeModules
    ? [path.resolve(pathToNodeModules)]
    : getAllNodeModules(process.cwd());
  const result = {
    perPackage: [],
    totalSaved: 0
  };
  pathNM.forEach((nodePath) => {
    const initialDirs = getDirectories(nodePath);
    const { perPackage, totalSaved } = mountGraph(initialDirs);
    result.perPackage = { ...result.perPackage, ...perPackage };
    result.totalSaved += totalSaved;
  });
  return result;
}

export * from './reporters';
