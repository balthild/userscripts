import { defineUserscript } from 'citlali';

export default defineUserscript({
    name: 'YouTube Shortcuts Optimization',
    namespace: 'https://github.com/balthild/userscripts',
    version: '1.0',
    author: 'Balthild',
    description: 'Make YouTube shortcuts more ergonomic.',
    match: ['https://www.youtube.com/watch*'],

    main() {
        window.addEventListener('keydown', handleVolumeKeysGlobally);
        window.addEventListener('keyup', handleVolumeKeysGlobally);

        const progress = document.querySelector('.ytp-progress-bar');
        if (progress) {
            progress.addEventListener('keydown', handleVolumeKeysOnProgress, true);
            progress.addEventListener('keyup', handleVolumeKeysOnProgress, true);
        }
    },
});

function handleVolumeKeysGlobally(event: KeyboardEvent) {
    if (!event.isTrusted || event.target !== document.body) return;
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    if (event.code !== 'ArrowUp' && event.code !== 'ArrowDown') return;

    relocate(document.getElementById('movie_player'), event);
}

function handleVolumeKeysOnProgress(event: KeyboardEvent) {
    if (!event.isTrusted || !(event.target instanceof HTMLElement)) return;
    if (!event.target.classList.contains('ytp-progress-bar')) return;
    if (event.code !== 'ArrowUp' && event.code !== 'ArrowDown') return;

    relocate(document.getElementById('movie_player'), event);
}

function relocate(element: HTMLElement | null, event: KeyboardEvent) {
    if (!element) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();

    element.dispatchEvent(new KeyboardEvent(event.type, event));
}
