import * as cheerio from "cheerio";

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
]

export async function imgSearch(targetUrl: string, resData: any): Promise<imgSearchResult> {
    const imgs: string[] = [];

    try {
        const $ = cheerio.load(resData);
        const src = $("img").map((_, element) => $(element).attr("src")).get();
        let validImgs = src.filter(src => extensions.some(extension => src.endsWith(extension)));
        validImgs.map((img, index) => {
            if (img.startsWith("/")) {
                validImgs[index] = `${targetUrl}${img}`;
            }
        });

        imgs.push(...validImgs);

        if (imgs.length === 0) {
            return {
                status: "error",
                message: "Could not find image."
            }
        }
    } catch (e) {
        if (e instanceof Error) {
            return {
                status: "error",
                message: e.message
            }
        }
    }
    return {
        status: "success",
        imgs: imgs
    }
}