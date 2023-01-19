

// add http:// if not present
export function NormalizeUrl(url: string): string {
    if (url.indexOf('http://') === 0 ||
        url.indexOf('https://') === 0) {
        return url;
    }
    return 'http://' + url;
}