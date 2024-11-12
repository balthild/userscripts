// ==UserScript==
// @name        Twitter Video Speed Shortcuts
// @namespace   Violentmonkey Scripts
// @match       https://x.com/*
// @match       https://twitter.com/*
// @grant       none
// @version     1.0
// @author      Balthild
// @description Twitter 视频速度调整快捷键（小于号、大于号）
// ==/UserScript==

(function () {
    'use strict';

    const config = {
        delta: 0.25,
        min: 1,
        max: 2,
    };

    const message = document.createElement('div');
    message.style.cssText = `
        display: none;
        width: 72px;
        padding: 10px 0;
        font-size: 18px;
        text-align: center;
        background: rgba(255 255 255 / 80%);
        border-radius: 6px;
        position: absolute;
        z-index: 99999;
    `;
    document.body.appendChild(message);

    let timeout = undefined;
    function showMessage(box, text) {
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }

        const left = box.left + box.width / 2 - 40;
        const top = box.top + window.scrollY + 32;

        message.textContent = text;
        message.style.left = `${left}px`;
        message.style.top = `${top}px`;
        message.style.display = 'block';

        timeout = setTimeout(() => {
            message.style.display = 'none';
            timeout = undefined;
        }, 1500);
    }

    function updateSpeed(video, sign) {
        let speed = video.playbackRate + config.delta * sign;
        if (speed > config.max) speed = config.max;
        if (speed < config.min) speed = config.min;

        video.playbackRate = speed;

        const rect = video.getBoundingClientRect();
        showMessage(rect, `${speed}x`);
    }

    function isPlaying(video) {
        return video.currentTime > 0 && !video.paused && !video.ended;
    }

    window.addEventListener('keydown', (event) => {
        if (event.shiftKey && ['<', '>'].includes(event.key)) {
            const videos = document.querySelectorAll('video');
            for (const video of videos) {
                if (isPlaying(video)) {
                    updateSpeed(video, event.key === '<' ? -1 : 1);
                    return;
                }
            }
        }
    });
})();
