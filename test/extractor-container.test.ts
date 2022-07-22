import { describe, expect, it } from 'vitest';
import {
  DependencyAccumulator,
  DependencyType,
  ExtractorContainer,
} from '../src';

describe(ExtractorContainer.name, () => {
  it('should return correctly the dependencies', function () {
    const development = [Symbol('dev') as any];
    const production = [Symbol('prod') as any];
    const peer = [Symbol('peer') as any];
    const optional = [Symbol('optional') as any];
    const all = [development, production, peer, optional];

    const accumulator: DependencyAccumulator = {
      [DependencyType.NONE]: all,
      [DependencyType.DEVELOPMENT]: development,
      [DependencyType.PRODUCTION]: production,
      [DependencyType.PEER]: peer,
      [DependencyType.OPTIONAL]: optional,
    };

    const container = new ExtractorContainer(accumulator);

    expect(container.getAllDependencies()).toBe(all);
    expect(container.getDevelopmentDependencies()).toBe(development);
    expect(container.getProductionDependencies()).toBe(production);
    expect(container.getPeerDependencies()).toBe(peer);
    expect(container.getOptionalDependencies()).toBe(optional);
  });
});
