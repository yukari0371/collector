import fs from "fs/promises";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { SocksProxyAgent } from "socks-proxy-agent";

/** Functions */
import { logger } from "./logger";

/** Types */
import {
    getResponseResult
} from "../types/collector";

process.on("uncaughtException", (e) => {
    logger.error(`Error: ${e.message}`);
});

let proxies: string[] = [];
let proxy: string;
let resData: any;

export async function getResponse(
    selectUrl: string,
    selectProxy: string,
    selectClear: string
): Promise<getResponseResult> {
    
    let useProxy: boolean = false;
    
    if (selectProxy === "y")
        useProxy = true;
    
    if (!selectUrl.startsWith("http://") && !selectUrl.startsWith("https://")) {
        return {
            status: "error",
            message: "url the invalid."
        }
    }
    
    logger.info(`Target: ${selectUrl}`);
    
    if (selectClear === "y") {
        await fs.writeFile("data/urls.txt", "", "utf-8");
        logger.info("Deleted: Contents of urls.txt");
    }
    
    if (useProxy) {
        proxies = (await fs.readFile("data/proxies.txt", "utf-8")).split("\n").filter(proxy => proxy.startsWith("http://") || proxy.startsWith("socks://"));
        if (proxies.length === 0) {
            return {
                status: "error",
                message: "proxy is missing in proxies.txt"
            }
        }
    }
    
    try {
        proxy = proxies[Math.floor(Math.random() * proxies.length)];
        resData = await axios.get(selectUrl, {
            httpsAgent: useProxy
            ? (proxy.startsWith("http://")
            ? new HttpsProxyAgent(proxy)
            : (proxy.startsWith("socks://")
                ? new SocksProxyAgent(proxy)
                : undefined))
            : undefined
        });
    
        if (resData.status !== 200) {
            return {
                status: "error",
                message: resData.statusText
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
        resData: resData.data || undefined
    }
}