# Encrypting and Decrypting Data in Node.js

Created: February 22, 2023 3:14 PM
Tags: AES 256, crypto, node

## 1. Symmetric Encryption

### Overview

Symmetric encryption is a type of encryption where the same key is used for encryption and decryption of data. In this task, we will use the AES 256 algorithm to encrypt a string using a key and an initialization vector (IV).

### Initialization Vector

An initialization vector (IV) is a random number used in conjunction with a secret key to encrypt data. The IV ensures that the same plaintext will not encrypt to the same ciphertext when the same key is used multiple times.

### Code

To encrypt the data, the following steps will be taken:

1. Import the `crypto` module
2. Define a function that takes a string and a key as input and returns a cipher of the input string
3. Use an initialization vector
4. Use the AES 256 algorithm to encrypt the string

```jsx
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
```

Here, `crypto.randomBytes(16)` generates a random initialization vector of 16 bytes. The `crypto.createCipheriv` function creates an AES-256-CBC cipher with the given `key` and `iv`. The `cipher.update` method updates the `cipher` object with `data`. The final `cipher.final` method returns the encrypted data.

To decrypt the data, the following steps will be taken:

1. Define a function that takes a cipher and a key as input and returns a plain-text deciphered text from the input cipher
2. Split the initialization vector and the encrypted data
3. Use the initialization vector and the AES 256 algorithm to decrypt the data

```jsx
function decryptData(data, key) {
    const parts = data.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encrypted = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
```

Here, `data.split(':')` splits the initialization vector and the encrypted data. The `Buffer.from` method creates a new buffer containing the hexadecimal string. The `crypto.createDecipheriv` function creates an AES-256-CBC decipher with the given `key` and `iv`. The `decipher.update` method updates the `decipher` object with `encrypted`. The final `decipher.final` method returns the decrypted data.

### Example

```jsx
//Using this file
const data = 'This is my secret message';
const key = crypto.randomBytes(32);

const encrypted = encryptData(data, key);
console.log(`Encrypted data: ${encrypted}`);

const decrypted = decryptData(encrypted, key);
console.log(`Decrypted data: ${decrypted}`);

//Using CLI
export { encryptData, decryptData };
```

Output:

```
Encrypted data: 7a9b4e4bd8f4b3cc4a09c2d5a5a7d83f:3c590c34f2d6dcf7fc1a5a5a7c166f5f
Decrypted data: This is my secret message

```

Full file :

```jsx
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

//Using this file
const data = 'This is my secret message';
const key = crypto.randomBytes(32);

const encrypted = encryptData(data, key);
console.log(`Encrypted data: ${encrypted}`);

const decrypted = decryptData(encrypted, key);
console.log(`Decrypted data: ${decrypted}`);

//Using CLI
export { encryptData, decryptData };
```

## 2. Asymmetric Encryption

### Overview

Asymmetric encryption is a type of encryption where two different keys are used for encryption and decryption of data. In this task, we will generate a public/private RSA key pair and use it to encrypt and decrypt a string.

### Code

To generate the RSA key pair, the following steps will be taken:

1. Import the `crypto` module
2. Use the `crypto.generateKeyPairSync` function to generate a key pair

```jsx
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

// //Save file (care you have to delete last line of the file)
fs.writeFileSync("public.pem", publicKey);
fs.writeFileSync("private.pem", privateKey);
```

Here, `crypto.generateKeyPairSync` generates a new RSA key pair with a modulus length of 4096 bits. The `publicKey` and `privateKey` objects contain the public and private keys in PEM format.

To encrypt the data, the following steps will be taken:

1. Define a function that takes a message and a public key as input and returns an encrypted message
2. Use the `crypto.publicEncrypt` function to encrypt the message using the public key

```jsx
function encryptWithPublicKey(message, publicKey) {
    const buffer = Buffer.from(message);
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');
}
```

Here, `Buffer.from` creates a new buffer containing the message. The `crypto.publicEncrypt` function encrypts the message using the public key.

To decrypt the data, the following steps will be taken:

1. Define a function that takes an encrypted message and a private key as input and returns a decrypted message
2. Use the `crypto.privateDecrypt` function to decrypt the message using the private key

```jsx
function decryptWithPrivateKey(encryptedMessage, privateKey) {
    const buffer = Buffer.from(encryptedMessage, 'base64');
    const decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString('utf8');
}

```

Here, `Buffer.from` creates a new buffer containing the encrypted message. The `crypto.privateDecrypt` function decrypts the message using the private key.

