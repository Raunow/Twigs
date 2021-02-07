#!/usr/bin/env node

import { resolve } from 'path';
import { promises } from 'fs'
import { Octokit } from "@octokit/core";
import { css } from './styles.js';
const puppeteer = require('puppeteer');

const [, , ...args] = process.argv;

(async () => {
    try {
        const inPath = resolve(process.cwd(), args[0]!)
        const MD = await promises.readFile(inPath);

        const octokit = new Octokit({ userAgent: 'twigs-markdown/v0.1.0' });
        const resp = await octokit.request('POST /markdown', {
            text: MD.toString()
        });

        if (resp.status == 200) {
            const outPath = resolve(process.cwd(), args[1]!);
            const html = css + `<div class="markdown-body">\n${resp.data}\n</div>`;

            const browser = await puppeteer.launch({
                headless: true,
                defaultViewport: undefined,
                args: ['--font-render-hinting=none']
            });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: "load" });
            const pdf = await page.pdf({
                format: 'a4',
                margin: { left: '1cm', top: '1cm', right: '1cm', bottom: '1cm' },
                printBackground: true,
            });

            await browser.close();

            await promises.writeFile(outPath, pdf);
        } else {
            console.log(resp);
        }




    } catch (e) {
        console.log(e);
    }
})();
