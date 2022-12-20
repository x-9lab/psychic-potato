declare namespace JSX {
    interface IntrinsicElements {
        [elem: string]: any;
    }
}

declare namespace PsychicPotato {
    /**页面路由配置 */
    interface Route<T = any, S = any> {
        /**路由地址 */
        path?: string | string[];

        /**是否精准匹配 */
        exact?: boolean;

        /**页面组件 */
        component?: T;

        /**页面标题 */
        title: string;

        /**React key */
        key: string;

        /**子页面 */
        childs?: Route<S>[];

        /**页面 icon */
        icon?: any;

        /**是否是隐藏页面 */
        hide?: boolean;

        /**访问权限 */
        role?: string;

        /**页面排序，用于调整左侧菜单显示位置 */
        index?: number;

        /**是否不需要鉴权 */
        noAuth?: boolean;

        /**支持平台类型 */
        type?: "app" | "web" | "all";

        /**是否是首页 */
        isIndex?: boolean;
    }

    /**路由对象 */
    type RouteLocation = {
        hash: string;
        key: string;
        pathname: string;
        search: string;
        state: any;
    }
}
