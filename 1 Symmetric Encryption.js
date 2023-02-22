import crypto from "crypto";
import dotenv from 'dotenv'
dotenv.config()

//1 Symmetric Encryption
function encryptData(data, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function decryptData(data, key) {
    const parts = data.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encrypted = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// //Using this file
// const data = 'This is my secret message';
// const key = crypto.randomBytes(32);
//
// const encrypted = encryptData(data, key);
// console.log(`Encrypted data: ${encrypted}`);
//
// const decrypted = decryptData(encrypted, key);
// console.log(`Decrypted data: ${decrypted}`);

//Using CLI
export { encryptData, decryptData };