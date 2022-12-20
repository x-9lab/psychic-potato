import { init as initLang } from "@components/translate";
import { BrowserRouter as Router } from "react-router-dom";
import { user as userStore } from "@components/store";
import { createRoot } from "react-dom/client";
import { NO_AUTH } from "@consts/system";
import Logger from "./components/logger";
import zhCN from "antd/es/locale/zh_CN";
import { ConfigProvider } from "antd";
import "antd/lib/style/index.less";
import Layout from "./layout";
import "./index.less";

(async () => {
    initLang();
    const container = document.getElementById("PSYCHIC_POTATO_ROOT");
    if (!container) {
        Logger.error("找不到主要挂载节点,请检查挂载 id 是否与 HTML 上的一致");
        return;
    }
    const root = createRoot(container!);
    root.render(
        <ConfigProvider locale={zhCN}>
            <Router>
                <Layout></Layout>
            </Router >
        </ConfigProvider>
    );
    Logger.info("System online");
    try {
        // 如果追求体验的流畅性，应该是先检查
        // 但由于目前界面相关的退出逻辑是写在 layout 上的，因此暂时放在后面
        if (!NO_AUTH[window.location.pathname]) {
            await userStore.check();
        }
    } catch (e) {
        console.log(e);
    }
})();
