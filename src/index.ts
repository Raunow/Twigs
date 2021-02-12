import { PDFOptions } from 'puppeteer/lib/cjs/puppeteer/api-docs-entry';
import { applyStyling, convertToHTML, createPDF as createMedia } from './markdown/markdown';

export type RenderOptions = {
    rawHTML?: boolean,
    customCSS?: string,
    output: "html" | "pdf" | "png" | "jpeg" | PDFOptions,
    path?: string,
}

export async function renderMD(MDSource: string, options: RenderOptions) {
    try {
        let html = convertToHTML(MDSource);

        if (options.customCSS) {
            html = applyStyling(html, options.customCSS);
        }
        else if (!options.rawHTML) {
            html = applyStyling(html);
        }

        if (options.output === 'html') return html;


        return await createMedia(html, options.output, options.path);

    } catch (e) {
        console.log(e);
        return null;
    }
}