//#region Imports

import { ExtractorContainer } from '../core';

//#endregion

/**
 * The types of dependency
 */
export enum DependencyType {
  NONE = 1 << 0,
  DEVELOPMENT = 1 << 1,
  PRODUCTION = 1 << 2,
  PEER = 1 << 3,
  OPTIONAL = 1 << 4,
}

/**
 * The information about one dependency
 */
export class DependencyInfo {
  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(name: string, version: string, type: number) {
    this.name = name;
    this.version = version;
    this.type = type;

    this.isPeer = (this.type & DependencyType.PEER) > 0;
    this.isDevelopment = (this.type & DependencyType.DEVELOPMENT) > 0;
    this.isProduction = (this.type & DependencyType.PRODUCTION) > 0;
    this.isOptional = (this.type & DependencyType.OPTIONAL) > 0;
  }

  //#endregion

  //#region Public Properties

  /**
   * The name of the dependency
   */
  public readonly name: string;

  /**
   * The version of the dependency
   */
  public readonly version: string;

  /**
   * The types of dependency, this is a flag enum which contains values of {@link DependencyType}.
   *
   * You can check if this dependency has some type by using `(dependency.type & DependencyType.PEER) > 0`.
   */
  public readonly type: number;

  //#endregion

  //#region Public Methods

  /**
   * Tells if this dependency is peer
   */
  public readonly isPeer: boolean;

  /**
   * Tells if this dependency is a development dependency
   */
  public readonly isDevelopment: boolean;

  /**
   * Tells if this dependency is a production dependency
   */
  public readonly isProduction: boolean;

  /**
   * Tells if this dependency is an optional dependency
   */
  public readonly isOptional: boolean;

  //#endregion
}

/**
 * The contract that represents an extractor that can parse some lock file
 */
export interface ExtractorContract {
  /**
   * Parse the lock file and get the aggregated information from that file.
   *
   * @note The result of the extractor can contain duplicated values and the values are not sorted.
   *
   * @param lockFileContent The lock file which contains the information of dependencies
   */
  parse(lockFileContent: unknown): ExtractorContainer;
}
