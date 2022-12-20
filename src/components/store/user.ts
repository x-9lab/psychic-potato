import { X_USER_CACHE, X_USER_CACHE_PREFIX } from "@consts/cache";
import Request from "@components/request";
import { isArray } from "@x-drive/utils";
import Cache from "@x-drive/cache";

/**系统存储 */
const UserStore = new Cache({
    "type": 2
    , "prefix": X_USER_CACHE_PREFIX
});

type UserData = {
    authority: string[];
};

type UserResData = Array<{ authority: string }>;

export const check = async function () {
    var userData = get();
    if (userData) {
        return userData;
    }
    const userResData = await Request.get<UserResData>(
        "/getUser"
        , {}
        , { "autoToast": false }
    );

    if (isArray(userResData)) {
        UserStore.set(
            X_USER_CACHE
            , userResData
        );
        return get();
    } else {
        return null;
    }
}

/**获取用户数据 */
export const get = function () {
    return UserStore.get(X_USER_CACHE) as UserData;
}

/**设置用户数据 */
export const set = function (data: UserData) {
    UserStore.set(X_USER_CACHE, data);
}

/**删除用户数据 */
export const del = function () {
    UserStore.del(X_USER_CACHE);
}