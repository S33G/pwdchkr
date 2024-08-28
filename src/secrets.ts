import * as fs from 'fs';
import * as URLParse from 'url-parse';
import { URLSearchParams } from 'url';


export interface Secret {
  issuer: string;
  username: string;
  secret: string;
};

export const parseSecrets = (filePath: string = 'secrets.txt'): Secret[] => {
  const secretsList: Secret[] = [];

  const data = fs.readFileSync(filePath, 'utf8').split('\n');

  data.forEach(line => {
    line = line.trim(); // Remove whitespace

    if (line) {
      try {
        const url = new URLParse(line);

        const queryParams = new URLSearchParams(url.query);
        const issuer = queryParams.get('issuer')?.replace(/%20/g, ' ') ?? ''; // ? optional chaining to ensure the value is not null
        const secret = queryParams.get('secret') ?? '';

        const username = url.pathname.split(/:|3\?|\%3A/)[1].replace(/^\//, '')?.replace(/%20/g, ' ');

        secretsList.push({
          issuer,
          username: username ?? issuer,
          secret
        });

      } catch (error) {
        console.error('Error parsing line:', line);
      }
    }
  });

  return secretsList;
}

