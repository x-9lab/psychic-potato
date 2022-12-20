import { X_CACHE_PREFIX, X_LANG_CACHE_PREFIX } from "@/consts/cache";
import { upCaseFirstChar } from "@components/helper";
import { X_LANG_TYPE_KEY } from "@/consts/lang";
import Logger from "@components/logger";
import Cache from "@x-drive/cache";
import { isNull } from "@x-drive/utils";

/**系统语言包存储 */
const LangStore = new Cache({
    "type": 0
    , "prefix": X_LANG_CACHE_PREFIX
});

/**本地持久化系统存储 */
const LoSysStore = new Cache({
    "type": 0
    , "prefix": X_CACHE_PREFIX
});


type ILang = Record<string, string>;

const LangLogger = Logger.getLogger("Translate");

/**当前语言类型 */
var langType: string;

/**当前语言包 */
var lang: ILang = {};

/**默认语言 */
const DEF_LANG = "cn";

/**初始化语言数据 */
function init() {
    langType = LoSysStore.get(X_LANG_TYPE_KEY);
    lang = LangStore.get<Record<string, string>>(langType);
    if (langType !== DEF_LANG) {
        if (isNull(langType)) {
            langType = DEF_LANG;
        }
        let targetLang = {};
        const targetFile = `${langType}.ts`;

        const i18nFiles = import.meta.glob<{ default: any }>("../../i18n/*.ts", { "eager": true });
        for (let n in i18nFiles) {
            if (n.endsWith(targetFile)) {
                let langData = i18nFiles[n];
                if (langData.default) {
                    langData = langData.default
                }
                targetLang = langData;
                break;
            }
        }

        lang = targetLang;
        LangStore.set(langType, targetLang);
    }

    if (!lang) {
        lang = {};
    }

    LangLogger.info("Now type: ", langType || DEF_LANG);
}

export { init }

/**切换语言 */
function switchLang(type: string) {
    if (type !== langType) {
        langType = type;
        LoSysStore.set(X_LANG_TYPE_KEY, type);
        setTimeout(() => {
            window.location.reload();
        }, 100);
    }
}
export { switchLang }

/**多语言支持 */
function translate(str: string, upcaseFirst: boolean = false) {
    if (lang[str]) {
        if (upcaseFirst) {
            return upCaseFirstChar(lang[str]);
        }
        return lang[str];
    }
    return str;
}

export default translate;
