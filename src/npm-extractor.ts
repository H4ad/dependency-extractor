//#region Imports

import {
  DependencyAccumulator,
  PackageLockContent,
  PackageLockDependency,
} from './@types';
import { DependencyInfo, DependencyType, ExtractorContract } from './contracts';
import { ExtractorContainer } from './core';

//#endregion

/**
 * The extractor that can parse package-lock.json files of npm.
 */
export class NpmExtractor implements ExtractorContract {
  //#region Public Methods

  /**
   * @inheritDoc
   */
  public parse(lockFileContent: string): ExtractorContainer {
    let parsedObject: unknown | null = null;

    try {
      parsedObject = JSON.parse(lockFileContent);
    } catch (e) {
      throw new Error(
        `Couln't not parse lockFileContent, check if the lock file is really a JSON. More details: ${e.message}`,
      );
    }

    if (!this.isPackageLockFile(parsedObject))
      throw new Error('The lockFileContent sent is not a package-lock.json.');

    const accumulator: DependencyAccumulator = {
      [DependencyType.NONE]: [],
      [DependencyType.DEVELOPMENT]: [],
      [DependencyType.PRODUCTION]: [],
      [DependencyType.PEER]: [],
      [DependencyType.OPTIONAL]: [],
    };

    this.accumulatedDependencies(accumulator, parsedObject);

    return new ExtractorContainer(accumulator);
  }

  //#endregion

  //#region Protected Methods

  /**
   * Check if the lock file content is a package-lock.json
   *
   * @param lockFileContent The lock file content
   */
  protected isPackageLockFile(
    lockFileContent: unknown,
  ): lockFileContent is PackageLockContent {
    return !!(
      lockFileContent &&
      typeof lockFileContent === 'object' &&
      'dependencies' in lockFileContent &&
      lockFileContent['dependencies']
    );
  }

  /**
   * Method to accumulate dependencies recursively until we go through all dependencies to sub-dependencies.
   *
   * @param accumulator The accumulator
   * @param contentOrDependency The package-lock content or package lock dependency
   */
  protected accumulatedDependencies(
    accumulator: DependencyAccumulator,
    contentOrDependency: PackageLockContent | PackageLockDependency,
  ): DependencyAccumulator {
    return Object.entries(contentOrDependency.dependencies!).reduce(
      this.getRecursivelyDependenciesReducer.bind(this),
      accumulator,
    );
  }

  /**
   * Represents the reducer used to accumulate dependencies into {@link DependencyInfo}
   *
   * @param accumulator The accumulator
   * @param name The name of the dependency
   * @param packageDependency The info about the dependency
   */
  protected getRecursivelyDependenciesReducer(
    accumulator: DependencyAccumulator,
    [name, packageDependency]: [string, PackageLockDependency],
  ): DependencyAccumulator {
    let type = DependencyType.NONE;

    type |= packageDependency.dev
      ? DependencyType.DEVELOPMENT
      : DependencyType.PRODUCTION;

    if (packageDependency.optional) type |= DependencyType.OPTIONAL;

    if (packageDependency.peer) type |= DependencyType.PEER;

    const dependencyInfo: DependencyInfo = new DependencyInfo(
      name,
      packageDependency.version,
      type,
    );

    this.addDependencyToAccumulator(accumulator, dependencyInfo);

    if (typeof packageDependency === 'object' && packageDependency.dependencies)
      this.accumulatedDependencies(accumulator, packageDependency);

    return accumulator;
  }

  /**
   * Add dependency to the accumulator accords the type of the dependency
   *
   * @param accumulator The accumulator
   * @param dependency The info about the dependency
   */
  protected addDependencyToAccumulator(
    accumulator: DependencyAccumulator,
    dependency: DependencyInfo,
  ): void {
    if ((dependency.type & DependencyType.DEVELOPMENT) > 0)
      accumulator[DependencyType.DEVELOPMENT].push(dependency);

    if ((dependency.type & DependencyType.PRODUCTION) > 0)
      accumulator[DependencyType.PRODUCTION].push(dependency);

    if ((dependency.type & DependencyType.PEER) > 0)
      accumulator[DependencyType.PEER].push(dependency);

    if ((dependency.type & DependencyType.OPTIONAL) > 0)
      accumulator[DependencyType.OPTIONAL].push(dependency);

    accumulator[DependencyType.NONE].push(dependency);
  }

  //#endregion
}
