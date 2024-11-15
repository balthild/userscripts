import { Packager } from '@parcel/plugin';
import { MozDocMapper } from './stylus/section-util';

export default new Packager({
    async package({ bundle, bundleGraph }) {
        const asset = bundle.getMainEntry()!;
        const style = asset.meta.userstyle as any;

        const deps = bundleGraph.getReferencedBundles(bundle, {
            includeInline: true,
        });

        for (const dep of deps) {
            const asset = dep.getMainEntry()!;
            const index = asset.meta.userstyle as number;
            style.sections[index].code = await asset.getCode();
        }

        const contents = MozDocMapper.styleToCss(style);

        return { contents };
    },
});
