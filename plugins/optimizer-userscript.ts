import { Optimizer } from '@parcel/plugin';
import micromatch from 'micromatch';

export default new Optimizer({
    async optimize({ bundle, contents }) {
        if (!micromatch.isMatch(bundle.displayName, 'scripts/*.user.js')) {
            return { contents };
        }

        contents = contents.toString();

        let open = -1;
        let close = -1;
        let pos = 0;
        for (const line of contents.split('\n')) {
            const len = line.length + 1;

            switch (line.trim()) {
                case '// ==UserScript==':
                    open = pos;
                    break;
                case '// ==/UserScript==':
                    close = pos + len;
                    break;
            }

            pos += len;
        }

        if (open === -1 || close === -1) {
            throw new Error('Metadata not found for userscript');
        }

        const segments = [
            contents.slice(open, close),
            '\n',
            contents.slice(0, open),
            contents.slice(close),
        ];

        return { contents: segments.join('') };
    },
});
