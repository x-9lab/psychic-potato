/**登录态字段名 */
export const X_LAB_SESSION = "xlab_session";

let location = window?.location || { "pathname": "" };
let basePart = location.pathname.replace("/", "").split("/");

/**路由 base */
export const BASE = `/${basePart[0]}`;

basePart = null;
location = null;

/**不需要登录检测的页面 */
export const NO_AUTH = {
    [`${BASE}/login`]: true
}

export const BUILD_TARGET = "web";
