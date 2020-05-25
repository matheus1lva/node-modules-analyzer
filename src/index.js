const path = require('path');
const { readdirSync } = require('fs');
const { getFolderSize, convertBytes } = require('./sizeUtils');
const blacklisted = require('./blacklisted');
const { defaultReporter } = require('./reporters');

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => {
      return path.resolve(path.join(process.cwd(), 'node_modules'), dirent.name);
    });

const getSubDirectories = (root) => {
  return readdirSync(root, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => {
      return path.join(root, dirent.name);
    });
};

const hasNMInside = (source) => {
  return readdirSync(source).some((dir) => {
    return dir.name === 'node_modules';
  });
};

const isNamespaceDependency = (source) => {
  return (source || '').includes('@');
};

const getProblems = (rootDir) => {
  const subReport = {
    problems: [],
    totalSize: 0
  };

  rootDir.forEach((dir) => {
    const dirName = dir
      .split('/')
      .pop()
      .toLowerCase();

    const problemsFound = blacklisted
      .filter((blackListed) => {
        return blackListed.includes(dirName);
      })
      .map((blackListed) => {
        if (blackListed) {
          const size = getFolderSize(dir);
          subReport.totalSize += parseInt(size);
          return blackListed;
        }
      });

    subReport.problems = [...subReport.problems, ...problemsFound];
  });
  return subReport;
};

const cleanupDirName = (fullPath) => {
  const splittedPath = fullPath.split('/');
  const packageName = splittedPath.pop();
  if (fullPath.includes('@')) {
    const scope = splittedPath[splittedPath.length - 1];
    return `${scope}/${packageName}`;
  }
  return packageName;
};

const mountGraph = (rootDir) => {
  const results = {
    totalSaved: 0,
    perPackage: {}
  };

  rootDir.forEach((dir) => {
    const subDirectories = getSubDirectories(dir);
    if (!hasNMInside(dir)) {
      const report = getProblems(subDirectories);
      if (report.problems.length) {
        results.totalSaved += parseInt(report.totalSize);
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

const run = (pathToNodeModules) => {
  const pathNM = pathToNodeModules || path.resolve(process.cwd(), 'node_modules/');
  const initialDirs = getDirectories(pathNM);
  const results = mountGraph(initialDirs);
  defaultReporter(results);
};

module.exports = run;
