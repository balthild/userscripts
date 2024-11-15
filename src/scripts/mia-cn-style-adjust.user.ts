// ==UserScript==
// @name         MIA-CN Style Adjust
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  改善中文马克思主义文库的阅读体验
// @author       Balthild
// @match        https://www.marxists.org/chinese/*
// @grant        none
// ==/UserScript==

import cssControl from 'bundle-text:./mia-cn-style-adjust/control.scss';
import cssMain from 'bundle-text:./mia-cn-style-adjust/main.scss';

import iconAdd from 'bundle-text:./mia-cn-style-adjust/add.svg';
import iconClose from 'bundle-text:./mia-cn-style-adjust/close.svg';
import iconMinus from 'bundle-text:./mia-cn-style-adjust/minus.svg';

import { createApp } from 'petite-vue';

import { insertStyle } from './common/utils';

main();

function main() {
    const style = insertStyle(cssMain);

    if (isArticlePage()) {
        removeRedundantLineBreaks();
    }

    const control = document.createElement('div');
    const shadowRoot = control.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
        <style>${cssControl}</style>

        <div id="control-app" v-scope @vue:mounted="mounted" @vue:unmounted="unmounted">
            <div class="addon button" v-show="!open" @click="open = true">Aa</div>
            <div class="addon panel" v-show="open">
                <div class="title">
                    <span class="title-text">阅读设置</span>
                    <div class="close" @click="open = false">${iconClose}</div>
                </div>

                <div hidden v-effect="applyPageStatus()"></div>
                <div class="tabs">
                    <div class="tab" v-tab="pageStatus:auto">自动判断</div>
                    <div class="tab" v-tab="pageStatus:enabled">本页启用</div>
                    <div class="tab" v-tab="pageStatus:disabled">本页禁用</div>
                </div>

                <div hidden v-effect="applyFontFamily()"></div>
                <div hidden v-effect="applyFontCustom()"></div>
                <div class="tabs">
                    <div class="tab" v-tab="fontFamily:serif">思源宋体</div>
                    <div class="tab" v-tab="fontFamily:sans">思源黑体</div>
                    <div class="tab" v-tab="fontFamily:custom">自定义</div>
                    <div class="font-custom-input" v-show="fontFamily === 'custom'">
                        <input type="text" v-model="fontCustom" />
                    </div>
                </div>

                <div hidden v-effect="applyFontSize()"></div>
                <div class="spinbox">
                    <span class="label">文字大小</span>
                    <span class="value">{{ fontSize }}</span>
                    <div class="action" @click="fontSize--">${iconMinus}</div>
                    <div class="action" @click="fontSize++">${iconAdd}</div>
                </div>

                <div hidden v-effect="applyTextWidth()"></div>
                <div class="spinbox">
                    <span class="label">版心宽度</span>
                    <span class="value">{{ textWidth }}</span>
                    <div class="action" @click="textWidth--">${iconMinus}</div>
                    <div class="action" @click="textWidth++">${iconAdd}</div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(control);

    const app = createApp({
        open: false,
        settings: {
            pageStatus: localStorage.getItem(`page-status:${location.pathname}`) ?? 'auto',
            fontFamily: localStorage.getItem('font-family') || 'sans',
            fontCustom: localStorage.getItem('font-custom') || `'方正悠宋 GBK 508R', serif`,
            fontSize: Number(localStorage.getItem('font-size')) || 20,
            textWidth: Number(localStorage.getItem('text-width')) || 32,
        },

        get pageStatus() {
            return this.settings.pageStatus;
        },
        set pageStatus(value) {
            this.settings.pageStatus = value;
            if (value === 'auto') {
                localStorage.removeItem(`page-status:${location.pathname}`);
            } else {
                localStorage.setItem(`page-status:${location.pathname}`, value);
            }
        },
        applyPageStatus() {
            if (this.pageStatus === 'auto') {
                style.disabled = !isArticlePage();
            } else {
                style.disabled = this.pageStatus === 'disabled';
            }
        },

        get fontFamily() {
            return this.settings.fontFamily;
        },
        set fontFamily(value) {
            this.settings.fontFamily = value;
            localStorage.setItem('font-family', value);
        },
        applyFontFamily() {
            document.documentElement.style.setProperty('--font-family', `var(--font-${this.fontFamily})`);
        },

        get fontCustom() {
            return this.settings.fontCustom;
        },
        set fontCustom(value) {
            this.settings.fontCustom = value;
            localStorage.setItem('font-custom', value);
        },
        applyFontCustom() {
            document.documentElement.style.setProperty('--font-custom', this.fontCustom);
        },

        get fontSize() {
            return this.settings.fontSize;
        },
        set fontSize(value) {
            this.settings.fontSize = value;
            localStorage.setItem('font-size', value);
        },
        applyFontSize() {
            document.documentElement.style.setProperty('--font-size', `${this.fontSize}px`);
        },

        get textWidth() {
            return this.settings.textWidth;
        },
        set textWidth(value) {
            this.settings.textWidth = value;
            localStorage.setItem('text-width', value);
        },
        applyTextWidth() {
            document.documentElement.style.setProperty('--text-width', `${this.textWidth}rem`);
        },

        pullSettings(event: StorageEvent) {
            if (event.storageArea !== localStorage) {
                return;
            }

            switch (event.key) {
                case `page-status:${location.pathname}`:
                    this.settings.pageStatus = event.newValue ?? 'auto';
                    break;
                case 'font-family':
                    this.settings.fontFamily = event.newValue ?? 'sans';
                    break;
                case 'font-custom':
                    this.settings.fontCustom = event.newValue ?? `'方正悠宋 GBK 508R', serif`;
                    break;
                case 'font-size':
                    this.settings.fontSize = Number(event.newValue) || 20;
                    break;
                case 'text-width':
                    this.settings.textWidth = Number(event.newValue) || 32;
                    break;
            }
        },

        mounted() {
            window.addEventListener('storage', this.pullSettings);
        },
        unmounted() {
            window.removeEventListener('storage', this.pullSettings);
        },
    }).directive('tab', (ctx) => {
        const [name, value] = ctx.exp.split(':');
        console.log(ctx.arg);
        ctx.el.addEventListener('click', () => {
            return ctx.get(`${name} = '${value}'`);
        });
        ctx.effect(() => {
            return ctx.el.classList.toggle('current', ctx.get(name) === value);
        });
    }).mount(shadowRoot.querySelector('#control-app'));
}

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
