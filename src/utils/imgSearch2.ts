/** Types */
import {
    imgSearchResult
} from "../types/collector";

const extensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".svg",
    ".webp",
    ".bmp",
    ".tiff",
    ".eps",
    ".psd",
    ".HEIC"
];

export async function imgSearch2(targetUrl: string, resData: any): Promise<imgSearchResult> {
    return new Promise(async (resolve) => {
        const imgs: string[] = [];

        try {
            const imgs: string[] = [];
            const IMG_REGEX = new RegExp(`https?://[^\\s]+\\.(${extensions.map(ext => ext.replace('.', '')).join('|')})$`, 'gim');
            const lines = resData.split("\n");
    
            for (const line of lines) {
                const match = line.match(IMG_REGEX);
                if (match) {
                    imgs.push(...match);
                }
            }
    
            if (imgs.length === 0) {
                return resolve({
                    status: "error",
                    message: "Could not find image."
                });
            }
        } catch (e) {
            if (e instanceof Error) {
                return resolve({
                    status: "error",
                    message: e.message
                });
            }
        }
        resolve({
            status: "success",
            imgs: imgs
        });
    });
}
