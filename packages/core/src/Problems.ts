import { hasKey } from "./utils";
import { getFolderSize } from "./sizeUtils";
import blacklisted from "./blacklisted";

export class Problems {
  constructor(readonly paths: string[]) {
    this.scan();
  }

  report = {
    problems: [],
    totalSize: 0
  }

	scanSrcFolder(packageJson, path: string) {
    if(packageJson && path.includes('src')) {
      const mainField = packageJson?.main;
      const devDeps = packageJson?.devDependencies;
      const hasFlow = hasKey(devDeps, 'flow-bin');

      // edge case for flow binaries, where the don't have any way
      // to get the type definitions as ts has
      if(mainField?.includes('dist/') && !hasFlow){
        this.report.problems = [...this.report.problems, "src"];
        this.report.totalSize += getFolderSize(path);
      }
    }
  }

  scan() {
    this.paths.forEach((dir: string) => {
      const splittedFullPath = dir.split('/');
      const dirName = splittedFullPath.pop();
      const fullpathWithoutFilename = splittedFullPath.join('/');
      let packageJson = null;
      try {
        packageJson = require(`${fullpathWithoutFilename}/package.json`);
      }catch (err) {
        // do nothing
      }
      debugger;
      this.scanSrcFolder(packageJson, dir);

      const problemsFound = blacklisted
        .filter((blackListed) => {
          return blackListed === dirName;
        })
        .map((itemBlacklisted) => {
          if (itemBlacklisted) {
            const size = getFolderSize(dir);
            this.report.totalSize += size;
            return itemBlacklisted;
          }
        });
      this.report.problems = [ ...this.report.problems, ...problemsFound ];
    });
  }
}
