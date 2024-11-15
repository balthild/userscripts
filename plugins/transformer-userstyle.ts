import { Transformer } from '@parcel/plugin';
import { TransformerResult } from '@parcel/types';
import { extractSections } from './stylus/moz-parser';

export default new Transformer({
    async transform({ asset }) {
        const { sections, errors } = extractSections({
            code: await asset.getCode(),
            styleId: asset.id as any,
        });

        if (errors.length) {
            throw errors[0];
        }

        let parts: TransformerResult[] = [];
        for (const [index, section] of sections.entries()) {
            if (!section.urls && !section.urlPrefixes && !section.domains && !section.regexps) {
                continue;
            }

            const specifier = `${asset.id}:${section.start}`;
            asset.addDependency({ specifier, specifierType: 'esm' });

            parts.push({
                uniqueKey: specifier,
                type: 'scss',
                content: section.code,
                bundleBehavior: 'inline',
                isBundleSplittable: false,
                meta: {
                    userstyle: index,
                },
            });
        }

        asset.meta.userstyle = { sections };
        asset.type = 'css';

        return [asset, ...parts];
    },
});
