#!/usr/bin/env node
//显式的声明这个文件用node来执行
'use strict'
const program = require('commander');
const init = require('../command/init');

program
    .version(require('../package').version, '-v, --version')
    .usage('<command> <type> <projectName>')
    .command('init <type> <projectName>')    //命令是init 必要参数projectName
    .description('download a new initial project, type could be "vue" or "react"')  //命令的描述
    .alias('i') //命令别名
    .action((type, projectName) => {
        init(type, projectName)
    })

program.parse(process.argv) //必须，解析命令行参数argv

if(!program.args.length){
    program.help()  // 如果只是输入 "dc-cli"没带参数，就展示能输入的所有命令
}
