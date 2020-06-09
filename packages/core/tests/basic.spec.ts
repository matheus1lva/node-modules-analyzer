import { analyze } from '../src';
import path from 'path';

const fixturePath = path.resolve(module.filename, '../../test-node-modules');

describe('should run test', () => {
  it('should scan the whole tree without breaking anything and showing everything', () => {
    const results = analyze(fixturePath);
    const expectedResult = {
      "node-modules-analyzer/@emotion/cache": {
        problems: [
          "CHANGELOG.md",
          "src",
          "tsconfig.json",
          "tslint.json"
        ],
        saved: "11.5 KB"
      },
      "node-modules-analyzer/@emotion/core": {
        problems: [
          "CHANGELOG.md",
          "src",
          "tsconfig.json",
          "tslint.json"
        ],
        saved: "21.4 KB"
      },
      "node-modules-analyzer/@emotion/css": {
        problems: [
          "CHANGELOG.md",
          "src",
          "tsconfig.json",
          "tslint.json"
        ],
        saved: "2.6 KB"
      },
      "node-modules-analyzer/@emotion/hash": {
        problems: [
          "CHANGELOG.md",
          "src",
          "tsconfig.json",
          "tslint.json"
        ],
        saved: "3.8 KB"
      },
      "core/faulty-source": {
        problems: [
          "src"
         ],
         saved: "23 Bytes"
      },
      "core/other-dep": {
        problems: [
          "AUTHORS"
        ],
        saved: "6.2 MB"
      }
    };
    expect(results.perPackage).toEqual(expectedResult);
    expect(results.totalSaved).toEqual(6543379);
  })
})
