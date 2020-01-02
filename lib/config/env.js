"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ENV = {
    PROD: 'production',
    TEST: 'test',
    DEV: 'development',
    SSR: 'server'
};
var isProd = process.env.NODE_ENV === ENV.PROD ||
    process.argv.includes("--" + ENV.PROD) ||
    process.argv.includes('-p');
var isTest = process.env.NODE_ENV === ENV.TEST ||
    process.argv.includes("--" + ENV.TEST) ||
    process.argv.includes('-t');
var isDev = !isProd && !isTest;
if (!process.env.NODE_ENV) {
    if (isProd) {
        process.env.NODE_ENV = ENV.PROD;
    }
    else if (isTest) {
        process.env.NODE_ENV = ENV.TEST;
    }
    else {
        process.env.NODE_ENV = ENV.DEV;
    }
}
var inSSR = process.env.NODE_ENV === ENV.SSR ||
    process.argv.includes("--" + ENV.SSR) ||
    process.argv.includes('-ssr');
exports.default = {
    isProd: isProd,
    isTest: isTest,
    isDev: isDev,
    inSSR: inSSR
};
