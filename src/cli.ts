#!/usr/bin/env node

import { promises } from 'fs';
import * as yargs from 'yargs';
import { renderMD } from './';
import { resolvePath } from './markdown/markdown';

yargs
    .scriptName('twigs')
    .usage('$0 <cmd> [args]')
    .command('markdown [src] [out] [args]', 'Create a .pdf from a source .md file', (yargs) => {
        yargs.positional('src', {
            type: 'string',
            demandOption: true,
            describe: 'source file to read markdown from'
        }).positional('out', {
            type: 'string',
            demandOption: true,
            describe: 'destination file'
        }).option('type', {
            alias: 't',
            default: 'pdf',
            choices: ['pdf', 'html', 'png', 'jpeg'],
            describe: 'output file type'
        }).option('style', {
            alias: 's',
            describe: 'path to custom CSS, overrides default CSS'
        }).option('rawHTML', {
            alias: 'r',
            boolean: true,
            describe: 'Get raw HTML'
        })
    }, async (args) => {
        const srcPath = resolvePath(<string>args.src)
        const MD = await promises.readFile(srcPath);

        let css: string | undefined;
        if (args.css) {
            const cssPath = resolvePath(<string>args.css);
            css = (await promises.readFile(cssPath)).toString('utf8');
        }

        const html = await renderMD(MD.toString('utf8'), { output: <any>args.type, path: <string>args.out, customCSS: css });

        if (args.rawHTML) {
            const outPath = resolvePath(<string>args.out)
            await promises.writeFile(outPath, html);
        }
    })
    .help()
    .argv

export type RenderOptions = {
    rawHTML?: boolean,
}