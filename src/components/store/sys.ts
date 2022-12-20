import { X_CACHE_PREFIX } from "@consts/cache";
import Cache from "@x-drive/cache";

/**系统存储 */
const SysStore = new Cache({
    "type": 1
    , "prefix": X_CACHE_PREFIX
});

export default SysStore;