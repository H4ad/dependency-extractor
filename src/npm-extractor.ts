//#region Imports

import {
  DependencyAccumulator,
  PackageLock,
  PackageLockContentV2,
  PackageLockContentV3,
  PackageLockDependencyV2,
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

    if ('dependencies' in parsedObject)
      this.accumulatedDependenciesV2(accumulator, parsedObject);
    else this.accumulatedDependenciesV3(accumulator, parsedObject);

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
  ): lockFileContent is PackageLock {
    return !!(
      lockFileContent &&
      typeof lockFileContent === 'object' &&
      (('dependencies' in lockFileContent &&
        !!lockFileContent['dependencies']) ||
        ('packages' in lockFileContent && !!lockFileContent['packages']))
    );
  }

  /**
   * Method to accumulate dependencies recursively until we go through all dependencies to sub-dependencies.
   *
   * @param accumulator The accumulator
   * @param contentOrDependency The package-lock content or package lock dependency
   */
  protected accumulatedDependenciesV2(
    accumulator: DependencyAccumulator,
    contentOrDependency: PackageLockContentV2 | PackageLockDependencyV2,
  ): DependencyAccumulator {
    return Object.entries(contentOrDependency.dependencies!).reduce(
      this.getRecursivelyDependenciesReducer.bind(this),
      accumulator,
    );
  }

  /**
   * Method to accumulate dependencies recursively until we go through all dependencies to sub-dependencies.
   *
   * @param accumulator The accumulator
   * @param contentOrDependency The package-lock content or package lock dependency
   */
  protected accumulatedDependenciesV3(
    accumulator: DependencyAccumulator,
    contentOrDependency: PackageLockContentV3,
  ): DependencyAccumulator {
    for (const [name, dependency] of Object.entries(
      contentOrDependency.packages,
    )) {
      const libraries = name.split('node_modules');

      const validNames = libraries
        .filter(library => !!library)
        .map(library => this.trimChar(library, '/'));

      if (validNames.length === 0) continue;

      const dependencyName = validNames.pop()!;

      let type = DependencyType.NONE;

      if (dependency.peer) type |= DependencyType.PEER;
      else if (dependency.devOptional)
        type |= DependencyType.DEVELOPMENT | DependencyType.OPTIONAL;
      else {
        type |= dependency.dev
          ? DependencyType.DEVELOPMENT
          : DependencyType.PRODUCTION;
      }

      if (dependency.optional) type |= DependencyType.OPTIONAL;

      const dependencyInfo: DependencyInfo = new DependencyInfo(
        dependencyName,
        dependency.version,
        type,
      );

      this.addDependencyToAccumulator(accumulator, dependencyInfo);
    }

    return accumulator;
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
    [name, packageDependency]: [string, PackageLockDependencyV2],
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
      this.accumulatedDependenciesV2(accumulator, packageDependency);

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

  //#region Private Methods

  /**
   * @reference {@link https://stackoverflow.com/a/26156806/8741188}
   */
  private trimChar(string: string, charToRemove: string): string {
    while (string.charAt(0) == charToRemove) string = string.substring(1);

    while (string.charAt(string.length - 1) == charToRemove)
      string = string.substring(0, string.length - 1);

    return string;
  }

  //#endregion
}
