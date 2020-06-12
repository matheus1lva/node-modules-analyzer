import { analyze } from '../src';
import path from 'path';

const fixturePath = path.resolve(module.filename, '../../fixtures/monorepo');

describe('Monorepo', () => {
  it('should scan the whole tree without breaking anything and showing everything as expected', () => {
    const results = analyze(fixturePath);
    const expectedResult = {
      'app/@babel/helpers1': {
        problems: ['Jenkinsfile'],
        saved: '6.2 MB'
      },
      'app/@babel/helpers2': {
        problems: ['Jenkinsfile'],
        saved: '6.2 MB'
      },
      'app/@emotion/cache': {
        problems: ['src', 'tsconfig.json', 'tslint.json'],
        saved: '9.6 KB'
      },
      'app/@emotion/core': {
        problems: ['src', 'tsconfig.json', 'tslint.json'],
        saved: '16.2 KB'
      },
      'app/@emotion/css': {
        problems: ['src', 'tsconfig.json', 'tslint.json'],
        saved: '888 Bytes'
      },
      'app/@emotion/hash': {
        problems: ['src', 'tsconfig.json', 'tslint.json'],
        saved: '2.7 KB'
      },
      'app/faulty-source': {
        problems: ['src'],
        saved: '23 Bytes'
      },
      'app/other-dep': {
        problems: ['AUTHORS'],
        saved: '6.2 MB'
      },
      'app/rgm': {
        problems: ['LICENSE-EXAMPLES'],
        saved: '260 Bytes'
      }
    };
    expect(results.perPackage).toEqual(expectedResult);
    expect(results.totalSaved).toEqual(6533476);
  });
});
