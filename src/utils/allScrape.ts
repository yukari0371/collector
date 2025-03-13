/** Functions */
import { getResponse } from "./getResponse";
import { urlSearch } from "./urlSearch";
import { imgSearch } from "./imgSearch";
import { logger } from "./logger";

/** Types */
import {
    allScrapeResult
} from "../types/collector";

export async function allScrape(
    type: string,
    urls: string[]
): Promise<allScrapeResult> {
    return new Promise(async (resolve) => {
        const links: string[] = [];

        switch (type) {
            case "url":
                for (const url of urls) {
                    const result = await getResponse(url, "n", "n");
                    if (result.status === "error") {
                        logger.error(result.message);
                    } else {
                        const _result = await urlSearch(result.resData);
                        if (_result.status === "error") {
                            logger.error(_result.message);
                        } else {

                            _result.urls.map(url => {
                                if (links.includes(url)) return;
                                links.push(url);
                            });

                        }
                    }
                }
            break;
            case "img":
                for (const url of urls) {
                    const result = await getResponse(url, "n", "n");
                    if (result.status === "error") {
                        return logger.error(result.message);
                    } else {
                        const _result = await imgSearch(url, result.resData);
                        if (_result.status === "error") {
                            return logger.error(_result.message);
                        } else {
                            // mada
                        }
                    }
                }
            break;
            default:
                return resolve({
                    status: "error",
                    message: "The only options are 0 or 1."
                });
        }

        if (Array.from(links).length === 0) {
            return resolve({
                status: "error",
                message: "Could not find url."
            });
        }

        resolve({
            status: "success",
            links: links
        });
    });
}