### Example

```jsx
//Using this file
const message = 'This is my secret message';
const encrypted = encryptWithPublicKey(message, publicKey);
console.log(`Encrypted message: ${encrypted}`);
//
const decrypted = decryptWithPrivateKey(encrypted, privateKey);
console.log(`Decrypted message: ${decrypted}`);

```

Output:

```
Encrypted message: Oq4fWt2CvZne1X9fYmZ+Hmz8PvLg+sxz1kHtFwBpkV8gOzjJ9Z1B5Z5LR5Q5
5XEgB5yJiHw5cI6GG0u6ZbFQ==
Decrypted message: This is my secret message

```

Full file :

```jsx
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
```

## 3. Bonus: CLI Tool

### Overview

We will create a command-line interface (CLI) tool to encrypt and decrypt data using both symmetric and asymmetric encryption.

### Code

To create the CLI tool, the following steps will be taken:

1. Install the `commander` and `inquirer` modules
2. Define the CLI commands and options using the `commander` module
3. Use the `inquirer` module to prompt the user for input
4. Use the encryption and decryption functions defined in the previous sections to encrypt and decrypt the data

Here, `commander.command` defines the CLI commands and `commander.option` defines the CLI options. `inquirer.prompt` prompts the user for input. The encryption and decryption functions from the previous sections are used to encrypt and decrypt the data.

```jsx
import * as symetric from "./1 Symmetric Encryption.js";
import * as asymetric from "./2 Asymmetric Encryption.js";

import dotenv from 'dotenv'
dotenv.config()

//3 CLI
import { Command } from "commander";
import inquirer from "inquirer";
const commander = new Command();

const pathPublic = "./public.pem";
const pathPrivate = "./private.pem";

commander
    .command('encrypt')
    .description('Encrypt data')
    .option('-s, --symmetric', 'Use symmetric encryption')
    .option('-a, --asymmetric', 'Use asymmetric encryption')
    .action((options) => {
        if (options.symmetric) {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'data',
                        message: 'Enter the data to encrypt:',
                    },
                ])
                .then((answers) => {
                    const encrypted = symetric.encryptData(answers.data, process.env.key);
                    console.log(`Encrypted data: ${encrypted}`);
                });
        } else if (options.asymmetric) {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'data',
                        message: 'Enter the data to encrypt:',
                    },
                ])
                .then((answers) => {
                    const encrypted = asymetric.encryptMessagePem(answers.data, pathPublic);
                    console.log(`Encrypted data: ${encrypted}`);
                });
        } else {
            console.error('Please specify --symmetric or --asymmetric');
        }
    });

commander
    .command('decrypt')
    .description('Decrypt data')
    .option('-s, --symmetric', 'Use symmetric encryption')
    .option('-a, --asymmetric', 'Use asymmetric encryption')
    .action((options) => {
        if (options.symmetric) {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'data',
                        message: 'Enter the data to decrypt:',
                    },
                ])
                .then((answers) => {
                    const decrypted = symetric.decryptData(answers.data, process.env.key);
                    console.log(`Decrypted data: ${decrypted}`);
                });
        } else if (options.asymmetric) {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'data',
                        message: 'Enter the data to decrypt:',
                    },
                ])
                .then((answers) => {
                    const decrypted = asymetric.decryptMessagePem(answers.data, pathPrivate);
                    console.log(`Decrypted data: ${decrypted}`);
                });
        } else {
            console.error('Please specify --symmetric or --asymmetric');
        }
    });

commander.parse(process.argv);
```

Modify package.json :

```jsx
{
  "name": "encryption",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "es": "node 3\\ Bonus:\\ CLI\\ Tool.js encrypt --symmetric",
    "ds": "node 3\\ Bonus:\\ CLI\\ Tool.js decrypt --symmetric",
    "ea": "node 3\\ Bonus:\\ CLI\\ Tool.js encrypt --asymmetric",
    "da": "node 3\\ Bonus:\\ CLI\\ Tool.js decrypt --asymmetric"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "commander": "^10.0.0",
    "dotenv": "^16.0.3",
    "inquirer": "^9.1.4"
  },
  "type": "module"
}
```

### Example

To encrypt data using symmetric encryption:

```
❯ npm run es

```

Output:

```
> encryption@1.0.0 es
> node 3\ Bonus:\ CLI\ Tool.js encrypt --symmetric

? Enter the data to encrypt: coucou
Encrypted data: 11d5aba38ad53a5c0807594544bb4249:2bac53ada7a2ad38fd89614f693f4f0e
```

