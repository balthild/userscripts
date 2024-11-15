import { Namer } from '@parcel/plugin';
import micromatch from 'micromatch';
import { basename, dirname, extname } from 'path';

export default new Namer({
    name({ bundle }) {
        const path = bundle.getMainEntry()?.filePath;
        if (!path) return;

        if (!micromatch.isMatch(path, ['**/scripts/*.user.ts', '**/styles/*.user.scss'])) {
            return;
        }

        const dir = basename(dirname(path));
        const name = basename(path, extname(path));

        return `${dir}/${name}.${bundle.type}`;
    },
});
