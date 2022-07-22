import { readFileSync } from 'fs';
import { NpmExtractor } from '../src';

const extractor = new NpmExtractor();
const packageLock = readFileSync('../package-lock.json').toString('utf-8');

const dependencyContainer = extractor.parse(packageLock);

const allDependencies = dependencyContainer.getAllDependencies();
const productionDependencies = dependencyContainer.getProductionDependencies();
const developmentDependencies = dependencyContainer.getDevelopmentDependencies();
const peerDependencies = dependencyContainer.getPeerDependencies();
const optionalDependencies = dependencyContainer.getOptionalDependencies();

const firstDependency = allDependencies[0];

console.log(firstDependency.name);
console.log(firstDependency.version);
console.log(firstDependency.isProduction);
console.log(firstDependency.isDevelopment);
console.log(firstDependency.isOptional);
console.log(firstDependency.isPeer);
