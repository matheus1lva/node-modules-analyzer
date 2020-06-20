import fs from 'fs';
import path from 'path';
import { Problems } from './Problems';

export default class Graph {
  walkGraph(dir: string) {
    const files = fs.readdirSync(dir);
    files
      .filter(
        (fileOrDir) =>
          !fileOrDir.includes('.bin') ||
          !fileOrDir.includes('.cache') ||
          !fileOrDir.includes('cache')
      )
      .forEach((file) => {
				const filepath = path.join(dir, file);
				debugger
				const problems = new Problems(filepath);
        const stats = fs.statSync(filepath);
        if (stats.isDirectory()) {
          this.walkGraph(filepath);
        } else if (stats.isFile()) {
        }
      });
  }
}
