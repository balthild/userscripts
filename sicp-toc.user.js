// ==UserScript==
// @name        Sidebar ToC for SICP
// @namespace   Violentmonkey Scripts
// @match       https://sarabander.github.io/sicp/html/*
// @grant       none
// @version     1.0
// @author      -
// @description 2024/9/25 14:21:31
// ==/UserScript==

(function () {
    'use strict';

    const indexPath = '/sicp/html/index.xhtml';
    const isIndex = location.pathname === indexPath;

    function throttle(timeout, fn) {
        let interval = undefined;
        let scheduled = false;

        return (...args) => {
            if (interval !== undefined) {
                scheduled = true;
                return;
            }

            fn(...args);
            scheduled = false;

            interval = setInterval(() => {
                if (scheduled) {
                    fn(...args);
                    scheduled = false;
                } else {
                    clearInterval(interval);
                    interval = undefined;
                }
            }, timeout);
        };
    }

    function getStyles() {
        const css = String.raw;

        return css`
            body {
                display: flex;
                position: relative;
            }

            body > section {
                box-sizing: border-box;
                width: auto;
                max-width: min(30em, 70%);
                overflow-y: auto;
                margin: 0 auto;
                padding: 0 1em;
            }

            #pagebottom {
                position: absolute;
                bottom: 0;
            }

            .side-toc {
                box-sizing: border-box;
                position: sticky;
                top: 0;
                align-self: flex-start;
                font-size: 0.65rem;
                min-width: 15em;
                max-width: 25em;
                height: 100vh;
                overflow-y: auto;
                line-height: 110%;
                padding: 1em 0.6em;
            }

            .side-toc ul {
                margin: 0;
                padding: 0;
            }

            .side-toc li {
                position: relative;
            }

            .side-toc li ul {
                padding-left: 1em;
            }

            .side-toc li ul::before {
                content: ' ';
                position: absolute;
                left: 0.5em;
                top: 1.5em;
                bottom: 0.5em;
                z-index: -1;
                width: 0px;
                border-left: 1px dashed #bbbbbb;
            }

            .side-toc li a.current + ul::before {
                border-left-color: #804040;
            }

            .side-toc a {
                display: flex;
                padding: 0.35em 0.3em 0.1em;
            }

            .side-toc a.current {
                background-color: #804040;
                color: #ffffff;
            }

            .side-toc a .number {
                margin-right: 0.4em;
            }

            .side-toc a:hover .title {
                text-decoration: underline;
            }
        `;
    }

    async function getContentsHTML() {
        let toc = localStorage.getItem('toc');
        if (toc) return toc;

        if (isIndex) {
            toc = document.querySelector('.contents').innerHTML;
        } else {
            const response = await fetch('/sicp/html/index.xhtml');
            const type = response.headers.get('Content-Type');
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, type);

            toc = doc.querySelector('.contents').innerHTML;
        }

        localStorage.setItem('toc', toc);

        return toc;
    }

    function findCurrentAnchor(anchors) {
        const line = window.innerHeight * 0.3;

        for (const anchor of [...anchors].reverse()) {
            const rect = anchor.getBoundingClientRect();
            if (rect.top < line) {
                return anchor;
            }
        }

        return anchors[0];
    }

    async function main() {
        if (isIndex) {
            await getContentsHTML();
            return;
        }

        if (!location.pathname.endsWith('.xhtml')) {
            return;
        }

        const html = await getContentsHTML();

        const style = document.createElement('style');
        style.innerHTML = getStyles();
        document.head.appendChild(style);

        const aside = document.createElement('aside');
        aside.className = 'side-toc';
        aside.innerHTML = html;
        document.body.prepend(aside);

        aside.querySelectorAll('a').forEach((link) => {
            const text = link.textContent.trim();
            const space = text.indexOf(' ');

            const number = text.substring(0, space);
            const title = text.substring(space + 1);

            if (/^[\d\.]+$/.test(number)) {
                link.innerHTML = `<span class="number">${number}</span><span class="title">${title}</span>`;
            } else {
                link.innerHTML = `<span class="title">${text}</span>`;
            }
        });

        const filename = location.pathname.split('/').pop();
        const links = Array.from(aside.querySelectorAll(`a[href^="${filename}"]`));
        for (const link of links) {
            link.dataset.anchor = link.href.split('#').pop();
        }

        if (links) {
            const selector = links.filter(Boolean).map((x) => '#' + x.dataset.anchor).join(',');
            const anchors = Array.from(document.querySelectorAll(selector));

            let highlighted;
            const highlightCurrentLink = () => {
                const anchor = findCurrentAnchor(anchors);
                if (anchor.id === highlighted?.dataset?.anchor) {
                    return;
                }

                highlighted?.classList?.remove('current');

                highlighted = links.find((x) => x.dataset.anchor == anchor.id);
                highlighted.classList.add('current');
            };

            highlightCurrentLink();
            highlighted.scrollIntoView({
                block: 'center',
            });

            document.addEventListener(
                'scroll',
                throttle(200, () => {
                    highlightCurrentLink();
                    history.replaceState(null, '', highlighted.href);
                }),
                { passive: true },
            );
        }
    }

    main();
})();
