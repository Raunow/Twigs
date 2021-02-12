#!/usr/bin/env node

import { promises } from 'fs';
import { renderMD } from './';
import { resolvePath } from './markdown/markdown';

const [, , ...args] = process.argv;

(async () => {
    const srcPath = resolvePath(args[0]!)
    const MD = await promises.readFile(srcPath);
    console.log(args)
    await renderMD(MD.toString('utf8'), { output: "pdf", path: args[1] });
})();
