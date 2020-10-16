// ==UserScript==
// @name         MIA-CN Style Adjust
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  改善中文马克思主义文库的阅读体验
// @author       Balthild
// @match        https://www.marxists.org/chinese/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let fontFamily = localStorage.getItem('font-family') || 'sans';
    let fontSize = Number(localStorage.getItem('font-size')) || 20;

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

    // language=css
    const css = `
        :root {
            --font-family: ${fontFamilyPropertyValue()};
            --font-size: ${fontSizePropertyValue()};

            font-family: var(--font-family) !important;
            font-size: var(--font-size) !important;
            line-height: 2 !important;
        }

        html {
            margin-left: 0 !important;
            margin-right: 0 !important;
        }

        body {
            max-width: 40rem;
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
        #control-button {
            position: fixed;
            top: 80px;
            right: 0;
            width: 48px;
            height: 48px;
            
            font-size: 18px;
            font-family: sans-serif;
            line-height: 48px;
            text-align: center;
            
            background: #FFFFFF;
            border: 1px solid #CCCCCC;
            border-right: 0;
            border-top-left-radius: 6px;
            border-bottom-left-radius: 6px;
            cursor: pointer;
            user-select: none;
        }
        
        #control-panel {
            position: fixed;
            top: 120px;
            left: 50%;
            width: 320px;
            margin-left: -160px;
            
            font-size: 16px;
            font-family: sans-serif;
            
            display: none;
            background: #FFFFFF;
            border: 1px solid #CCCCCC;
            user-select: none;
        }
        
        #control-panel .control-title {
            display: flex;
            height: 40px;
            border-bottom: 1px solid #CCCCCC;
        }
        
        #control-panel .control-title-text {
            line-height: 40px;
            flex: 1;
            padding-left: 8px;
        }
        
        #control-panel #control-close {
            width: 40px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 24px;
            border-left: 1px solid #CCCCCC;
            cursor: pointer;
        }
        
        #control-panel .control-font-family-item {
            height: 32px;
            line-height: 32px;
            text-align: center;
            margin: 8px;
            border: 1px solid #CCCCCC;
            cursor: pointer;
        }
        
        #control-panel #control-font-family-custom {
            margin-bottom: 0;
        }
        
        #control-panel #control-font-family-custom-input {
            margin-top: 0;
            border-top: 0;
            cursor: unset;
        }
        
        #control-panel #control-font-family-custom-input input {
            font-family: monospace;
            font-size: 0.8em;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding: 0 8px;
            margin: 0;
            border: 0;
        }
        
        #control-panel .control-font-size {
            height: 32px;
            line-height: 32px;
            margin: 8px;
            border: 1px solid #CCCCCC;
            display: flex;
        }
        
        #control-panel .control-font-size-action {
            height: 32px;
            width: 32px;
            text-align: center;
            cursor: pointer;
        }
        
        #control-panel #control-font-size-decrease {
            border-right: 1px solid #CCCCCC;
        }
        
        #control-panel #control-font-size-increase {
            border-left: 1px solid #CCCCCC;
        }
        
        #control-panel #control-font-size-value {
            flex: 1;
            text-align: center;
        }
    `;

    function isArticlePage() {
        let result = false;

        const linkTags = document.querySelectorAll('link');
        for (const tag of linkTags) {
            if (!tag.href)
                continue;

            const filename = tag.href.split('/').pop();
            if (filename === 'MIA01.css')
                result = true;
        }

        const pageFilename = location.pathname.split('/').pop();
        if (['index.htm', 'index.html'].includes(pageFilename))
            result = false;

        return result;
    }

    function addStyles() {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    function nodeNameIs(node, name) {
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
            if (!nodeNameIs(node, 'br'))
                continue;

            let prevNode = node.previousSibling;
            while (prevNode && nodeNameIs(prevNode, '#text') && !prevNode.textContent.trim()) {
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
                nodeNameIs(prevNode, noBreakAfterTag) ||
                noBreakAfterClass.filter(x => prevClasses.has(x)).length;

            if (shouldRemove)
                node.remove();
        }
    }

    function addControlPanel() {
        const panel = document.createElement('div');
        panel.className = 'control-addon';
        panel.id = 'control-panel';
        // language=html
        panel.innerHTML = `
            <div class="control-title">
                <span class="control-title-text">阅读设置</span>
                <div id="control-close">&times;</div>
            </div>
            <div class="control-font-family">
                <div class="control-font-family-item" id="control-font-family-serif">有衬线（思源宋体）</div>
                <div class="control-font-family-item" id="control-font-family-sans">无衬线（思源黑体）</div>
                <div class="control-font-family-item" id="control-font-family-custom">自定义</div>
                <div class="control-font-family-item" id="control-font-family-custom-input">
                    <input type="text" />
                </div>
            </div>
            <div class="control-font-size">
                <div class="control-font-size-action" id="control-font-size-decrease">－</div>
                <span id="control-font-size-value">${fontSizePropertyValue()}</span>
                <div class="control-font-size-action" id="control-font-size-increase">＋</div>
            </div>
        `;

        const button = document.createElement('div');
        button.className = 'control-addon';
        button.id = 'control-button';
        button.textContent = 'Aa';

        document.body.appendChild(panel);
        document.body.appendChild(button);

        function updateFontSize(delta) {
            fontSize += delta;
            localStorage.setItem('font-size', fontSize);

            const propertyValue = fontSizePropertyValue();
            document.documentElement.style.setProperty('--font-size', propertyValue);
            document.getElementById('control-font-size-value').innerText = propertyValue;
        }

        function updateFontFamily(family) {
            fontFamily = family;
            localStorage.setItem('font-family', fontFamily);

            document.documentElement.style.setProperty('--font-family', fontFamilyPropertyValue());
            document.querySelectorAll('.control-font-family-item').forEach(el => el.style.background = 'none');
            document.getElementById(`control-font-family-${family}`).style.background = '#CCCCCC';
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
                    panel.style.display = 'block';
                    break;
                case 'control-close':
                    panel.style.display = 'none';
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
            }
        });

        const input = panel.querySelector('#control-font-family-custom-input input');
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

    if (isArticlePage()) {
        addStyles();
        removeRedundantLineBreaks();
        addControlPanel();
    }
})();
