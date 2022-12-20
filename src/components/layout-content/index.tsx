import { LoadingOutlined } from "@ant-design/icons";
import type { ReactNode, FC } from "react";
import { Spin } from "antd";
import "./index.less";

/**内容布局模块属性 */
interface ILayoutContentProps {
    /**是否处于加载中 */
    loading?: boolean;

    /**附加样式 */
    className?: string;

    /**失败时的友好界面 */
    fallback?: ReactNode;

    /**界面状态 */
    status?: boolean;
}

/**内容布局模块 */
const LayoutContent: FC<ILayoutContentProps> = function ({ children, loading = false, className = "", fallback = null, status = true }) {
    return (
        <section className={`M-layoutcontent ${className}`}>
            <main className={`M-layoutcontentMain${loading ? " M-layoutcontentMainLoading" : ""}`}>
                {
                    loading
                        ? <Spin indicator={<LoadingOutlined style={{ "fontSize": 34 }} spin />} />
                        : status === false && fallback
                            ? fallback
                            : children
                }
            </main>
        </section>
    )
}
export default LayoutContent;