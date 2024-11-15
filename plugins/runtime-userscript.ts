import { Runtime } from '@parcel/plugin';
import micromatch from 'micromatch';

export default new Runtime({
    async apply({ bundle, bundleGraph }) {
        if (!micromatch.isMatch(bundle.displayName, 'scripts/*.user.js')) {
            return;
        }

        const deps = bundleGraph.getReferencedBundles(bundle);
        for (const dep of deps) {
            if (!micromatch.isMatch(dep.displayName, 'scripts/*.user.css')) {
                continue;
            }

            console.log(dep.displayName, dep.id, dep.publicId, '\n\n');
        }
    },
});
