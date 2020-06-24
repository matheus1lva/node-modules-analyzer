import fs from 'fs';
import path from 'path';
import { Problems } from './Problems';

export default class Graph {
  report = {
    totalSaved: 0,
    perPackage: {}
  }
  walkGraph(dir: string) {
    const files = fs.readdirSync(dir);
    files
      .filter(
        (fileOrDir) =>{
          return !fileOrDir.includes('.bin') &&
          !fileOrDir.includes('.cache') &&
          !fileOrDir.includes('cache')
        }
      )
      .forEach((file) => {
        const filePath = path.join(dir, file);
        const problems = new Problems(filePath);
        const matchPackageName = filePath.match(/node_modules\/(\D.+?(?=\/))/);
        // this can be a scopped package or a simple package name!
        let packageName = matchPackageName[1];
        if(packageName.includes('@')){
          const matchePackageName = filePath.match(/node_modules\/[a-z\@]+\/(\D.+?(?=\/))/);
          if(matchePackageName) {
            packageName = `${packageName}/${matchePackageName[1]}`;
          }
        }

        this.report.totalSaved += problems.report.totalSize;
        this.report.perPackage[packageName] = {
          problems: problems.report.problems,
          totalSaved: problems.report.totalSize
        }
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          this.walkGraph(filePath);
        } else if (stats.isFile()) {
        }
      });
  }
}
