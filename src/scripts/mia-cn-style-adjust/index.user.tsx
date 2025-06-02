import './global.css' with { id: 'global-style' };

import { render } from 'solid-js/web';

import { defineUserscript } from 'citlali';
import { StyleControl } from './control';

export default defineUserscript({
    name: 'MIA-CN Style Adjust',
    namespace: 'https://github.com/balthild/userscripts',
    version: '0.2',
    description: '改善中文马克思主义文库的阅读体验',
    author: 'Balthild',
    match: ['https://www.marxists.org/*'],

    main() {
        if (isArticlePage()) {
            removeRedundantLineBreaks();
        }

        const control = document.createElement('div');
        document.body.appendChild(control);

        render(() => <StyleControl isArticlePage={isArticlePage()} />, control);
    },
});

function isArticlePage() {
    let result = true;

    const linkTags = document.querySelectorAll('link');
    for (const tag of linkTags) {
        if (!tag.href) {
            continue;
        }

        const filename = tag.href.split('/').pop()!;
        if (filename.endsWith('MIA01.css')) {
            result = true;
        }
    }

    const pageFilename = location.pathname.split('/').pop()!;
    if (/index.*\.html?$/.test(pageFilename)) {
        result = false;
    }
    if (!pageFilename.includes('.')) {
        result = false;
    }

    return result;
}

function removeRedundantLineBreaks() {
    const nodes: Node[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ALL);
    while (walker.nextNode()) {
        nodes.push(walker.currentNode);
    }

    for (const node of nodes) {
        if (!isNodeName(node, 'br')) {
            continue;
        }

        let prev = node.previousSibling;
        while (prev && isNodeName(prev, '#text') && !prev.textContent?.trim()) {
            prev.remove();
            prev = prev.previousSibling;
        }

        if (shouldRemoveCurrentLineBreak(prev)) {
            node.remove();
        }
    }
}

function isNodeName<N extends keyof HTMLElementTagNameMap>(node: Node, name: N): node is HTMLElementTagNameMap[N];
function isNodeName(node: Node, name: '#text'): node is Text;
function isNodeName(node: Node, name: string[]): boolean;
function isNodeName(node: Node, name: string | string[]) {
    if (Array.isArray(name)) {
        return name.includes(node.nodeName.toLowerCase());
    } else {
        return name === node.nodeName.toLowerCase();
    }
}

function shouldRemoveCurrentLineBreak(prev: Node | null) {
    if (!prev?.textContent?.trim()) {
        return true;
    }

    const selectors = 'br, h1, h2, h3, h4, h5, h6, blockquote, .a1, .a2, .a3, .a4, .intr, .intr1';
    if (prev instanceof Element && prev.matches(selectors)) {
        return true;
    }

    return false;
}
