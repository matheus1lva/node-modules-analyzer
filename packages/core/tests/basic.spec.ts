import { analyze } from '../src';
import path from 'path';

const fixturePath = path.resolve(module.filename, '../../test-node-modules');

describe('should run test', () => {
  it('should scan the whole tree without breaking anything and showing everything', () => {
    const results = analyze(fixturePath);
    const expectedResult = {
      "core/faulty-source": {
        "problems": [
          "src",
        ],
        "saved": "23 Bytes",
      },
      "core/other-dep": {
        "problems":[
          "AUTHORS",
        ],
        "saved": "6.2 MB",
      },
      "node-modules-analyzer/@babel/helpers1": {
        "problems":[
          "Jenkinsfile",
        ],
        "saved": "6.2 MB",
      },
      "node-modules-analyzer/@babel/helpers2": {
        "problems":[
          "Jenkinsfile",
        ],
        "saved": "6.2 MB",
      },
    }
    expect(results.perPackage).toEqual(expectedResult);
    expect(results.totalSaved).toEqual(19509191);
  })
})
