import * as fs from 'fs';
import * as path from 'path';
import { Command } from 'commander';
import { totp } from 'otplib';
import { ServiceData as SecretsJson, AlfredFormat, JsonFormat } from './types';
import { dataTransformer } from './transformer';
import { parseSecrets } from './secrets';
import { OutputTypes as OutputFormat } from './types';
import * as figlet from 'figlet';
import { logga } from './logga';

const DB_FILE = path.join(process.env.HOME || '', '.local', 'share', 'ente-totp', 'db.json');

const program = new Command();

program
  .command('import <file>')
  .description('Import secrets from a file')
  .action((file: string) => {
    const secrets: SecretsJson = {};

    parseSecrets(file).forEach(([serviceName, username, secret]) => {
      if (!secrets[serviceName]) {
        secrets[serviceName] = [];
      }

      secrets[serviceName].push({ username, secret });
    });

    try {
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(secrets, null, 2));
      console.log('Secrets imported.');
      console.debug('Database path:', DB_FILE);
    }
    catch (error) {
      console.error((error as Error).message);
    }
  });
program.addHelpText('before', figlet.textSync('PWDCHKR', { horizontalLayout: 'full' }));

// Get command
program
  .command('get <secret_id>')
  .description('Generate TOTP for the given secret ID')
  .option('-o, --output_format <format>', 'Data output format', 'json')
  .action((secretId: string, options: { output_format: OutputFormat }) => {
    const items: (AlfredFormat | JsonFormat)[] = [];

    try {
      const data: SecretsJson = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

      Object.entries(data).forEach(([serviceName, serviceData]) => {
        if (serviceName.toLowerCase().includes(secretId.toLowerCase())) {
          serviceData.forEach(({ username, secret }) => {
            const currentTotp = totp.generate(secret);
            const nextTotp = totp.generate(secret); // TOTP tokens are generally time-based, so "nextTotp" might not need to be generated separately
            const formattedData = dataTransformer(
              serviceName,
              username,
              currentTotp,
              nextTotp,
              options.output_format
            );
            if (formattedData) {
              items.push(formattedData);
            }
          });
        }
      });
    } catch (err: any) {
      if (err.message.includes('no such file or directory')) {
        return logga.error('Database not found. Please import secrets first.');
      }

      console.log(JSON.stringify({ items: [], error: (err as Error).message }, null, 4));
    }

    if (items.length) {
      console.log(JSON.stringify({ items }, null, 4));
    } else {
      console.log('No matching secret was found.');
    }
  });

program.addCommand(
  new Command('list')
    .description('List all available secrets')
    .action(() => {
      try {
        const data: SecretsJson = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        logga.info(JSON.stringify(data, null, 4));
      } catch (err: any) {
        if (err.message.includes('no such file or directory')) {
          return logga.error('Database not found. Please import secrets first.');
        }
      }
    })
);


// Parse command line arguments
program.parse(process.argv);

