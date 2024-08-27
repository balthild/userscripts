// ==UserScript==
// @name         iframe in-page fullscreen
// @namespace    http://tampermonkey.net/
// @version      2024-08-27
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(async function () {
    'use strict';

    function getIFrameSelector() {
        switch (location.host) {
            case 'www.7xi.tv':
                return '#playleft iframe';

            case 'canvas.illinoisstate.edu':
            case 'illinoisstate.instructure.com':
                return '#doc_preview iframe';
        }
    }

    function getStyles() {
        // Enable Syntax Highlighting
        const css = String.raw;

        let styles = css`
            body.fullscreen iframe.fullscreen-iframe {
                position: fixed;
                z-index: 99999;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                width: 100vw;
                height: 100vh;
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
    const selector = getIFrameSelector()
    if (!selector) {
        return;
    }

    let iframe = document.querySelector(selector);
    while (!iframe) {
        await new Promise((r) => setTimeout(r, 1000));
        iframe = document.querySelector(selector);
    }

    iframe.classList.add('fullscreen-iframe');

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
        console.log(message);
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
