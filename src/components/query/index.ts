import { parseStr } from "@x-drive/utils";

function getQuery(search: string) {
    search = search || window.location.search;
    return search
        ? parseStr(
            search.replace("?", "")
        )
        : {};
}

export { getQuery }