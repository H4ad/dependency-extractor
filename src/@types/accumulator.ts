import { DependencyInfo, DependencyType } from '../contracts';

/**
 * The record type used to represent the accumulator, the structure that will contain
 * all dependencies by type
 */
export type DependencyAccumulator = Record<DependencyType, DependencyInfo[]>;
