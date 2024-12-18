// ==UserScript==
// @name        youtube-global-shortcut
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.0
// @author      Balthild
// @description Trigger Specific TouTube Shortcut Keys When Not Focusing the Video
// ==/UserScript==

(function () {
    'use strict';

    function replay(/** @type KeyboardEvent */ event) {
        if (!event.isTrusted) return;

        event.preventDefault();
        document.getElementById('movie_player')?.dispatchEvent(
            new KeyboardEvent(event.type, {
                code: event.code,
                isComposing: event.isComposing,
                key: event.key,
                location: event.location,
                repeat: event.repeat,
            }),
        );
    }

    window.addEventListener('keydown', replay);
    window.addEventListener('keyup', replay);
})();
