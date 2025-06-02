import { defineUserscript } from 'citlali';
import styles from './in-page-fullscreen.module.scss';

export default defineUserscript({
    name: 'In-Page Fullscreen',
    namespace: 'https://github.com/balthild/userscripts',
    version: '2024-08-27',
    description: 'try to take over the world!',
    author: 'Balthild',
    match: ['*://*/*'],
    grant: ['none'],

    async main() {
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
        const selector = getSelector();
        if (!selector) {
            return;
        }

        document.body.dataset['fullscreen-host'] = location.host;

        let element = document.querySelector(selector);
        while (!element) {
            await new Promise((r) => setTimeout(r, 1000));
            element = document.querySelector(selector);
        }

        element.classList.add(styles.target);

        window.addEventListener('message', (message) => {
            if (element instanceof HTMLIFrameElement === false) {
                return;
            }

            if (message.source !== element.contentWindow) {
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
    },
});

function getSelector() {
    switch (location.host) {
        case 'www.7xi.tv':
        case 'www.tbdm1.com':
            return '#playleft iframe';

        case 'www.iyf.tv':
            return '#main-player';

        case 'canvas.illinoisstate.edu':
        case 'illinoisstate.instructure.com':
            return '#doc_preview iframe';
    }
}

function toggle() {
    document.body.classList.toggle(styles.fullscreen);
}

function exit() {
    document.body.classList.remove(styles.fullscreen);
}
