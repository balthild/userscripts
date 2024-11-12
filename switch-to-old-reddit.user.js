// ==UserScript==
// @name        Switch to old.reddit.com
// @namespace   Violentmonkey Scripts
// @match       *://www.reddit.com/*
// @version     1.0
// @author      -
// @description 2024/4/28 14:15:46
// ==/UserScript==

(function () {
    'use strict';

    const link = document.createElement('a');
    link.textContent = 'Switch to old.reddit.com';
    link.className = 'w-full button button-medium button-secondary mt-md';
    link.addEventListener('click', () => {
        location.host = 'old.reddit.com';
    });

    function insertLink() {
        requestIdleCallback(() => {
            const sidebar = document.querySelector('#right-sidebar-container');
            if (sidebar) {
                sidebar.prepend(link);
            }
        });
    }

    insertLink();

    window.navigation.addEventListener('navigatesuccess', insertLink);
})();
