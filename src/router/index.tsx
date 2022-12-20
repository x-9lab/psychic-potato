import { isNumber, isString, isUndefined } from "@x-drive/utils";
import { BUILD_TARGET } from "@consts/system";
import { MAGIC_CODE } from "@consts/magic";
import Test from "./@route/for-test";
import Def from "./@route/def";

const RealRouterPath = new Map<string | string[], string | string[]>();
const RealRouterPathWithKey = new Map<string, string | string[]>();

var originRouters = [
    ...Def
    , ...Test
];

const Routers: PsychicPotato.Route<any, any>[] = originRouters.filter(item => {
    if (item.path && !RealRouterPath.has(item.path)) {
        RealRouterPath.set(item.path, item.path);
        RealRouterPathWithKey.set(item.key, item.path);
    }
    if (item.type === "all") {
        return true;
    }
    return item.type === BUILD_TARGET;
});

originRouters = null;

Routers.sort((now, next) => {
    const nowVal = isNumber(now.index) ? now.index : MAGIC_CODE;
    const nextVal = isNumber(next.index) ? next.index : MAGIC_CODE;
    return nowVal - nextVal;
});

export default Routers;

/**更新路由基础地址 */
function updateRoutersBasePath(base: string) {
    if (isString(base) && Routers?.length) {
        if (!base.startsWith("/")) {
            base = `/${base}`;
        }
        Routers.forEach(router => {
            const routerPath = router.path;
            const routerPath4Test = isString(routerPath) ? routerPath as string : routerPath[0];
            if (routerPath && !routerPath4Test.startsWith(base)) {
                const oldPath = router.path;
                const newPath = `${base}${router.path}`;
                router.path = newPath;
                RealRouterPath.set(oldPath, newPath);
                RealRouterPathWithKey.set(router.key, newPath);
            }
        });
    }
}
export { updateRoutersBasePath };

/**
 * 获取当前真正的路由地址
 * @param path  待处理地址
 * @param noDef 是否在找不到的时候不返回原来的地址
 */
function getRouterPath(path: string, noDef?: boolean): string
/**
 * 获取当前真正的路由地址
 * @param path  待处理地址
 * @param noDef 是否在找不到的时候不返回原来的地址
 */
function getRouterPath(path: string[], noDef?: boolean): string
/**
 * 获取当前真正的路由地址
 * @param path  待处理地址
 * @param noDef 是否在找不到的时候不返回原来的地址
 */
function getRouterPath(path: any, noDef?: boolean): string {
    if (RealRouterPath.has(path)) {
        return RealRouterPath.get(path) as string;
    }
    if (noDef) {
        return null;
    }
    return path;
}

export { getRouterPath };

/**地址上的参数获取正则 */
const PARAMS_IN_PATH_REGEXP = /\/:([\w\s]+)/g;

/**生成带有参数的地址 */
function genPathWithParam(path: string, params: Record<string, any>) {
    if (isString(path)) {
        let realPath = getRouterPath(path, true);
        if (!realPath && RealRouterPathWithKey.has(path)) {
            realPath = RealRouterPathWithKey.get(path) as string;
        }
        if (!realPath) {
            realPath = path;
        }
        return realPath.replace(PARAMS_IN_PATH_REGEXP, (m, k) => {
            if (!isUndefined(params[k])) {
                return `/${params[k]}`;
            }
            return m;
        });
    }
    return path;
}

export { genPathWithParam }
