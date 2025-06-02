import { defineUserscript } from 'citlali';
import styles from './twitter-video-speed.module.css';

export default defineUserscript({
    name: 'Twitter Video Speed Shortcuts',
    namespace: 'https://github.com/balthild/userscripts',
    version: '1.0',
    author: 'Balthild',
    description: 'Twitter 视频速度调整快捷键（小于号、大于号）',
    match: ['https://x.com/*', 'https://twitter.com/*'],

    main() {
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
    },
});

const config = {
    delta: 0.25,
    min: 1,
    max: 2.5,
} as const;

function isPlaying(video: HTMLVideoElement) {
    return video.currentTime > 0 && !video.paused && !video.ended;
}

function updateSpeed(video: HTMLVideoElement, sign: 1 | -1) {
    let speed = video.playbackRate + config.delta * sign;
    if (speed > config.max) speed = config.max;
    if (speed < config.min) speed = config.min;

    video.playbackRate = speed;

    showMessage(video, `${speed}x`);
}

let timeout: any = undefined;
function showMessage(video: HTMLVideoElement, text: string) {
    if (timeout !== undefined) {
        clearTimeout(timeout);
    }

    const rect = video.getBoundingClientRect();
    const left = rect.left + rect.width / 2 - 40;
    const top = rect.top + window.scrollY + 32;

    const message = initMessageElement();
    message.textContent = text;
    message.style.left = `${left}px`;
    message.style.top = `${top}px`;
    message.style.display = 'block';

    timeout = setTimeout(() => {
        message.style.display = 'none';
        timeout = undefined;
    }, 1500);
}

function initMessageElement() {
    let message = document.getElementById(styles.message);
    if (!message) {
        message = document.createElement('div');
        message.id = styles.message;
        document.body.appendChild(message);
    }

    return message;
}
