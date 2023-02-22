import crypto from "crypto";
import * as fs from "fs";

//2 Asymmetric Encryption
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
    },
});

// //Save file
// fs.writeFileSync("public.pem", publicKey);
// fs.writeFileSync("private.pem", privateKey);

function encryptWithPublicKey(message, publicKey) {
    const buffer = Buffer.from(message);
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');
}

function decryptWithPrivateKey(encryptedMessage, privateKey) {
    const buffer = Buffer.from(encryptedMessage, 'base64');
    const decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString('utf8');
}

//Using this file
// const message = 'This is my secret message';
// const encrypted = encryptWithPublicKey(message, publicKey);
// console.log(`Encrypted message: ${encrypted}`);
//
// const decrypted = decryptWithPrivateKey(encrypted, privateKey);
// console.log(`Decrypted message: ${decrypted}`);

//For cli using .pem files
function encryptMessagePem(message, publicKeyPath) {
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    const buffer = Buffer.from(message, 'utf8');
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');
}

function decryptMessagePem(encryptedMessage, privateKeyPath) {
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    const buffer = Buffer.from(encryptedMessage, 'base64');
    const decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString('utf8');
}

export { encryptMessagePem, decryptMessagePem };