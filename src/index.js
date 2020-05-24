const path = require('path')
const { readdirSync } = require('fs');
const { getFolderSize, convertBytes } = require('./analyzer');

const blacklisted = ['examples', 'src', 'tests', 'docs', 'out']

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => {
      return path.resolve(path.join(process.cwd(), 'node_modules'), dirent.name)
    })

const getSubDirectories = (root) => {
  return readdirSync(root, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => {
      return path.join(root, dirent.name);
    })
}

const hasNMInside = source => {
  return readdirSync(source).some(dir => {
    return dir.name === 'node_modules'
  })
};

const isNamespaceDependency = (source) => {
  return (source || '').includes('@');
}

const getProblems = directory => {
  const results = {
    problems: [],
    totalSize: 0
  };
  directory.forEach(dir => {
    const dirName = dir
      .split('/')
      .pop()
      .toLowerCase()
    const results2 = blacklisted.filter(bl => {
      return bl.includes(dirName);
    }).map((bl) => {
      const size = getFolderSize(dir);
      results.totalSize += parseInt(size);
      return bl;
    }).filter((i) => Boolean(i));
    results.problems = [...results.problems, ...results2]
  })
  return results;
}

const cleanupDirName = fullPath => {
  const splittedPath = fullPath.split('/');
  const packageName = splittedPath.pop();
  if (fullPath.includes('@')) {
    const scope = splittedPath[splittedPath.length - 1];
    return `${scope}/${packageName}`;
  }
  return packageName;
}

const mountGraph = rootDirs => {
  const results = {
    youCanSaveUpto: 0
  }
  rootDirs.forEach(dir => {
    const subDirectories = getSubDirectories(dir);
    if (!hasNMInside(dir)) {
      const problems = getProblems(subDirectories)
      if (problems.problems.length) {
        results.youCanSaveUpto += parseInt(problems.totalSize);
        results[cleanupDirName(dir)] = {
          problems: problems.problems,
          savedUpSize: convertBytes(problems.totalSize)
        }
      }
    }

    if (isNamespaceDependency(dir)) {
      const readTopRootDir = getSubDirectories(dir);
      const results2 = mountGraph(readTopRootDir);
      Object.assign(results, results2);
    }
  })
  return results
}

const run = () => {
  const pathNM = path.resolve(process.cwd(), 'node_modules/')
  const initialDirs = getDirectories(pathNM)
  const results = mountGraph(initialDirs)
  console.log(JSON.stringify(results, null, 2));
}

module.exports = run
