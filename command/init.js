'use strict'
const exec = require('child_process').exec  // 这个是node自带调用自窗口执行shell命令的方法
const chalk = require('chalk')
const ora = require('ora')
const projectUrl = 'https://github.com/Jiuto/init-templates.git'

function install(childPath){
    process.chdir(childPath)
    console.log(chalk.whiteBright('npm installation started'))
    const installing = ora('npm installing...');
    installing.start()
    let installStart=new Date().getTime()
    exec(`npm install`, (error) => {
        if(error){
            installing.stop()
            console.log(error)
            console.log(chalk.redBright("failed to install npm"))
        }else{
            installing.succeed()
            console.log(chalk.greenBright("npm install successed"))
            let installEnd=new Date().getTime()
            console.log(chalk.whiteBright('take '+(installEnd-installStart)+'ms to install npm'))
        }
        process.exit()
    })
}

module.exports = function(projectNmae,inpm) {

    let cmdStr = `git clone `+projectUrl+` `+projectNmae;
    let childPath=''+projectNmae

    console.log(chalk.whiteBright('initialization started'))
    const loading = ora('loading templates...');
    loading.start()

    let initStart=new Date().getTime()
    exec(cmdStr, (error, stdout, stderr) => {
        if (error) {
            loading.stop()
            console.log(error)
            console.log(chalk.redBright("failed to init"))
            process.exit()
        }else{
            loading.succeed()
            console.log(chalk.greenBright("init successed"))
            let initEnd=new Date().getTime()
            console.log(chalk.whiteBright('take '+(initEnd-initStart)+'ms to init'))

            if(inpm){
                install(childPath)
            }else{
                process.exit()
            }
        }
    })
}