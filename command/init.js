'use strict'
const exec = require('child_process').exec;  // 这个是node自带调用自窗口执行shell命令的方法
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const download = require('download-git-repo');

const promptList = [
    {
      type: 'confirm',
      message: 'Do you want to install npm',
      name: 'watch'
    }
];

const vue_projectUrl = 'Jiuto/init-templates';
const react_projectUrl = 'Jiuto/init-react-templates';

// 安装依赖
function installNPM(projectNmae){
    // 进入子目录
    process.chdir(process.cwd()+'/'+projectNmae);

    let installStart=new Date().getTime();

    console.log(chalk.whiteBright('npm installation started'));

    let loading = ora('npm loading...');
    loading.start();    

    exec(`npm install`, (error) => {
        if(error){
            loading.stop();
            console.log(error);
            console.log(chalk.redBright("failed to install npm"));
        }else{
            loading.succeed();
            console.log(chalk.greenBright("npm install successed"));
            let installEnd=new Date().getTime();
            console.log(chalk.whiteBright('take '+(installEnd-installStart)+'ms to install npm'));
        }
        process.exit()
    })
}

module.exports = function(type, projectNmae) {

    let initStart=new Date().getTime();

    let url = type === 'vue' ? vue_projectUrl : type === 'react' ? react_projectUrl : '';

    if(!url) {
        console.log(chalk.redBright("type must be vue or react"));
        return
    }

    console.log(chalk.whiteBright('initialization started'));

    let loading = ora('loading templates...');
    loading.start();

    download(url, projectNmae, (error) => {
        if (error) {
            loading.stop();
            console.log(error);
            console.log(chalk.redBright("failed to init"));
        }else{
            loading.succeed();
            console.log(chalk.greenBright("init successed"));
            let initEnd=new Date().getTime();
            console.log(chalk.whiteBright('take '+(initEnd-initStart)+'ms to init'));

            inquirer.prompt(promptList).then(answers => {
                if(answers.watch) installNPM(projectNmae)
            })
        }
    })
}