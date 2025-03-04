export type getResponseResult =
| {
    status: "success";
    resData: any | undefined;
} | {
    status: "error";
    message: string;
}

export type urlSearchResult =
| {
    status: "success";
    urls: string[];
} | {
    status: "error";
    message: string;
}
export type imgSearchResult =
| {
    status: "success";
    imgs: string[];
} | {
    status: "error";
    message: string;
}