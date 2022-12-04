import { describe, expect, it } from 'vitest';
import {
  DependencyInfo,
  DependencyType,
  NpmExtractor,
  PackageLockContentV2,
  PackageLockContentV3,
} from '../src';

describe(NpmExtractor.name, () => {
  it('should parse correctly the package lock v2', () => {
    const packageLockContentExample: PackageLockContentV2 = {
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

  it('should parse correctly the package lock v3', () => {
    const packageLockContentExample: PackageLockContentV3 = {
      packages: {
        '': {
          name: 'root',
          version: '1.0.0',
          dependencies: {
            vitest: '1.0.0',
          },
        },
        'node_modules/vitest': {
          dev: true,
          version: '1.0.0',
          integrity: '1',
          resolved: '',
          dependencies: {
            typescript: '2.0.0',
            tslib: '2.0.0',
          },
        },
        'node_modules/vitest/node_modules/typescript': {
          version: '2.0.0',
          optional: true,
          resolved: '23',
          integrity: '23',
        },
        'node_modules/vitest/node_modules/tslib': {
          version: '2.0.0',
          peer: true,
          resolved: '23',
          integrity: '23',
        },
        'node_modules/@h4ad/serverless-adapter': {
          version: '3.0.0',
          resolved: '',
          integrity: '',
        },
        'node_modules/@h4ad/serverless-adapter/node_modules/acorn': {
          version: '2.0.0',
          devOptional: true,
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
          DependencyType.OPTIONAL,
      ),
      new DependencyInfo(
        'tslib',
        '2.0.0',
        DependencyType.NONE | DependencyType.PEER,
      ),
      new DependencyInfo(
        '@h4ad/serverless-adapter',
        '3.0.0',
        DependencyType.NONE | DependencyType.PRODUCTION,
      ),
      new DependencyInfo(
        'acorn',
        '2.0.0',
        DependencyType.NONE |
          DependencyType.DEVELOPMENT |
          DependencyType.OPTIONAL,
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
