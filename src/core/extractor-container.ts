//#region Imports

import { DependencyInfo, DependencyType } from '../contracts';

//#endregion

/**
 * The container class to hold and expose dependencies
 */
export class ExtractorContainer {
  //#region Constructor

  /**
   * Default Constructor
   */
  constructor(
    protected readonly accumulator: Record<DependencyType, DependencyInfo[]>,
  ) {}

  //#endregion

  //#region Public Methods

  /**
   * Get list with all dependencies
   *
   * @note Dependencies can be duplicated, we don't guarantee unique dependencies by version or name, and we don't order dependencies.
   */
  public getAllDependencies(): DependencyInfo[] {
    return this.accumulator[DependencyType.NONE];
  }

  /**
   * Get list of dependencies that has {@link DependencyType.DEVELOPMENT} flag
   *
   * @note Dependencies can be duplicated, we don't guarantee unique dependencies by version or name, and we don't order dependencies.
   */
  public getDevelopmentDependencies(): DependencyInfo[] {
    return this.accumulator[DependencyType.DEVELOPMENT];
  }

  /**
   * Get list of dependencies that has {@link DependencyType.PRODUCTION} flag
   *
   * @note Dependencies can be duplicated, we don't guarantee unique dependencies by version or name, and we don't order dependencies.
   */
  public getProductionDependencies(): DependencyInfo[] {
    return this.accumulator[DependencyType.PRODUCTION];
  }

  /**
   * Get list of dependencies that has {@link DependencyType.PEER} flag
   *
   * @note Dependencies can be duplicated, we don't guarantee unique dependencies by version or name, and we don't order dependencies.
   */
  public getPeerDependencies(): DependencyInfo[] {
    return this.accumulator[DependencyType.PEER];
  }

  /**
   * Get list of dependencies that has {@link DependencyType.OPTIONAL} flag
   *
   * @note Dependencies can be duplicated, we don't guarantee unique dependencies by version or name, and we don't order dependencies.
   */
  public getOptionalDependencies(): DependencyInfo[] {
    return this.accumulator[DependencyType.OPTIONAL];
  }

  //#endregion
}
