/** Functions */

import fsp from "fs/promises";
import fs from "fs";
import { logger } from "./utils/logger";
import { prompt } from "./utils/prompt";
import { sleep } from "./utils/sleep";
import { getResponse } from "./utils/getResponse";
import { urlSearch } from "./utils/urlSearch";
import { imgSearch } from "./utils/imgSearch";
import { imgSearch2 } from "./utils/imgSearch2";
import { allScrape } from "./utils/allScrape";

process.on("uncaughtException", (e) => {
    return logger.error(`Error: ${e.message}`);
});

const files = [
    "data/urls.txt",
    "data/imgs.txt"
];

(async() => {
    
    console.log(menu());
    let selectUrl = await prompt("targetUrl");
    const selectProxy = await prompt("useProxy[y or anyKey]");
    const selectClear = await prompt("clear[y or anyKey]");

    if (selectUrl.endsWith("/")) {
        selectUrl = selectUrl.slice(0, -1);
    }

    const result = await getResponse(selectUrl, selectProxy, selectClear);
    if (result.status === "error") {
        return logger.error(result.message);
    }
    
    const resData = result.resData;

    while (true) {
        console.clear();
        console.log(menu());
        const select = await prompt("select");

        switch (select) {
            case "1":
                const result = await urlSearch(resData);

                if (result.status === "error") {
                    logger.error(result.message);
                    await exit();
                    break;
                }
                await appendFile(files[0], result.urls);
                await exit();
            break;

            case "2":
                const _result = await imgSearch(selectUrl, resData);
                if (_result.status === "error") {
                    logger.error(_result.message);
                    await exit();
                    break;
                }
                await appendFile(files[1], _result.imgs);
                await exit();
            break;

            case "3":
                const __result = await imgSearch2(selectUrl, resData);
                if (__result.status === "error") {
                    logger.error(__result.message);
                    await exit();
                    break;
                }
                await appendFile(files[1], __result.imgs);
                await exit();
            break;

            case "4":
                const urls = fs.readFileSync(files[0], "utf-8").split("\n");
                console.log(urls);
                let type = await prompt("selectType[url or img]");

                while (true) {
                if ((type === "url" || "img")) break;
                logger.error("The only options are url or img.");
                await sleep(1500);
                continue;
                }

                const ___result = await allScrape(type, urls);
                if (___result.status === "error") {
                    logger.error(___result.message);
                    await exit();
                    break;
                }
                await appendFile(files[0], ___result.links);
                await exit();
            break;

            default:
                logger.error("The selection was invalid.");
                await exit();
                continue;
        }
    }

})();

function menu() {
    return `
╭──────────────────────────────────────────────╮
│ 1 url                                        │
│ 2 hrefImage                                  │
│ 3 allImage                                   │
│ 4 Scrape everything in urls.txt              │
╰──────────────────────────────────────────────╯
    `;
};

async function exit() {
    let bool = true;
    while (bool) {
        const select = await prompt("exitSelect");
        switch (select) {
            case "0":
                bool = false;
            break;
            case "1":
                const del = await prompt("Delete all the contents of the file[y or anyKey]");
                if (del === "y") files.map(file => fs.unlinkSync(file));
                process.exit(0);
            default:
                logger.error("The only options are 0 or 1.");
                await sleep(1500);
                continue;
        }
    }
};

async function appendFile(filePath: string, strs: string[]) {
    try {
        if (!fs.existsSync(filePath)) {
            return logger.error("The specified path was not found.");
        }
        if (strs.length === 1) {
            fs.appendFileSync(filePath, `${strs}\n`, "utf-8");
            return logger.info(`Saved: ${filePath}`);
        }
        for (const str of strs) {
            fs.appendFileSync(filePath, `${str}\n`, "utf-8");
        }
        logger.info(`Saved: ${filePath}`);
    } catch (e) {
        if (e instanceof Error) {
            return logger.error(e.message);
        }
    }
}
