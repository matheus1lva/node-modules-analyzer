#!/usr/bin/env node
const path = require('path')
const { readdirSync } = require('fs')

const blacklisted = ['examples', 'src', 'tests', 'docs'];

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => {
      return path.resolve(path.join(process.cwd(), 'node_modules'), dirent.name)
    })

const hasNMInside = (source) => {
  return readdirSync(source).some((dir) => dir.name === 'node_modules')
}

const getProblems = (directory) => {
  let results = [];
  directory.forEach((dir) => {
    const dirName = dir.split('/').pop().toLowerCase();
    const results2 = blacklisted.filter((bl) => {
      return bl.includes(dirName);
    })
    results = [
      ...results,
      ...results2
    ]
  });
  return results;
}

const cleanupDirName = (fullPath) => {
  return fullPath.split('/').pop().toLowerCase();
}

const mountGraph = (rootDirs) => {
  const results = {};
  rootDirs.forEach((dir) => {
    const subDirectories = getDirectories(dir);
    if (!hasNMInside(dir)) {
      const problems = getProblems(subDirectories);
      if (problems.length) {
        results[cleanupDirName(dir)] = problems;
      }
    }
  });
  return results;
}

const run = () => {
  const pathNM = path.resolve(process.cwd(), 'node_modules/')
  const initialDirs = getDirectories(pathNM);
  const results = mountGraph(initialDirs);
  console.log(results);
}

module.exports = run;
