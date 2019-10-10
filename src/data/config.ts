declare global {
    interface Window {
        CDN_VERSION: string;
    }
}

export const config = {
    cdn_version: window.CDN_VERSION,
    bullet_speed: 15,
    pool_width: 1625,
    pool_height: 750,
};
