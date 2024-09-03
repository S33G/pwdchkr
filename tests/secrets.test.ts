// secrets.test.ts
import { describe, expect, it, jest } from '@jest/globals';
import { parseSecrets } from '../src/secrets';
import * as fs from 'fs';
import path from 'path';

jest.mock('fs');
const filePath = path.join(__dirname, '../tests/__mocks__/db.json');
const mockFileContent = fs.readFileSync(filePath);
(fs.readFileSync as jest.Mock).mockImplementation(() => mockFileContent);

describe('parseSecrets', () => {
  it('should parse and return the correct secrets from the actual file', () => {
    const expectedSecrets = [
      {
        issuer: 'ServiceA',
        username: 'user1',
        secret: 'JBSWY3DPEHPKPXP'
      },
      {
        issuer: 'ServiceA',
        username: 'user2',
        secret: 'JBSWY3DPEHPK3PXP'
      },
      {
        issuer: 'ServiceB',
        username: 'user3',
        secret: 'JBSWY3DPEHPK3PXP'
      }
    ];

    // Update the parseSecrets function to use the actual path for testing
    const secrets = parseSecrets(filePath);
    expect(secrets).toEqual(expectedSecrets);
  });

  it('should handle empty file gracefully', () => {
    // Mock fs to return an empty string
    (fs.readFileSync as jest.Mock).mockImplementation(() => '');

    const secrets = parseSecrets(filePath);
    expect(secrets).toEqual([]);
  });

  it('should handle file with invalid data gracefully', () => {
    // Mock fs to return invalid OTP data
    const invalidMockDb = `
    invalid_data
    otpauth://totp/ServiceA:user1?secret=INVALIDSECRET&issuer=ServiceA
    `;
    (fs.readFileSync as jest.Mock).mockImplementation(() => invalidMockDb);

    const secrets = parseSecrets(filePath);
    expect(secrets).toEqual([
      {
        issuer: 'ServiceA',
        username: 'user1',
        secret: 'INVALIDSECRET'
      }
    ]);
  });
});

