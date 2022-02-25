import crypto from 'crypto';

export const generateSignature = (params: any, secretKey: string) => {
  const paramsToString: string = `${params.account}{up}${params.currency || 'RUB'}{up}${
    params.desc
  }{up}${params.sum}{up}${secretKey}`;
  return crypto.createHash('sha256').update(paramsToString, 'utf-8').digest('hex');
};

export const base64Encode = (data: string) => {
  const buff = Buffer.from(data);
  const base64data = buff.toString('base64');

  return base64data;
};
