// ==UserScript==
// @name        Highlight Italic Texts
// @namespace   Violentmonkey Scripts
// @match       https://www.negationmag.com/*
// @run-at      document-idle
// @grant       none
// @version     1.0
// @author      Balthild
// @description 高亮意大利体文本
// ==/UserScript==

(function () {
    'use strict';

    function getIgnoreClasses() {
        switch (location.hostname) {
            case 'www.negationmag.com':
                return 'pull-quote';
        }
    }

    function createNodeFilter() {
        const classes = getIgnoreClasses().split(',').map((x) => x.trim());

        return (node) => {
            if (!node.nodeName || node.nodeName.startsWith('#')) {
                return NodeFilter.FILTER_REJECT;
            }

            if (node.nodeName.toLowerCase() === 'blockquote') {
                return NodeFilter.FILTER_REJECT;
            }

            if (classes.some((x) => node.classList.contains(x))) {
                return NodeFilter.FILTER_REJECT;
            }

            return NodeFilter.FILTER_ACCEPT;
        };
    }

    const style = document.createElement('style');
    document.head.appendChild(style);
    style.innerHTML = `
        .highlight-emphasis {
            background-color: yellow;
        }
    `;

    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ELEMENT,
        createNodeFilter(),
    );

    let element;
    while ((element = walker.nextNode())) {
        const style = window.getComputedStyle(element);
        if (style.fontStyle === 'italic') {
            element.classList.add('highlight-emphasis');
        }
    }
})();
