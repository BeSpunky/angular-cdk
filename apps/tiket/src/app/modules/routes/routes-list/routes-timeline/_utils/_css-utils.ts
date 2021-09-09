export function formatPxCssSize(size: number | string): string
{
    return typeof size === 'string' ? size : `${ size }px`;
}