// ==UserScript==
// @name         MIA-CN Style Adjust
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  改善中文马克思主义文库的阅读体验
// @author       Balthild
// @match        https://www.marxists.org/chinese/*
// @require      https://cdn.jsdelivr.net/npm/petite-vue@0.4.1/dist/petite-vue.iife.min.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // language=css
    const css = `
        :root {
            --font-sans: 'Source Sans', 'Noto Sans', 'Source Han Sans SC', 'Noto Sans CJK SC', sans-serif;
            --font-serif: 'Source Serif', 'Noto Serif', 'Source Han Serif SC', 'Noto Serif CJK SC', serif;
            --font-custom: '方正悠宋 GBK 508R', serif;

            --font-family: var(--font-sans);
            --font-size: 20px;
            --text-width: 32rem;

            font-family: var(--font-family) !important;
            font-size: var(--font-size) !important;
            line-height: 1.9 !important;
        }

        html {
            margin-left: 0 !important;
            margin-right: 0 !important;
        }

        body {
            max-width: var(--text-width) !important;
            margin-left: auto !important;
            margin-right: auto !important;
            padding: 0 2rem;
        }

        body * {
            line-height: 2;
        }

        p.MsoNormal, li.MsoNormal, div.MsoNormal,
        h1, h2, h3, h4, h5, h6,
        p, p.title0, p.title1, p.title2,
        p.weba, p.author, p.date, p.intr, p.intr1,
        div.a1, div.a2, div.a3, div.a4,
        pre, .content, table:not(#x)
        {
            font-family: unset;
            line-height: unset;
            box-sizing: border-box;
        }

        body, p {
            font-size: inherit;
            text-align: justify;
        }

        table {
            font-size: unset;
            width: auto;
        }

        h1, h2, h3, h4, h5, h6 {
            margin: 1em 0 !important;
        }

        h1 {
            font-size: 1.6rem !important;
        }

        h2 {
            font-size: 1.4rem !important;
        }

        h3 {
            font-size: 1.2rem !important;
        }

        h4 {
            font-size: 1.1rem !important;
        }

        h5 {
            font-size: 1rem !important;
        }

        div.a1, div.a2, div.a3, div.a4, blockquote {
            margin: 1rem 0;
            font-size: 0.9rem;
            padding: 1rem 1.6rem;
            background-color: rgba(0, 0, 0, 0.05);
            border-left: 5px solid rgba(0, 0, 0, 0.1);
            line-height: 2;
        }

        sup, sub {
            font-size: 10.5pt;
        }

        img {
            background: #FFFFFF;
            border: 1px solid #CCCCCC;
            padding: 1rem;
            margin: 1rem 0;
        }

        hr {
            margin: 1rem 0;
        }

        .MsoFootnoteText {
            font-size: 10.5pt;
        }

        .MsoFootnoteText * {
            font-family: unset !important;
        }

        @media (min-width: 768px) {
            body {
                padding: 0 4rem;
            }
        }
    `;

    const style = document.createElement('style');
    style.disabled = true;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    const iconAdd = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path></svg>`;
    const iconMinus = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 11V13H19V11H5Z"></path></svg>`;
    const iconClose = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"></path></svg>`;

    const control = document.createElement('div');
    control.attachShadow({ mode: 'open' });
    control.shadowRoot.innerHTML = `
        <style>
            .addon {
                position: fixed;
                top: 20px;
                right: 20px;

                font-family: sans-serif;
                background: #FFFFFF;
                border: 1px solid rgb(0 0 0 / 24%);
                box-shadow: 0 1px 3px rgb(0 0 0 / 15%);
                border-radius: 3px;
                overflow: hidden;
                user-select: none;
            }

            .addon.button {
                width: 36px;
                height: 36px;
                font-size: 16px;
                line-height: 35px;
                text-align: center;

                cursor: pointer;
                user-select: none;
            }

            .addon.button:hover {
                background-color: #EEEEEE;
            }

            .addon.panel {
                width: 320px;
                font-size: 14px;
            }

            .icon {
                pointer-events: none;
            }

            .title {
                display: flex;
                height: 36px;
                border-bottom: 1px solid #CCCCCC;
            }

            .title-text {
                line-height: 36px;
                flex: 1;
                text-align: center;
            }

            .close {
                width: 36px;
                height: 36px;
                text-align: center;
                margin-left: -36px;
                cursor: pointer;
            }

            .close:hover {
                background-color: #EEEEEE;
            }

            .close .icon {
                width: 20px;
                height: 20px;
                margin: 8px 0;
            }

            .tabs {
                margin: 8px;
                border: 1px solid #CCCCCC;
                border-radius: 2px;
                display: flex;
                flex-wrap: wrap;
            }

            .tab {
                flex: 1;
                height: 32px;
                line-height: 32px;
                text-align: center;
                cursor: pointer;
            }

            .tab:hover {
                background: #EEEEEE;
            }

            .tab.current {
                background: #CCCCCC;
            }

            .font-custom-input {
                flex-basis: 100%;
                height: 32px;
                border-top: 1px solid #CCCCCC;
                cursor: unset;
            }

            .font-custom-input input {
                font-family: monospace;
                font-size: 1em;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                padding: 0 8px;
                margin: 0;
                border: 0;
            }

            .spinbox {
                height: 32px;
                margin: 8px;
                border: 1px solid #CCCCCC;
                display: flex;
                border-radius: 2px;
            }

            .spinbox span {
                line-height: 32px;
                text-align: center;
                padding: 0 8px;
            }

            .spinbox span.label {
                border-right: 1px solid #CCCCCC;
            }

            .spinbox span.value {
                flex: 1;
            }

            .spinbox .action {
                height: 32px;
                width: 32px;
                text-align: center;
                border-left: 1px solid #CCCCCC;
                cursor: pointer;
            }

            .spinbox .action:hover {
                background-color: #EEEEEE;
            }

            .spinbox .action .icon {
                width: 20px;
                height: 20px;
                margin: 6px 0;
            }
        </style>

        <div id="control-app" v-scope @vue:mounted="mounted" @vue:unmounted="unmounted">
            <div class="addon button" v-show="!open" @click="open = true">Aa</div>
            <div class="addon panel" v-show="open">
                <div class="title">
                    <span class="title-text">阅读设置</span>
                    <div class="close" @click="open = false">${iconClose}</div>
                </div>

                <div hidden v-effect="applyPageStatus()"></div>
                <div class="tabs">
                    <div class="tab" v-tab:auto="pageStatus">自动判断</div>
                    <div class="tab" v-tab:enabled="pageStatus">本页启用</div>
                    <div class="tab" v-tab:disabled="pageStatus">本页禁用</div>
                </div>

                <div hidden v-effect="applyFontFamily()"></div>
                <div hidden v-effect="applyFontCustom()"></div>
                <div class="tabs">
                    <div class="tab" v-tab:serif="fontFamily">思源宋体</div>
                    <div class="tab" v-tab:sans="fontFamily">思源黑体</div>
                    <div class="tab" v-tab:custom="fontFamily">自定义</div>
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

    PetiteVue
        .createApp({
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
                if (value === 'auto')
                    localStorage.removeItem(`page-status:${location.pathname}`);
                else
                    localStorage.setItem(`page-status:${location.pathname}`, value);
            },
            applyPageStatus() {
                if (this.pageStatus === 'auto')
                    style.disabled = !isArticlePage();
                else
                    style.disabled = (this.pageStatus === 'disabled');
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

            pullSettings(event) {
                if (event.storageArea !== localStorage)
                    return;

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
        })
        .directive('tab', (ctx) => {
            ctx.el.addEventListener('click', () => {
                return ctx.get(`${ctx.exp} = '${ctx.arg}'`);
            });
            ctx.effect(() => {
                return ctx.el.classList.toggle('current', ctx.get() === ctx.arg);
            });
        })
        .mount(control.shadowRoot.querySelector('#control-app'));

    function nodeNameIsAny(node, name) {
        if (Array.isArray(name))
            return name.includes(node.nodeName.toLowerCase());
        else
            return name === node.nodeName.toLowerCase();
    }

    function removeRedundantLineBreaks() {
        const allNodes = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ALL);
        while (walker.nextNode())
            allNodes.push(walker.currentNode);

        for (const node of allNodes) {
            if (!nodeNameIsAny(node, 'br'))
                continue;

            let prevNode = node.previousSibling;
            while (prevNode && nodeNameIsAny(prevNode, '#text') && !prevNode.textContent.trim()) {
                prevNode.remove();
                prevNode = prevNode.previousSibling;
            }

            if (!prevNode) {
                node.remove();
                continue;
            }

            const noBreakAfterTag = [
                'br',
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'blockquote',
            ];

            const noBreakAfterClass = [
                'a1',
                'a2',
                'a3',
                'a4',
                'intr',
                'intr1',
            ];

            const prevClasses = new Set(prevNode.classList);

            const shouldRemove =
                !(prevNode.textContent || '').trim() ||
                nodeNameIsAny(prevNode, noBreakAfterTag) ||
                noBreakAfterClass.filter(x => prevClasses.has(x)).length;

            if (shouldRemove)
                node.remove();
        }
    }

    function isArticlePage() {
        let result = true;

        const linkTags = document.querySelectorAll('link');
        for (const tag of linkTags) {
            if (!tag.href)
                continue;

            const filename = tag.href.split('/').pop();
            if (filename.endsWith('MIA01.css'))
                result = true;
        }

        const pageFilename = location.pathname.split('/').pop();
        if (/index.*\.html?$/.test(pageFilename))
            result = false;
        if (!pageFilename.includes('.'))
            result = false;

        return result;
    }

    if (isArticlePage()) {
        removeRedundantLineBreaks();
    }
})();