To decrypt data using symmetric encryption:

```
❯ npm run ds
```

Output:

```
> encryption@1.0.0 ds
> node 3\ Bonus:\ CLI\ Tool.js decrypt --symmetric

? Enter the data to decrypt: 11d5aba38ad53a5c0807594544bb4249:2bac53ada7a2ad38fd89614f693f4f0e
Decrypted data: coucou
```

To encrypt data using asymmetric encryption:

```
❯ npm run ea
```

Output:

```
> encryption@1.0.0 ea
> node 3\ Bonus:\ CLI\ Tool.js encrypt --asymmetric

? Enter the data to encrypt: coucou
Encrypted data: RE5j7Gst3EFCl4W5S4iz4lIrUELmDq3GiCT5D3nDsDPJocwTwx7mbs7MQQEvFbKQmj/ZOBVbJqCYuPH73MeZ6eVDLG5BUXBjr2+QyuyCLbh1KTi98vhMmHwkC4aq05OXWvVGJPKVIr0LiGw34G5jofkeTEGTEpK7wDMJOQYyHYOemdZEkaggNNkq+j7UxuJPo1E/2MM5v1kvz9k0zD4w/hKxJUzRrVZcqFTQCuPXVi8u3jl9kgmEsLJ1aC2U/CJ++9vgaGfy1tbLw3Vkm4UOPQ27qVWUbkz8lYQtuVeRYsCkkfL+IrKu4bmY7JoLsyMxJ09gmVt/UtYkWlzdGYgS4z91rUPn7THOo4s4s4WXPcT7Rlx0S+P9BrwpjmYEG8+C6H5UMis0iC/pj/kg/RnJEEsTVe2T1wEQM0+zRqO21E8i4ROegfS4dWOYSRC8lYDo0/Q9rxpQIlNwuwyeIIKLWKFcVJ8JrxEHdywKXHK5PJxmgeYU3CZwLjA7U2+4qNDdqikw+aUoScp7F1sSchqVbHx8IvrODG35dhNjmxwuSGBObfBgLdVZY7/xFQcam3NPWxlyP7/2tXjWPObNKArEoi3dYRVZOkn/VrVJPN+dMB8wJwYqxk7/sLRtGpPK86d31jlXKopaPkoe3EzQ6HkXJKvDe98HIe6gNL2Z9/gTcuI=
```

To decrypt data using asymmetric encryption:

```
❯ npm run da
```

Output:

```
> encryption@1.0.0 da
> node 3\ Bonus:\ CLI\ Tool.js decrypt --asymmetric

? Enter the data to decrypt: RE5j7Gst3EFCl4W5S4iz4lIrUELmDq3GiCT5D3nDsDPJocwTwx7mbs7MQQEvFbKQmj/ZOBVbJqCYuPH73MeZ6eVDLG5BUXBjr2+QyuyCLbh1KTi98vhMmHwkC4aq05OXWvVGJPKVIr0LiGw34G5jofkeTEGTEpK7wDMJOQYyHYOemdZEkaggNNkq+j7UxuJPo1E/2MM5v1kvz9k0zD4w/h
KxJUzRrVZcqFTQCuPXVi8u3jl9kgmEsLJ1aC2U/CJ++9vgaGfy1tbLw3Vkm4UOPQ27qVWUbkz8lYQtuVeRYsCkkfL+IrKu4bmY7JoLsyMxJ09gmVt/UtYkWlzdGYgS4z91rUPn7THOo4s4s4WXPcT7Rlx0S+P9BrwpjmYEG8+C6H5UMis0iC/pj/kg/RnJEEsTVe2T1wEQM0+zRqO21E8i4ROegfS4dWOYSRC8lYDo0/Q9rxpQI
lNwuwyeIIKLWKFcVJ8JrxEHdywKXHK5PJxmgeYU3CZwLjA7U2+4qNDdqikw+aUoScp7F1sSchqVbHx8IvrODG35dhNjmxwuSGBObfBgLdVZY7/xFQcam3NPWxlyP7/2tXjWPObNKArEoi3dYRVZOkn/VrVJPN+dMB8wJwYqxk7/sLRtGpPK86d31jlXKopaPkoe3EzQ6HkXJKvDe98HIe6gNL2Z9/gTcuI=
Decrypted data: coucou
```

## Conclusion

In this task, we learned how to encrypt and decrypt data using both symmetric and asymmetric encryption in Node.js. Additionally, we created a CLI tool to encrypt and decrypt data using both encryption methods.