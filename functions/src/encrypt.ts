import { AES, SHA256, enc } from 'crypto-js';

const encryptionAlgorith = AES;
const hashAlgoritm = SHA256;

const hash = (data: string): string => {

  return hashAlgoritm(data).toString()
}

const encryptObject = (data: any, pass: string): string => {
  return encryptionAlgorith.encrypt(JSON.stringify(data), pass).toString();
}

const decryptObject = (cipher: string, pass: string): any => {
  return JSON.parse(
    encryptionAlgorith.decrypt(cipher, pass).toString(enc.Utf8)
  )
}

export { hash, encryptObject, decryptObject };
