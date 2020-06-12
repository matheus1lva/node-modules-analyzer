import { analyze } from '../src';
import path from 'path';

const fixturePath = path.resolve(module.filename, '../../fixtures/simpleApp');

describe('SimpleApp', () => {
  it('should scan the whole tree without breaking anything and showing everything', () => {
    const results = analyze(fixturePath);
    const expectedResult = {
      "simpleApp/@emotion/cache": {
        "problems": [
          "CHANGELOG.md",
          "src",
          "tsconfig.json",
          "tslint.json"
        ],
        "saved": "11.5 KB"
      },
      "simpleApp/@emotion/core": {
        "problems": [
          "CHANGELOG.md",
          "src",
          "tsconfig.json",
          "tslint.json"
        ],
        "saved": "21.4 KB"
      },
      "simpleApp/@emotion/css": {
        "problems": [
          "CHANGELOG.md",
          "src",
          "tsconfig.json",
          "tslint.json"
        ],
        "saved": "2.6 KB"
      },
      "simpleApp/@emotion/hash": {
        "problems": [
          "CHANGELOG.md",
          "src",
          "tsconfig.json",
          "tslint.json"
        ],
        "saved": "3.8 KB"
      },
      "simpleApp/faulty-source": {
        "problems": [
          "src"
        ],
        "saved": "23 Bytes"
      },
      "simpleApp/other-dep": {
        "problems": [
          "AUTHORS"
        ],
        "saved": "6.2 MB"
      }
    };
    expect(results.perPackage).toEqual(expectedResult);
    expect(results.totalSaved).toEqual(6543379);
  })
})
