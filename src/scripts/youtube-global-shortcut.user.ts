import { defineUserscript } from 'citlali';

export default defineUserscript({
    name: 'YouTube Global Shortcuts',
    namespace: 'https://github.com/balthild/userscripts',
    version: '1.0',
    author: 'Balthild',
    description: 'Trigger Specific TouTube Shortcut Keys When Not Focusing the Video',
    match: ['https://www.youtube.com/*'],

    main() {
        window.addEventListener('keydown', replay);
        window.addEventListener('keyup', replay);
    },
});

function replay(event: KeyboardEvent) {
    if (!event.isTrusted || event.target !== document.body) return;
    if (event.ctrlKey || event.altKey || event.metaKey) return;

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
