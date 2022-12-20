import { isExecutable, delay, isString, isAsyncFunction, isNumber } from "@x-drive/utils";
import type { Logger } from "@x-drive/logger";
import getLogger from "@x-drive/logger";

const SysLogger = getLogger(
    `G-temple(v1.1.1)`
);
export { SysLogger as Logger }

/**Helper Logger */
const HelperLogger = SysLogger.getLogger("Helper");

function checkIsCbFunction(fn: unknown) {
    return isExecutable(fn);
}
export { checkIsCbFunction }

const DDE = document.documentElement;
const DB = document.body;

var scrolling = false;
function doScrollToTop() {
    const top = DDE.scrollTop || DB.scrollTop;
    if (top > 0) {
        window.requestAnimationFrame(doScrollToTop);
        window.scrollTo(0, Math.max(0, top - top / 10));
    } else {
        scrolling = false;
    }
}

/**滚动到顶部 */
function scrollToTop() {
    if (scrolling) {
        return;
    }
    scrolling = true;
    doScrollToTop();
}
export { scrollToTop };

/**添加页面可操作后的处理逻辑 */
function ready() {
    return new Promise<Boolean>((resolve, reject) => {
        var status = false;

        var onDOMLoaded = () => {
            if (status) {
                return;
            }
            status = true;

            // 移除各load监听器
            window.document.removeEventListener("DOMContentLoaded", onDOMLoaded);
            window.removeEventListener("load", onDOMLoaded);

            beReady = null;
            onDOMLoaded = null;

            // 调用ready执行监听ready的函数
            setTimeout(function () {
                resolve(true);
            }, 50);
        }

        var beReady = () => {
            // 防止在绑定 document 的 ready 事件监听之前 document 已经触发 ready 事件
            // 文档已经完全加载的时候直接执行
            if (window.document.readyState === "complete") {
                return delay(onDOMLoaded, 1);
            }

            // 还在加载则进行监听
            // 标准浏览器支持此方法
            window.document.addEventListener("DOMContentLoaded", onDOMLoaded);

            // 保险方法：监听win的load事件，这个事件任何情况下都能正常工作
            window.addEventListener("load", onDOMLoaded);
        }

        beReady();

        setTimeout(() => {
            reject(new Error("Wait for ready timeout"));
        }, 5000)
    });
}
export { ready }

/**首字大写 */
function upCaseFirstChar(str: string) {
    if (!isString(str) || !str) {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export { upCaseFirstChar }

/**
 * 自动捕获 class 模块异常
 * @param logger 模块日志模块
 */
function catcher(logger?: Logger) {
    return function classExceptionCatcher(target: Object, name: string, descriptor: PropertyDescriptor) {
        const originFn = descriptor.value;
        const targetName = target.constructor.name;
        descriptor.value = async function (...rest: any[]) {
            try {
                if (isAsyncFunction(originFn)) {
                    return await originFn.apply(this, rest);
                } else {
                    return originFn.apply(this, rest);
                }
            } catch (e) {
                if (logger) {
                    logger.at(name).error(e);
                } else {
                    HelperLogger.at("catcher").at(targetName).at(name).error(e);
                }
            }
        }
        return descriptor;
    }
}

export { catcher }

function fixFloat0(num: number, size: number) {
    let str = String(num);
    if (isNumber(num) && str.indexOf(".") !== -1) {
        let parts = str.split(".");
        while (parts[1].length < size) {
            parts[1] = parts[1] + "0";
        }
        return parts.join(".");
    }
    str = null;
    return num;
}

export { fixFloat0 }