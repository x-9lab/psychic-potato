import { X_VIEWER_CACHE_PREFIX } from "@consts/cache";
import Cache from "@x-drive/cache";

/**系统存储 */
const ViewerStore = new Cache({
    "type": 1
    , "prefix": X_VIEWER_CACHE_PREFIX
});

export default ViewerStore;