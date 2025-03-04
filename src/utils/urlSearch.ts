import * as cheerio from "cheerio";

/** Types */
import {
    urlSearchResult
} from "../types/collector"

export async function urlSearch(response: any): Promise<urlSearchResult> {
    const urls: string[] = [];

    try {
        const $ = cheerio.load(response);

        const links = $("a").map((_, element) => $(element).attr("href")).get();
        const validUrls = links.filter(link => link.startsWith("https://") || link.startsWith("http://"));

        if (validUrls.length === 0) {
            return {
                status: "error",
                message: "Could not find url."
            };
        }
        
        urls.push(...validUrls);
    } catch (e) {
        if (e instanceof Error) {
            return {
                status: "error",
                message: e.message
            };
        }
    }
    return {
        status: "success",
        urls: urls
    };
}