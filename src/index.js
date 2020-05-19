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

const mountGraph = (rootDirs) => {
  const results = {};
  rootDirs.forEach((dir) => {
    console.log(dir);
    const subDirectories = getDirectories(dir);
    if (!hasNMInside(dir)) {
      const problems = subDirectories.map((sd) => {
        const dirName = sd.split('/').pop();
        return blacklisted.includes(dirName.toLowerCase());
      });
      results[dir] = problems;
    }
  });
  return results;
}

const run = () => {
  const pathNM = path.resolve(process.cwd(), 'node_modules/')

  const initialDirs = getDirectories(pathNM);
  console.log(mountGraph(initialDirs));
}

run()
