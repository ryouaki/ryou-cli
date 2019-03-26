#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');
const symbols = require('log-symbols');
const handlebars = require('handlebars');
const execa = require('execa');
const download = require('download-git-repo');

const pkg = require('./package.json');

program.version(`Ver: ${pkg.version}`, '-v, --version')
  .command('init <name>')
  .action((name) => {
    const root = path.join(process.cwd(), name);
    if (!fs.existsSync(root)) {
      inquirer.prompt([
        {
          name: 'template',
          type: 'rawlist',
          message: 'Which template do you want to choice?',
          choices: [
            'Vue(SPA)',
            'Vue(First-render)',
            'Vue(SSR)'
          ]
        },
        {
          name: 'description',
          message: 'Description:'
        },
        {
          name: 'author',
          message: 'Author:'
        }
      ]).then((answers) => {
        const spinner = ora('downloading...');
        const npminstall = ora('npm installing...');
        const runserve = ora('runserve...');
        spinner.start();

        let templatePath = '';
        switch(answers.template) {
          case 'Vue(SPA)':
            templatePath = 'ryouaki/ryou-fe-vue-spa-base';
            break;
          case 'Vue(First-render)':
            break;
          case 'Vue(SSR)':
            break;
          default:
            break;
        }

        download(templatePath, root, (err) => {
          if (err) {
            spinner.fail();
            console.error(symbols.error, chalk.red(err));
          } else {
            spinner.succeed();
            const fileName = `${root}/package.json`;
            if (fs.existsSync(fileName)) {
              const content = fs.readFileSync(fileName).toString();
              const result = handlebars.compile(content)({
                name, 
                description: answers.description, 
                author: answers.author
              });
              fs.writeFileSync(fileName, result);

              console.log(symbols.success, chalk.green('The project initialized successful!'));
              npminstall.start();
              execa.shell(`cd ${root};npm i`).then(r => {
                npminstall.info(r.stdout);
              }).catch(error => {
                console.log(error)
                npminstall.fail();
                console.error(symbols.error, chalk.red('The project initialized failed!'));
              });
            }
          }
        });
      })
    } else {
      console.log(symbols.error, chalk.red('Project already exists!'));
    }
  })

program.parse(process.argv);