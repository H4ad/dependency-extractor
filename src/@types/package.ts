/**
 * The interface that represents a dependencty inside package-lock.json
 *
 * @deprecated
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
 *
 * @deprecated
 */
export interface PackageLockContent {
  dependencies: Record<string, PackageLockDependency>;
}

/**
 * The interface that represents a package-lock.json lockVersion 2.
 */
export type PackageLockContentV2 = PackageLockContent;

/**
 * The interface that represents a dependencty inside package-lock.json lockVersion 2
 */
export type PackageLockDependencyV2 = PackageLockDependency;

/**
 * The interface that represents a package-lock.json lockVersion 3.
 */
export interface PackageLockContentV3 {
  packages: Record<string, PackageLockDependencyV3>;
}

/**
 * The interface that represents a dependencty inside package-lock.json lockVersion 3
 */
export interface PackageLockDependencyV3 {
  name?: string;
  version: string;
  license?: string;
  devDependencies?: Record<string, string>;
  engines?: string[] | Record<string, string>;
  resolved?: string;
  integrity?: string;
  dev?: boolean;
  peer?: boolean;
  devOptional?: boolean;
  dependencies?: Record<string, string>;
  optional?: boolean;
  funding?: {
    url: string;
    type?: string;
  };
  cpu?: string[];
  os?: string[];
  bin?: { [key: string]: string };
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: Record<string, { optional: boolean }>;
  optionalDependencies?: Record<string, string>;
  deprecated?: string;
  hasInstallScript?: boolean;
  bundleDependencies?: string[];
  inBundle?: boolean;
}

export type PackageLock = PackageLockContentV2 | PackageLockContentV3;
