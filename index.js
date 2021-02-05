#!/usr/bin/env node

/*
 * @Description:
 * @Author: dingxuejin
 * @Date: 2021-02-03 18:06:03
 * @LastEditTime: 2021-02-05 15:31:07
 * @LastEditors: dingxuejin
 */

'use strict';

var currentNodeVersion = process.versions.node;
var semver = currentNodeVersion.split('.');
var major = semver[0];

if (major < 10) {
    console.error(
        'You are running Node ' +
        currentNodeVersion +
        '.\n' +
        'Create React App requires Node 10 or higher. \n' +
        'Please update your version of Node.'
    );
    process.exit(1);
}

const { init } = require('./create');

init();