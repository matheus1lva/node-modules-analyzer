import { analyze } from '../src';
import path from 'path';

const fixturePath = path.resolve(__dirname, '../test-node-modules');

describe('should run test', () => {
  it('should scan the whole tree without breaking anything and showing everything', () => {
    const results = analyze(fixturePath);
    const expectedResult = {
      "cli/other-dep": {
        "problems":[
          "AUTHORS",
        ],
        "saved": "6.2 MB",
      },
      "node-module-analyzer/@babel/helpers1": {
        "problems":[
          "Jenkinsfile",
        ],
        "saved": "6.2 MB",
      },
      "node-module-analyzer/@babel/helpers2": {
        "problems":[
          "Jenkinsfile",
        ],
        "saved": "6.2 MB",
      },
    }
    expect(results.perPackage).toEqual(expectedResult);
    expect(results.totalSaved).toEqual(19509168);
  })
})