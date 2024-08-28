// test-secrets.ts

import { parseSecrets } from './secrets'; // Adjust the import path
import * as fs from 'fs';

// Define a temporary test file with some test data
const testFilePath = 'test-secrets.txt';

// Write some test data to the file
const testData = `
otpauth://totp/Amazon%20Web%20Services:aws1?algorithm=sha1&digits=6&issuer=Amazon+Web+Services&period=30&secret=sdsdsdsdsd&codeDisplay=%7B%22pinned%22%3Afalse%2C%22trashed%22%3Afalse%2C%22lastUsedAt%22%3A0%2C%22tapCount%22%3A0%2C%22tags%22%3A%5B%22Work%22%5D%7D
otpauth://totp/authentik:akadmin?algorithm=sha1&digits=6&issuer=authentik&period=30&secret=sdsdsdsdsdsd&codeDisplay=%7B%22pinned%22%3Afalse%2C%22trashed%22%3Afalse%2C%22lastUsedAt%22%3A0%2C%22tapCount%22%3A0%2C%22tags%22%3A%5B%22Work%22%5D%7D
otpauth://totp/authentik:chkpwd?algorithm=sha1&digits=6&issuer=authentik&period=30&secret=sdsdsdsdsd&codeDisplay=%7B%22pinned%22%3Afalse%2C%22trashed%22%3Afalse%2C%22lastUsedAt%22%3A0%2C%22tapCount%22%3A0%2C%22tags%22%3A%5B%22Work%22%5D%7D
otpauth://totp/UptimeRobot:?algorithm=sha1&digits=6&issuer=UptimeRobot&period=30&secret=adasdada&codeDisplay=%7B%22pinned%22%3Afalse%2C%22trashed%22%3Afalse%2C%22lastUsedAt%22%3A0%2C%22tapCount%22%3A0%2C%22tags%22%3A%5B%22Personal%22%5D%7D
`;

fs.writeFileSync(testFilePath, testData, 'utf8');

// Call the function to test
const parsedSecrets = parseSecrets(testFilePath);
console.log('Parsed Secrets:', parsedSecrets);

// Clean up the test file
fs.unlinkSync(testFilePath);

