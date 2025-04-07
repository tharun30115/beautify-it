#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const chalkAnimation = require('chalk-animation');
const { exec } = require('child_process');

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const catLogo = `
     /\\_/\\  
    ( o.o )  Beautify-It - Format Your Codebase, Effortlessly 
     > ^ < 
`;

async function showWelcome() {
  console.log(chalk.cyan(catLogo));
  const welcome = chalkAnimation.karaoke('♡ Welcome to Beautify-It! ♡');
  await sleep(2130);
  welcome.stop();
}

function writeFile(name, content) {
  fs.writeFileSync(path.join(process.cwd(), name), content);
  console.log(chalk.green(`  ✔ ${name}`));
}

function generateConfigs() {
  console.log(chalk.cyan('\n⤷ Generating config files...'));

  writeFile('prettier.config.js', `module.exports = { semi: true, singleQuote: true };`);
  writeFile('.prettierignore', 'node_modules\nbuild\ndist\n');
}

function runCommand(command, label) {
  return new Promise((resolve, reject) => {
    console.log(chalk.cyan(`\n⤷ ${label}...`));
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log(chalk.red(`✗ ${label} failed.\n`));
        console.error(stderr || err.message);
        reject(err);
      } else {
        console.log(stdout);
        resolve();
      }
    });
  });
}

async function main() {
  await showWelcome();

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: chalk.cyan('✨ Format entire codebase?'),
      default: true,
    },
  ]);

  if (!confirm) return;

  generateConfigs();

  try {
    await runCommand('npx prettier --write .', 'Prettier formatting');
    console.log(chalk.green.bold('\n⚡ Beautification complete!\n'));
  } catch {
    console.log(chalk.red.bold('\n✗ Something went wrong during formatting.\n'));
  }
}

main();
