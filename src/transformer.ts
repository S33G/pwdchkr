import { AlfredFormat, JsonFormat, OutputTypes, Secret } from './types';

export const dataTransformer = (
  serviceName: string,
  username: string,
  currentTotp: string,
  currentTotpTimeRemaining: number,
  nextTotp: string,
  outputType: OutputTypes,
): AlfredFormat | JsonFormat | null => {
  const subset = username
    ? `Current TOTP: ${currentTotp} | Next TOTP: ${nextTotp} - ${username}`
    : `Current TOTP: ${currentTotp} | Next TOTP: ${nextTotp}`;

  if (outputType === 'alfred') {
    return {
      title: serviceName,
      subtitle: subset,
      arg: currentTotp,
      icon: { path: './icon.png' },
    };
  } else if (outputType === 'json') {
    return {
      service_name: serviceName,
      current_totp: currentTotp,
      current_totp_time_remaining: currentTotpTimeRemaining,
      next_totp: nextTotp,
      service_data: subset,
    };
  }

  return null;
}

export const getAllSecretNames = (data: Secret[]): string[] => Object.keys(data);
