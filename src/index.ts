import * as fs from 'fs';
import * as path from 'path';
import { Command } from 'commander';
import * as OTPAuth from "otpauth";
import { ServiceData as SecretsJson, AlfredFormat, JsonFormat } from './types';
import { dataTransformer } from './transformer';
import { parseSecrets, Secret } from './secrets';
import { OutputTypes as OutputFormat } from './types';
import { logger } from './logger';

const DB_FILE = path.join(process.env.HOME || '', '.local', 'share', 'ente-totp', 'db.json');

const program = new Command();

type SecretResult = Omit<Secret, 'issuer'>

const result: Record<string, SecretResult[]> = {};

program
  .command('import <file>')
  .description('Import secrets from a file')
  .action((file: string) => {
    const rawSecrets = parseSecrets(file);

    rawSecrets.forEach((data) => {
      const item = {
        secret: data.secret,
        username: data.username
      };

      if (data.issuer in result) {
        result[data.issuer].push(item);
      } else {
        result[data.issuer] = [item];
      };
    });

    try {
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(result));
      console.log('Secrets imported.');
      console.debug('Database path:', DB_FILE);
    } catch (error) {
      console.error((error as Error).message);
    }
  });


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
        if (serviceName.toLowerCase() === secretId.toLowerCase()) {
          serviceData.forEach(({ username, secret }) => {

            const totp = new OTPAuth.TOTP({ secret: secret });

            const currentTotp = totp.generate();
            const currentTotpTimeRemaining = totp.period - (Math.floor(Date.now() / 1000) % totp.period);
            const nextTotp = totp.generate({ timestamp: Date.now() + (30 * 1000) });
            const formattedData = dataTransformer(
              serviceName,
              username,
              currentTotp,
              currentTotpTimeRemaining,
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
        return logger.error('Database not found. Please import secrets first.');
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
        logger.info(JSON.stringify(data, null, 4));
      } catch (err: any) {
        if (err.message.includes('no such file or directory')) {
          return logger.error('Database not found. Please import secrets first.');
        }
      }
    })
);


// Parse command line arguments
program.parse(process.argv);

