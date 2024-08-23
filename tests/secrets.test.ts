import { ModuleMocker } from 'jest-mock';
import { describe, expect, it } from '@jest/globals';
import { parseSecrets } from '../src/secrets';
import fs from 'fs';

const fakeDb = fs.readFileSync('../tests/__mocks__/db.json', 'utf8');

// @ts-ignore
ModuleMocker.prototype.requireMock = jest.fn((moduleName) => {
  if (moduleName === 'fs') {
    return {
      readFileSync: jest.fn(() => fakeDb),
    };
  }
});

describe('getSecret', () => {
  it('should return the correct secret for ServiceA user1', () => {
    const secret = parseSecrets('ServiceA');
    expect(secret).toBe('JBSWY3DPEHPKPXP');
  });

  it('should return the correct secret for ServiceB user3', () => {
    const secret = parseSecrets('ServiceB');
    expect(secret).toBe('JBSWY3DPEHPK3PXP');
  });

  it('should return undefined for non-existent user', () => {
    const secret = parseSecrets('ServiceA');
    expect(secret).toBeUndefined();
  });

  it('should return undefined for non-existent service', () => {
    const secret = getSecret('NonExistentService', 'user1');
    expect(secret).toBeUndefined();
  });
});
