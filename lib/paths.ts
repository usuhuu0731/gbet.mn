// Injected by the Vite build for the selected GitHub repository.
declare const __GBET_BASE_PATH__: string;
declare const __GBET_SITE_ORIGIN__: string;
export const basePath = __GBET_BASE_PATH__;
export const publicOrigin = __GBET_SITE_ORIGIN__;
export const asset = (path: string) => basePath + path;
