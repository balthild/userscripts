export function insertStyle(css: string) {
    const style = document.createElement('style');
    style.disabled = true;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    return style;
}
