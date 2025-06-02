import { defineUserscript } from 'citlali';
import styles from './highlight-italic.module.css';

export default defineUserscript({
    name: 'Highlight Italic Texts',
    namespace: 'https://github.com/balthild/userscripts',
    version: '2024-06-02',
    author: 'Balthild',
    match: ['https://www.negationmag.com/*'],
    // runAt: 'document-idle',

    main() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_ELEMENT,
            createNodeFilter(),
        );

        let element: Element;
        while (element = walker.nextNode() as Element) {
            const style = window.getComputedStyle(element);
            if (style.fontStyle === 'italic') {
                element.classList.add(styles.highlight);
            }
        }
    },
});

function getIgnoreClasses() {
    switch (location.hostname) {
        case 'www.negationmag.com':
            return 'pull-quote';
    }
}

function createNodeFilter(): NodeFilter {
    const ignored = getIgnoreClasses().split(',').map((x) => x.trim());

    return (node: Element) => {
        if (!node.nodeName || node.nodeName.startsWith('#')) {
            return NodeFilter.FILTER_REJECT;
        }

        if (node.nodeName.toLowerCase() === 'blockquote') {
            return NodeFilter.FILTER_REJECT;
        }

        if (ignored.some((x) => node.classList.contains(x))) {
            return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
    };
}
