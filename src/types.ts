enum OutputFormat {
    ALFRED = 'alfred',
    JSON = 'json',
}

interface Secret {
    username: string;
    secret: string;
}

interface SecretData {
    [serviceName: string]: Secret[];
}

interface AlfredFormat {
    title: string;
    subtitle: string;
    arg: string;
    icon: { path: string };
}

interface JsonFormat {
    service_name: string;
    current_totp: string;
    next_totp: string;
    service_data: string;
}

export { Secret, SecretData as ServiceData, AlfredFormat, JsonFormat, OutputFormat as OutputTypes };
