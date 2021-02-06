#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { Octokit } = require("@octokit/core");
const styles = require('./styles.js');
//import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');

const [, , ...args] = process.argv;

(async () => {
    try {
        const inPath = path.resolve(process.cwd(), args[0])
        const MD = await fs.promises.readFile(inPath);

        const octokit = new Octokit({ userAgent: 'twigs-markdown/v0.1.0' });
        const resp = await octokit.request('POST /markdown', {
            text: MD.toString()
        });

        if (resp.status == 200) {
            const outPath = path.resolve(process.cwd(), args[1]);
            const html = styles.css + `<div class="markdown-body">\n${resp.data}\n</div>`;

            const browser = await puppeteer.launch({
                headless: true,
                defaultViewport: null,
                args: ['--font-render-hinting=none']
            });
            const page = await browser.newPage();
            await page.setContent(html, {waitUntil: "load"});
            const pdf = await page.pdf({
                format: 'a4',
                margin: { left: '1cm', top: '1cm', right: '1cm', bottom: '1cm' },
                printBackground: true,
            });

            await browser.close();

            await fs.promises.writeFile(outPath, pdf);
        } else {
            console.log(resp);
        }




    } catch (e) {
        console.log(e);
    }
})();
