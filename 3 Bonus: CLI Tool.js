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