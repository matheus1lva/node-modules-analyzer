import { analyze } from '../src';
import path from 'path';

const fixturePath = path.resolve(module.filename, '../../fixtures/simpleApp');

describe('SimpleApp', () => {
  it('should scan the whole tree without breaking anything and showing everything', () => {
    const results = analyze(fixturePath);
    const expectedResult = {
      'simpleApp/@babel': {
        problems: ['Jenkinsfile', 'Jenkinsfile', 'LICENSE', 'LICENSE-MIT', 'LICENSE.txt'],
        saved: '12.4 MB'
      },
      'simpleApp/@babel/helpers1': {
        problems: ['Jenkinsfile'],
        saved: '6.2 MB'
      },
      'simpleApp/@babel/helpers2': {
        problems: ['Jenkinsfile'],
        saved: '6.2 MB'
      },
      'simpleApp/@babel/multiple-licenses': {
        problems: ['LICENSE', 'LICENSE-MIT', 'LICENSE.txt'],
        saved: '4 Bytes'
      },
      'simpleApp/@emotion': {
        problems: [
          'src',
          'tsconfig.json',
          'tslint.json',
          'src',
          'tsconfig.json',
          'tslint.json',
          'src',
          'tsconfig.json',
          'tslint.json',
          'src',
          'tsconfig.json',
          'tslint.json'
        ],
        saved: '29.4 KB'
      },
      'simpleApp/@emotion/cache': {
        problems: ['src', 'tsconfig.json', 'tslint.json'],
        saved: '9.6 KB'
      },
      'simpleApp/@emotion/core': {
        problems: ['src', 'tsconfig.json', 'tslint.json'],
        saved: '16.2 KB'
      },
      'simpleApp/@emotion/css': {
        problems: ['src', 'tsconfig.json', 'tslint.json'],
        saved: '888 Bytes'
      },
      'simpleApp/@emotion/hash': {
        problems: ['src', 'tsconfig.json', 'tslint.json'],
        saved: '2.7 KB'
      },
      'simpleApp/faulty-source': {
        problems: ['src'],
        saved: '23 Bytes'
      },
      'simpleApp/other-dep': {
        problems: ['AUTHORS'],
        saved: '6.2 MB'
      }
    };
    expect(results.perPackage).toEqual(expectedResult);
    expect(results.totalSaved).toEqual(6533216);
  });
});
