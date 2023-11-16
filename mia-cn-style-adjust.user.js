// ==UserScript==
// @name         MIA-CN Style Adjust
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  改善中文马克思主义文库的阅读体验
// @author       Balthild
// @match        https://www.marxists.org/chinese/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let fontFamily = localStorage.getItem('font-family') || 'sans';
    let fontSize = Number(localStorage.getItem('font-size')) || 20;
    let textWidth = Number(localStorage.getItem('text-width')) || 32;

    let customFont = localStorage.getItem('custom-font') || `'方正悠宋 GBK 508R', serif`

    function fontFamilyPropertyValue() {
        if (fontFamily === 'custom')
            return customFont;
        if (fontFamily === 'serif')
            return `'Source Serif', 'Noto Serif', 'Source Han Serif SC', 'Noto Serif CJK SC', serif`;
        else
            return `'Source Sans', 'Noto Sans', 'Source Han Sans SC', 'Noto Sans CJK SC', sans-serif`;
    }

    function fontSizePropertyValue() {
        return `${fontSize}px`;
    }

    function textWidthPropertyValue() {
        return `${textWidth}rem`;
    }

    // language=css
    const css = `
        :root {
            --font-family: ${fontFamilyPropertyValue()};
            --font-size: ${fontSizePropertyValue()};
            --text-width: ${textWidthPropertyValue()};

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

        /* Control */
        #control-button, #control-panel {
            position: fixed;
            top: 16px;
            right: 16px;

            font-family: sans-serif;
            background: #FFFFFF;
            border: 1px solid rgb(0 0 0 / 24%);
            box-shadow: 0 1px 3px rgb(0 0 0 / 15%);
            border-radius: 3px;
            overflow: hidden;
            user-select: none;
        }

        #control-button {
            width: 36px;
            height: 36px;
            font-size: 16px;
            line-height: 35px;
            text-align: center;

            cursor: pointer;
            user-select: none;
        }

        #control-button.panel-open {
            display: none;
        }

        #control-button:hover {
            background-color: #EEEEEE;
        }

        #control-panel {
            width: 320px;
            font-size: 14px;
            display: none;
        }

        #control-panel.panel-open {
            display: block;
        }

        #control-panel .icon {
            pointer-events: none;
        }

        #control-panel .control-title {
            display: flex;
            height: 36px;
            border-bottom: 1px solid #CCCCCC;
        }

        #control-panel .control-title-text {
            line-height: 36px;
            flex: 1;
            text-align: center;
        }

        #control-panel #control-close {
            width: 36px;
            height: 36px;
            text-align: center;
            margin-left: -36px;
            cursor: pointer;
        }

        #control-panel #control-close:hover {
            background-color: #EEEEEE;
        }

        #control-panel #control-close .icon {
            width: 20px;
            height: 20px;
            margin: 8px 0;
        }

        #control-panel .control-font-family {
            margin: 8px;
            border: 1px solid #CCCCCC;
            border-radius: 2px;
        }

        #control-panel .control-font-family-button-group {
            display: flex;
        }

        #control-panel .control-font-family-button {
            flex: 1;
            height: 32px;
            line-height: 32px;
            text-align: center;
            cursor: pointer;
        }

        #control-panel .control-font-family-button:hover {
            background: #EEEEEE;
        }

        #control-panel .control-font-family-button.current {
            background: #CCCCCC;
        }

        #control-panel .control-font-family-custom-field {
            height: 32px;
            border-top: 1px solid #CCCCCC;
            cursor: unset;
            display: none;
        }

        #control-panel .control-font-family[data-current="custom"] .control-font-family-custom-field {
            display: block;
        }

        #control-panel .control-font-family-custom-field input {
            font-family: monospace;
            font-size: 1em;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding: 0 8px;
            margin: 0;
            border: 0;
        }

        #control-panel .control-spinbox {
            height: 32px;
            margin: 8px;
            border: 1px solid #CCCCCC;
            display: flex;
            border-radius: 2px;
        }

        #control-panel .control-spinbox span {
            line-height: 32px;
            text-align: center;
            padding: 0 8px;
        }

        #control-panel .control-spinbox-label {
            border-right: 1px solid #CCCCCC;
        }

        #control-panel .control-spinbox-action {
            height: 32px;
            width: 32px;
            text-align: center;
            border-left: 1px solid #CCCCCC;
            cursor: pointer;
        }

        #control-panel .control-spinbox-action .icon {
            width: 20px;
            height: 20px;
            margin: 6px 0;
        }

        #control-panel .control-spinbox-action:hover {
            background-color: #EEEEEE;
        }

        #control-panel .control-spinbox-value {
            flex: 1;
        }
    `;

    function addStyles() {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

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

    function addControlPanel() {
        const iconAdd = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path></svg>`;
        const iconMinus = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 11V13H19V11H5Z"></path></svg>`;
        const iconClose = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"></path></svg>`;

        const panel = document.createElement('div');
        panel.className = 'control-addon';
        panel.id = 'control-panel';
        // language=html
        panel.innerHTML = `
            <div class="control-title">
                <span class="control-title-text">阅读设置</span>
                <div id="control-close">${iconClose}</div>
            </div>
            <div class="control-font-family" data-current="${fontFamily}">
                <div class="control-font-family-button-group">
                    <div class="control-font-family-button" id="control-font-family-serif">思源宋体</div>
                    <div class="control-font-family-button" id="control-font-family-sans">思源黑体</div>
                    <div class="control-font-family-button" id="control-font-family-custom">自定义</div>
                </div>
                <div class="control-font-family-custom-field">
                    <input id="control-font-family-custom-input" type="text" />
                </div>
            </div>
            <div class="control-spinbox">
                <span class="control-spinbox-label">文字大小</span>
                <span class="control-spinbox-value" id="control-font-size-value">${fontSize}</span>
                <div class="control-spinbox-action dec" id="control-font-size-decrease">${iconMinus}</div>
                <div class="control-spinbox-action inc" id="control-font-size-increase">${iconAdd}</div>
            </div>
            <div class="control-spinbox">
                <span class="control-spinbox-label">版心宽度</span>
                <span class="control-spinbox-value" id="control-text-width-value">${textWidth}</span>
                <div class="control-spinbox-action dec" id="control-text-width-decrease">${iconMinus}</div>
                <div class="control-spinbox-action inc" id="control-text-width-increase">${iconAdd}</div>
            </div>
        `;

        const button = document.createElement('div');
        button.className = 'control-addon';
        button.id = 'control-button';
        button.textContent = 'Aa';

        document.body.appendChild(panel);
        document.body.appendChild(button);

        function updateFontFamily(family) {
            fontFamily = family;
            localStorage.setItem('font-family', fontFamily);

            document.documentElement.style.setProperty('--font-family', fontFamilyPropertyValue());

            document.querySelector('.control-font-family').dataset.current = family;
            document.querySelectorAll('.control-font-family-button.current').forEach(el => {
                el.classList.remove('current');
            });
            document.getElementById(`control-font-family-${family}`).classList.add('current');
        }

        function updateFontSize(delta) {
            fontSize += delta;
            localStorage.setItem('font-size', fontSize);

            const propertyValue = fontSizePropertyValue();
            document.documentElement.style.setProperty('--font-size', propertyValue);
            document.getElementById('control-font-size-value').innerText = fontSize;
        }

        function updateTextWidth(delta) {
            textWidth += delta;
            localStorage.setItem('text-width', textWidth);

            const propertyValue = textWidthPropertyValue();
            document.documentElement.style.setProperty('--text-width', propertyValue);
            document.getElementById('control-text-width-value').innerText = textWidth;
        }

        updateFontSize(0);
        updateFontFamily(fontFamily);

        document.addEventListener('click', function (event) {
            let target = event.target;
            if (!target instanceof HTMLElement) {
                return;
            }

            switch (target.id) {
                case 'control-button':
                    panel.classList.add('panel-open');
                    button.classList.add('panel-open');
                    break;
                case 'control-close':
                    panel.classList.remove('panel-open');
                    button.classList.remove('panel-open');
                    break;
                case 'control-font-family-serif':
                    updateFontFamily('serif');
                    break;
                case 'control-font-family-sans':
                    updateFontFamily('sans');
                    break;
                case 'control-font-family-custom':
                    updateFontFamily('custom');
                    break;
                case 'control-font-size-decrease':
                    updateFontSize(-1);
                    break;
                case 'control-font-size-increase':
                    updateFontSize(1);
                    break;
                case 'control-text-width-decrease':
                    updateTextWidth(-1);
                    break;
                case 'control-text-width-increase':
                    updateTextWidth(1);
                    break;
            }
        });

        const input = panel.querySelector('#control-font-family-custom-input');
        input.value = customFont;
        input.addEventListener('input', function (event) {
            let target = event.target;
            if (!target instanceof HTMLInputElement) {
                return;
            }

            customFont = target.value;
            localStorage.setItem('custom-font', customFont);

            if (fontFamily === 'custom')
                document.documentElement.style.setProperty('--font-family', customFont);
        })
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
        addStyles();
        removeRedundantLineBreaks();
        addControlPanel();
    }
})();
