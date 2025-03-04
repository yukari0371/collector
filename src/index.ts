/** Functions */
import { logger } from "./utils/logger";
import { prompt } from "./utils/prompt";
import { sleep } from "./utils/sleep";
import { getResponse } from "./utils/getResponse";
import { urlSearch } from "./utils/urlSearch";
import { imgSearch } from "./utils/imgSearch";

process.on("uncaughtException", (e) => {
    logger.error(`Error: ${e.message}`);
});

(async() => {
    menu();
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
        await sleep(6000);
        console.clear();
        menu();
        const select = await prompt("select> ");

        switch (select) {
            case "1":
                const result = await urlSearch(resData);
                if (result.status === "error") {
                    logger.error(result.message);
                    break; 
                }
                console.log(result.urls);
            break;
            case "2":
                const _result = await imgSearch(selectUrl, resData);
                if (_result.status === "error") {
                    logger.error(_result.message);
                    break;
                }
                console.log(_result.imgs);
                await sleep(100000000000000);
            default:
                logger.error("The selection was invalid.");
                break;
        }
    }

})();

function menu() {
    console.log(`
╭──────────────────────────────────────────────╮
│ 1 urlSearcher                                │
│ 2 imageSearcher                              │
╰──────────────────────────────────────────────╯
`);
}