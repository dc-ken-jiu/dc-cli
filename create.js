const chalk = require('chalk');
const commander = require('commander');
const envinfo = require('envinfo');
const packageJson = require('./package.json');
const path = require('path');
const validateProjectName = require('validate-npm-package-name');
const fs = require('fs-extra');
const spawn = require('cross-spawn');
const remote = require('./lib');


function init() {
    const program = new commander.Command(packageJson.name)
        .version(packageJson.version)
        .arguments('<project-directory>')
        .usage(`${chalk.green('<project-directory>')} [options]`)
        .action(name => {
            projectName = name;
        })
        .option('--info', 'print environment debug info')
        .option('--use-react-cli [value]', 'use react-cli generate project')
        .option('--use-vue-cli [value]', 'use vue-cli generate project')
        .option('--use-vue-cli')
        .option('--template <type>', 'init templet', "vue")
        .allowUnknownOption()
        .on('--help', () => {
            console.log(
                `    Only ${chalk.green('<project-directory>')} is required.`
            );
            console.log();
            console.log(`      - a specific npm version: ${chalk.green('0.8.2')}`);
            console.log(`      - a specific npm tag: ${chalk.green('@next')}`);
            console.log(
                `    It is not needed unless you specifically want to use a fork.`
            );
            console.log();
            console.log(`    A custom ${chalk.cyan('--template')} can be one of:`);
            console.log(
                `      - a custom template published on npm: ${chalk.green(
                    'cra-template-typescript'
                )}`
            );
            console.log(
                `      - a local path relative to the current working directory: ${chalk.green(
                    'file:../my-custom-template'
                )}`
            );
            console.log(
                `      - a .tgz archive: ${chalk.green(
                    'https://mysite.com/my-custom-template-0.8.2.tgz'
                )}`
            );
            console.log(
                `      - a .tar.gz archive: ${chalk.green(
                    'https://mysite.com/my-custom-template-0.8.2.tar.gz'
                )}`
            );
            console.log();
            console.log(
                `    If you have any problems, do not hesitate to file an issue:`
            );
            console.log(
                `      ${chalk.cyan(
                    'https://github.com/dc-ken-jiu/dc-cli/issues/new'
                )}`
            );
            console.log();
        })
        .parse(process.argv);

    if (program.info) {
        console.log(chalk.bold('\nEnvironment Info:'));
        console.log(
            `\n  current version of ${packageJson.name}: ${packageJson.version}`
        );
        console.log(`  running from ${__dirname}`);
        return envinfo
            .run(
                {
                    System: ['OS', 'CPU'],
                    Binaries: ['Node', 'npm', 'Yarn'],
                    Browsers: [
                        'Chrome',
                        'Edge',
                        'Internet Explorer',
                        'Firefox',
                        'Safari',
                    ],
                },
                {
                    duplicates: true,
                    showNotFound: true,
                }
            )
            .then(console.log);
    }

    if (typeof projectName === 'undefined') {
        console.error('Please specify the project directory:');
        console.log(
            `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
        );
        console.log();
        console.log('For example:');
        console.log(
            `  ${chalk.cyan(program.name())} ${chalk.green('my-app')}`
        );
        console.log();
        console.log(
            `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
        );
        process.exit(1);
    }

    createApp(
        projectName,
        program.template,
        program.useReactCli,
        program.useVueCli
    );
}

async function createApp(name, template, useReactCli, useVueCli) {
    checkAppName(appName);
    //使用react-cli安装模板项目
    if (useReactCli) {
        await exec(name, "reactCli", useReactCli)
    }
    //使用vue-cli安装模板项目
    if (useVueCli) {
        await exec(name, "vueCli", useVueCli)
    }
    //按照自己脚手架模板安装
    if (template == "vue") {
        remote(template = "vue", name)
    } else if (template == "react") {
        remote(template, name)
    } else {
        console.log(
            `\n  current templet type unsupport`
        );
    }
}

function exec(projectName, type, useCli) {
    let emun = {
        vueCli: 'vue',
        reactCli: 'create-react-app'
    }
    return new Promise((resolve, reject) => {
        let params;
        if (typeof useCli === "boolean") {
            params = '';
        } else if (typeof useCli === "string") {
            params = handleReactCliArgs(useCli);
        }
        const scriptsPath = path.resolve(
            process.cwd(),
            'node_modules',
            '.bin',
            emun[type],
        );

        const command = 'node';

        const args = [
            scriptsPath,
            ...params,
            projectName
        ]


        const child = spawn(command, args, { stdio: 'inherit' });
        child.on('close', code => {
            if (code !== 0) {
                reject({
                    command: `${command} ${args.join(' ')}`,
                });
                return;
            }
        });
        resolve()
    })
}

function handleReactCliArgs(useReactCli) {
    return useReactCli.replace(/\[|\]/g, "").split(",");
}

function checkAppName(appName) {
    const validationResult = validateProjectName(appName);
    if (!validationResult.validForNewPackages) {
        console.error(
            chalk.red(
                `Cannot create a project named ${chalk.green(
                    `"${appName}"`
                )} because of npm naming restrictions:\n`
            )
        );
        [
            ...(validationResult.errors || []),
            ...(validationResult.warnings || []),
        ].forEach(error => {
            console.error(chalk.red(`  * ${error}`));
        });
        console.error(chalk.red('\nPlease choose a different project name.'));
        process.exit(1);
    }
}

module.exports = {
    init
};