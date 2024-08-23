import * as fs from 'fs';

export const parseSecrets = (filePath: string = 'secrets.txt') : [string, string, string][] => {
    const secretsList: [string, string, string][] = [];

    const data = fs.readFileSync(filePath, 'utf8').split('\n');
    // @ts-ignore
    data.forEach(line => {
        line = line.trim();
        if (line) {
            line = line.replace('sha', 'SHA').split('codeDisplay')[0].slice(0, -1);
            try {
                const [serviceName, username, secret] = line.split(':'); // Adjust as needed
                if (secret) {
                    secretsList.push([serviceName, username, secret]);
                }
            } catch {
                // Handle parse errors or invalid URIs
                console.error('Error parsing line:', line);
            }
        }
    });

    return secretsList;
}
