import * as marked from 'marked';
import { resolve } from 'path';
import * as puppeteer from 'puppeteer';
import { PDFOptions } from 'puppeteer/lib/cjs/puppeteer/api-docs-entry';
import { css } from './styles.js';


export function resolvePath(path: string) {
    return resolve(process.cwd(), path);
}

export function convertToHTML(rawMD: string) {

    return marked.parse(rawMD);
}

export function applyStyling(rawHtml: string, style = css) {
    return `${style}\n<div class="markdown-body">\n${rawHtml}\n</div>`;
}

export async function createPDF(html: string, type: "pdf" | "png" | "jpeg" | PDFOptions, path?: string) {
    try {
        const browser = await (await puppeteer).launch({
            headless: true,
            defaultViewport: undefined,
            args: ['--font-render-hinting=none'],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "load" });

        let result: any;

        if (typeof type === 'object') {
            result = await page.pdf(type);
        } else if (type === "pdf") {
            result = await page.pdf({
                format: 'a4',
                path,
                margin: { left: '1cm', top: '1cm', right: '1cm', bottom: '1cm' },
                printBackground: true,
            });
        } else {
            result = await page.screenshot({
                type,
                path,
                fullPage: true,
            })
        }
        await browser.close();

        return result;
    } catch (e) {
        console.log(e);
        return null;
    }
}

