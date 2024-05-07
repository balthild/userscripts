// ==UserScript==
// @name         7xi.tv in-page fullscreen
// @namespace    http://tampermonkey.net/
// @version      2024-05-01
// @description  try to take over the world!
// @author       You
// @match        https://www.7xi.tv/*
// @match        https://play.img007.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=7xi.tv
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Inside player iframe
    if (location.host !== 'www.7xi.tv') {
        window.addEventListener('keydown', (event) => {
            if (event.code === 'KeyW') {
                window.parent.postMessage('toggle-fullscreen', 'https://www.7xi.tv');
            }
        });

        return;
    }

    // Top window
    const iframe = document.querySelector('#playleft iframe');
    if (!iframe) {
        return;
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .fullscreen .player-left {
            z-index: 99999;
        }
        .fullscreen #playleft iframe {
            position: fixed;
            z-index: 99999;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            width: 100vw;
            hright: 100vh;
        }
    `;
    document.head.appendChild(style);

    function toggle() {
        document.body.classList.toggle('fullscreen');
    }

    window.addEventListener('message', (message) => {
        if (message.source === iframe.contentWindow && message.data === 'toggle-fullscreen') {
            toggle();
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.code === 'KeyW') {
            toggle();
        }
    });

})();
