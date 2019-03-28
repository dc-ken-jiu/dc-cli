#!/usr/bin/env node
//显式的声明这个文件用node来执行
'use strict'
const program = require('commander')
const init = require('../command/init')
const inquirer = require('inquirer');

const promptList = [
    {
      type: 'confirm',
      message: 'Do you want to install npm',
      name: 'watch'
    }
];

program
    .version(require('../package').version, '-v, --version')
    .usage('<command> <projectName>')
    .command('init <projectName>')    //命令是init 必要参数projectName
    .description('download a new initial project')  //命令的描述
    .alias('i') //命令别名
    .action((projectName) => {
        inquirer.prompt(promptList).then(answers => {
            init(projectName,answers.watch)
        })
    })

program.parse(process.argv) //必须，解析命令行参数argv

if(!program.args.length){
    program.help()  // 如果只是输入 "crx-cli"没带参数，就展示能输入的所有命令
}
