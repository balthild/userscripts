import styles from './control.module.scss';

import { createEffect, createSignal, JSX, onCleanup, onMount, Show } from 'solid-js';

import IconAdd from './icons/add.svg';
import IconClose from './icons/close.svg';
import IconMinus from './icons/minus.svg';

interface StyleControlProps {
    isArticlePage: boolean;
}

export function StyleControl(props: StyleControlProps) {
    const [open, setOpen] = createSignal(false);

    const [pageStatus, setPageStatus] = useSetting(`page-status:${location.pathname}`, String, 'auto', 'auto');
    createEffect(() => {
        const style = document.getElementById('global-style') as HTMLStyleElement;
        if (pageStatus() === 'auto') {
            style.disabled = !props.isArticlePage;
        } else {
            style.disabled = pageStatus() === 'disabled';
        }
    });

    const setStyleProperty = (name: string, value: string) => {
        document.documentElement.style.setProperty(name, value);
    };

    const [fontFamily, setFontFamily] = useSetting('font-family', String, 'sans', 'sans');
    createEffect(() => setStyleProperty('--font-family', `var(--font-${fontFamily()})`));

    const [fontCustom, setFontCustom] = useSetting('font-custom', String, `'方正悠宋 GBK 508R', serif`, '');
    createEffect(() => setStyleProperty('--font-custom', fontCustom()));

    const [fontSize, setFontSize] = useSetting('font-size', Number, 20);
    createEffect(() => setStyleProperty('--font-size', `${fontSize()}px`));

    const [textWidth, setTextWidth] = useSetting('text-width', Number, 32);
    createEffect(() => setStyleProperty('--text-width', `${textWidth()}em`));

    const onInput = (setValue: any, event: InputEvent) => {
        const target = event.target as HTMLInputElement;
        setValue(target.value);
    };

    const entry = <div class={[styles.addon, styles.entry].join(' ')} onClick={[setOpen, true]}>Aa</div>;

    return (
        <div class={styles.control}>
            <Show when={open()} fallback={entry}>
                <div class={[styles.addon, styles.panel].join(' ')}>
                    <div class={styles.title}>
                        <span class={styles.text}>阅读设置</span>
                        <div class={styles.close} onClick={[setOpen, false]}>
                            <IconClose />
                        </div>
                    </div>

                    <div class={styles.tabs}>
                        <TabItem signal={[pageStatus, setPageStatus]} value='auto'>自动判断</TabItem>
                        <TabItem signal={[pageStatus, setPageStatus]} value='enabled'>本页启用</TabItem>
                        <TabItem signal={[pageStatus, setPageStatus]} value='disabled'>本页禁用</TabItem>
                    </div>

                    <div class={styles.tabs}>
                        <TabItem signal={[fontFamily, setFontFamily]} value='serif'>思源宋体</TabItem>
                        <TabItem signal={[fontFamily, setFontFamily]} value='sans'>思源黑体</TabItem>
                        <TabItem signal={[fontFamily, setFontFamily]} value='custom'>自定义</TabItem>
                        <div class={styles.custom} v-show="fontFamily === 'custom'">
                            <input type='text' value={fontCustom()} onInput={[onInput, setFontCustom]} />
                        </div>
                    </div>

                    <div class={styles.spinbox}>
                        <span class={styles.label}>文字大小</span>
                        <span class={styles.value}>{fontSize()}</span>
                        <div class={styles.action} onClick={() => setFontSize((prev) => prev - 1)}>
                            <IconMinus />
                        </div>
                        <div class={styles.action} onClick={() => setFontSize((prev) => prev + 1)}>
                            <IconAdd />
                        </div>
                    </div>

                    <div class={styles.spinbox}>
                        <span class={styles.label}>版心宽度</span>
                        <span class={styles.value}>{textWidth()}</span>
                        <div class={styles.action} onClick={() => setTextWidth((prev) => prev - 1)}>
                            <IconMinus />
                        </div>
                        <div class={styles.action} onClick={() => setTextWidth((prev) => prev + 1)}>
                            <IconAdd />
                        </div>
                    </div>
                </div>
            </Show>
        </div>
    );
}

interface TabItemProps {
    signal: [() => string, (v: string) => void];
    value: string;
    children: string;
}

function TabItem(props: TabItemProps) {
    const [state, setState] = props.signal;

    return (
        <div
            class={styles.tab}
            classList={{ [styles.current]: state() === props.value }}
            onClick={() => setState(props.value)}
        >
            {props.children}
        </div>
    );
}

function useSetting<T = any>(key: string, convert: (v: any) => T, defVal: T, rmVal?: T) {
    const [value, setValue] = createSignal<T>(
        convert(localStorage.getItem(key) ?? defVal),
    );

    const updateValue = (setter: T | ((prev: T) => T)) => {
        const next = setValue(setter as any);
        if (next === rmVal) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, next as any);
        }
        return next;
    };

    const pullSettings = (event: StorageEvent) => {
        if (event.storageArea === localStorage && event.key === key) {
            setValue(convert(event.newValue ?? defVal) as any);
        }
    };

    onMount(() => {
        window.addEventListener('storage', pullSettings);
    });

    onCleanup(() => {
        window.removeEventListener('storage', pullSettings);
    });

    return [value, updateValue] as const;
}
