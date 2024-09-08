// ==UserScript==
// @name         element in-page fullscreen
// @namespace    http://tampermonkey.net/
// @version      2024-08-27
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(async function () {
    'use strict';

    function getSelector() {
        switch (location.host) {
            case 'www.7xi.tv':
                return '#playleft iframe';

            case 'www.iyf.tv':
                return '#main-player';

            case 'canvas.illinoisstate.edu':
            case 'illinoisstate.instructure.com':
                return '#doc_preview iframe';
        }
    }

    function getStyles() {
        // Enable Syntax Highlighting
        const css = String.raw;

        let styles = css`
            body.fullscreen {
                overflow: hidden;
            }

            body.fullscreen .in-page-fullscreen-element {
                position: fixed !important;
                z-index: 99999 !important;
                left: 0 !important;
                top: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100% !important;
                height: 100% !important;
            }
        `;

        switch (location.host) {
            case 'www.7xi.tv':
                styles += css`
                    body.fullscreen .player-left {
                        z-index: 99999;
                    }
                `;

            case 'canvas.illinoisstate.edu':
            case 'illinoisstate.instructure.com':
                styles += css`
                    body.fullscreen #header {
                        display: none;
                    }
                `;
        }

        return styles;
    }

    // Inside iframe
    if (window.parent !== window) {
        window.addEventListener('keydown', (event) => {
            if (event.code === 'KeyT') {
                window.parent.postMessage('toggle-fullscreen', '*');
            } else if (event.code === 'Escape') {
                window.parent.postMessage('exit-fullscreen', '*');
            }
        });

        return;
    }

    // Top window
    const selector = getSelector()
    if (!selector) {
        return;
    }

    let iframe = document.querySelector(selector);
    while (!iframe) {
        await new Promise((r) => setTimeout(r, 1000));
        iframe = document.querySelector(selector);
    }

    iframe.classList.add('in-page-fullscreen-element');

    const style = document.createElement('style');
    style.innerHTML = getStyles();
    document.head.appendChild(style);

    function toggle() {
        document.body.classList.toggle('fullscreen');
    }

    function exit() {
        document.body.classList.remove('fullscreen');
    }

    window.addEventListener('message', (message) => {
        if (message.source !== iframe.contentWindow) {
            return;
        }

        if (message.data === 'toggle-fullscreen') {
            toggle();
        } else if (message.data === 'exit-fullscreen') {
            exit();
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.code === 'KeyT') {
            toggle();
        } else if (event.code === 'Escape') {
            exit();
        }
    });
})();
