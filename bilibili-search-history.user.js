// ==UserScript==
// @name         Bilibili search history
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const $$ = (sel) => document.querySelectorAll(sel);
    const $ = (sel) => document.querySelector(sel);

    $('.nav-search-keyword').addEventListener('keydown', (e) => {
        if (e.code === 'Enter') {
            var inputEvent = new Event('input', {
                bubbles: true,
                cancelable: true,
            });

            e.target.dispatchEvent(inputEvent);

            return;
        }

        if (e.code !== 'ArrowUp' && e.code !== 'ArrowDown') return;
        if ($$('.history-item').length === 0) return;

        const active = $('.history-item.active');
        let newActive;

        if (active) {
            if (e.code === 'ArrowUp') {
                // newActive = active.previousElementSibling || $('.history-item:last-child');
                newActive = active.previousElementSibling;
            } else {
                // newActive = active.nextElementSibling || $('.history-item:first-child');
                newActive = active.nextElementSibling;
            }

            if (newActive) {
                active.classList.remove('active');
            } else {
                return;
            }
        } else {
            newActive = $('.history-item:first-child');
        }

        newActive.classList.add('active');

        e.target.value = newActive.querySelector('.history-text').innerText;
    });
})();
