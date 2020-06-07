import findPackages from 'find-all-package-files';
import path from 'path';
import { existsSync } from 'fs';

export function getAllNodeModules(root) {
  // where package jsons are
  const locationOfPackage = findPackages(root);

  // that is easy! Because where a package.json is
  // 99% of the time there is a node_modules!
  return locationOfPackage
    .map((location) => {
      const splittedPath = location.split('/');
      splittedPath.pop();

      const pathToNm = path.resolve(splittedPath.join('/'), 'node_modules');
      if (existsSync(pathToNm)) {
        return pathToNm;
      }
    })
    .filter(Boolean);
}
