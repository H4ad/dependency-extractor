import { describe, expect, it } from 'vitest';
import {
  DependencyInfo,
  DependencyType,
  NpmExtractor,
  PackageLockContent,
} from '../src';

describe(NpmExtractor.name, () => {
  it('should parse correctly the examples', () => {
    const packageLockContentExample: PackageLockContent = {
      dependencies: {
        vitest: {
          dev: true,
          version: '1.0.0',
          integrity: '1',
          requires: {},
          resolved: '',
          dependencies: {
            typescript: {
              version: '2.0.0',
              dev: false,
              peer: true,
              optional: true,
              resolved: '23',
              integrity: '23',
            },
          },
        },
        '@h4ad/serverless-adapter': {
          dev: false,
          version: '3.0.0',
          resolved: '',
          integrity: '',
        },
      },
    };

    const extractor = new NpmExtractor();
    const extractorData = extractor.parse(
      JSON.stringify(packageLockContentExample),
    );

    const expected: DependencyInfo[] = [
      new DependencyInfo(
        'vitest',
        '1.0.0',
        DependencyType.NONE | DependencyType.DEVELOPMENT,
      ),
      new DependencyInfo(
        'typescript',
        '2.0.0',
        DependencyType.NONE |
          DependencyType.PRODUCTION |
          DependencyType.PEER |
          DependencyType.OPTIONAL,
      ),
      new DependencyInfo(
        '@h4ad/serverless-adapter',
        '3.0.0',
        DependencyType.NONE | DependencyType.PRODUCTION,
      ),
    ];

    expect(JSON.stringify(extractorData.getAllDependencies())).toEqual(
      JSON.stringify(expected),
    );
  });

  it('should throw error if something other than package-lock.json structure is sent', () => {
    const extractor = new NpmExtractor();

    expect(() =>
      extractor.parse(JSON.stringify({ potato: true })),
    ).toThrowError('sent is not');
  });

  it('should throw error if some wrong json is sent', () => {
    const extractor = new NpmExtractor();

    expect(() => extractor.parse('{dependencies:[]')).toThrowError('not parse');
  });
});
