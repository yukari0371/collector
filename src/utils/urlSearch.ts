import fs from "fs";
import * as cheerio from "cheerio";

/** Types */
import {
    urlSearchResult
} from "../types/collector"

export async function urlSearch(response: any): Promise<urlSearchResult> {
    return new Promise(async (resolve) => {
        const urls: string[] = [];

        try {
            const $ = cheerio.load(response);
    
            const links = $("a").map((_, element) => $(element).attr("href")).get();
            const validUrls = links.filter(link => link.startsWith("https://") || link.startsWith("http://"));
    
            if (validUrls.length === 0) {
                return resolve({
                    status: "error",
                    message: "Could not find url."
                });
            }
            
            validUrls.map(url => {
                if (urls.includes(url)) return;
                urls.push(url);
            });

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
            urls: urls
        });
    });
}
