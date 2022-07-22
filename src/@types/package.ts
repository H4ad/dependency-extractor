/**
 * The interface that represents a dependencty inside package-lock.json
 */
export interface PackageLockDependency {
  version: string;
  resolved: string;
  integrity: string;
  dev: boolean;
  requires?: { [key: string]: string };
  dependencies?: Record<string, PackageLockDependency>;
  optional?: boolean;
  peer?: boolean;
}

/**
 * The interface that represents a package-lock.json
 */
export interface PackageLockContent {
  dependencies: Record<string, PackageLockDependency>;
}
