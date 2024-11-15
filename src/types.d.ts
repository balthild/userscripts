declare module '*.module.scss' {
    const cssModule: Record<string, string>;
    export = cssModule;
}

declare module 'bundle-text:*' {
    const text: string;
    export = text;
}
