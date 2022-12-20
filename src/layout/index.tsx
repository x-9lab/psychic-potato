// @ts-nocheck
import { UserOutlined, DownOutlined, PoweroffOutlined/**, ThunderboltOutlined, SettingOutlined, HistoryOutlined, HeartOutlined */ } from "@ant-design/icons";
import { LAYOUT_SET_TITLE, LAYOUT_TOGGLE_MENU, LAYOUT_TOGGLE_DISPLAY, LAYOUT_LOGOUT } from "@consts/events";
import { isBoolean, isString, cookie } from "@x-drive/utils";
import type { RouteComponentProps } from "react-router-dom";
import { NO_AUTH, X_LAB_SESSION } from "@consts/system";
import AnimationRouter from "./mods/animation-router";
import { user as userStore } from "@components/store";
import eventcenter from "@x-drive/event-center";
import { Layout, Dropdown, Space } from "antd";
import { withRouter } from "react-router-dom";
import Request from "@components/request";
import { PureComponent } from "react";
import NavMenu from "./mods/nav-menu";
import type { MenuProps } from "antd";
import Footer from "./mods/footer";
import Header from "./mods/header";
import klass from "@x-drive/klass";
import Routers from "@/router";

import "./index.less";

const { Sider, Content } = Layout;

const HTTP_REGEXP = /^http[s]?:\/\//;

class ClinetLayout extends PureComponent<RouteComponentProps> {

    state = {
        "title": ""
        , "hasEx": false
        , "fullscreen": false
        , "lock": false
        , "verify": true
    }

    private menus: MenuProps["items"];

    /**正在登出 */
    private leaving = false;

    /**需要特殊处理的地址 */
    private special: Record<string, true> = {
        "/viewer": true
    }

    constructor(props) {
        super(props);
        this.handleEvent();

        const location = this.props.location;
        this.realLoginPagePath = "/login";

        if (location.pathname === this.realLoginPagePath) {
            this.state.fullscreen = true;
        }

        /**
         * <AntMenu onClick={this.onMenuClick}>
                <AntMenu.Item key="logout" icon={<PoweroffOutlined />}>
                    退出系统
                </AntMenu.Item>
            </AntMenu>
         */

        this.menus = [
            {
                "key": "logout"
                , "label": (
                    <Space>
                        <PoweroffOutlined />
                        退出系统
                    </Space>
                )
            }
        ];
    }

    componentDidMount() {
        this.checkSpecial();
    }

    componentDidUpdate() {
        this.checkSpecial();
    }

    /**检测是否要特殊处理界面 */
    private checkSpecial() {
        if (this.special[this.props.location.pathname] && this.state.fullscreen === false) {
            this.toggleLayout();
        }
    }

    handleEvent() {
        eventcenter.on(LAYOUT_SET_TITLE, (data: string) => {
            if (isString(data)) {
                this.setState({
                    "title": data
                });
            }
        });

        eventcenter.on(LAYOUT_TOGGLE_MENU, () => {
            this.setState({
                "hasEx": !this.state.hasEx
            });
        });

        eventcenter.on(LAYOUT_TOGGLE_DISPLAY, (data?: boolean) => {
            this.toggleLayout(data);
        });
        eventcenter.on(LAYOUT_LOGOUT, (data?: string) => {
            if (this.leaving) {
                return;
            }
            this.leaving = true;
            setTimeout(() => {
                userStore.del();
                cookie.remove(X_LAB_SESSION, "/");
                this.leaving = false;
                if (data && HTTP_REGEXP.test(data)) {
                    window.location.href = data;
                } else {
                    const pathname = this.props.location.pathname;
                    if (!NO_AUTH[pathname]) {
                        this.props.history.replace(
                            `${this.realLoginPagePath}?r=${pathname === this.realLoginPagePath ? "/" : pathname}`
                        );
                    }
                }
            }, 55)
        });
    }

    toggleLayout = (state?: boolean) => {
        const fullscreen = isBoolean(state) ? state : !this.state.fullscreen;
        this.setState({
            fullscreen
        });
    }

    toggle = (hasEx: boolean) => {
        this.setState({
            hasEx
        });
    }

    onMenuClick = async ({ key }) => {
        switch (key) {
            case "logout":
                if (this.leaving) {
                    return;
                }
                this.leaving = true;
                try {
                    const re = await Request.post<string>("/logout", {});
                    userStore.del();
                    this.leaving = false;
                    if (re && HTTP_REGEXP.test(re)) {
                        setTimeout(() => {
                            window.location.href = re;
                        }, 55);
                    } else {
                        this.toggleLayout(true);
                        this.props.history.replace(this.realLoginPagePath);
                    }
                } catch (e) {
                    console.error(e);
                }
                break;

            case "modify-pws":
                this.props.history.replace("/forgot-password");
                break;
        }
    }

    onHeaderFnClick = (type) => () => {
        if (this.state.lock) {
            return;
        }
        switch (type) {
            case "business":
                this.setState({
                    "lock": true
                }, () => {
                    // SDK.navigate.gotoBusiness();
                });
                break;

            case "internal":
                this.setState({
                    "lock": true
                });
                // SDK.navigate.gotoInternal();
                break;

            case "setting":
                this.props.history.push("/setting");
                break;
            case "history":
                this.props.history.push("/history");
                break;
            case "favorite":
                this.props.history.push("/favorite");
                break;
        }
    }

    getCellClass(type?: string) {
        return klass(
            "G-layoutHeaderFnsItemCell"
            , {
                "Loading": type === "business" ? this.state.lock : false
                , "act": `/${type}` === this.props.location.pathname
            }
            , true
        )
    }

    getHeaderFns() {
        return (
            <div className="G-layoutHeaderFnsList">
                <div className="G-layoutHeaderFnsItem">
                    {/* <div className={this.getCellClass("favorite")} onClick={this.onHeaderFnClick("favorite")}>
                        <HeartOutlined />
                    </div>
                    <div className={this.getCellClass("history")} onClick={this.onHeaderFnClick("history")}>
                        <HistoryOutlined />
                    </div>
                    <div className={this.getCellClass("setting")} onClick={this.onHeaderFnClick("setting")}>
                        <SettingOutlined />
                    </div>
                    <div className={this.getCellClass("business")} onClick={this.onHeaderFnClick("business")}>
                        <ThunderboltOutlined />
                    </div> */}
                    <Dropdown
                        placement="bottomRight"
                        className="G-layoutHeaderDd"
                        menu={{ "items": this.menus, onClick: this.onMenuClick }}
                    >
                        <div onClick={e => e.preventDefault()}>
                            <UserOutlined /> <DownOutlined />
                        </div>
                    </Dropdown>

                </div>
            </div>
        );
    }

    render() {
        const { title, hasEx, fullscreen } = this.state;
        return (
            <Layout className="G-layout">
                <Content>
                    <Layout>
                        {
                            fullscreen
                                ? null
                                : (
                                    <Sider trigger={null} defaultCollapsed={true} className="G-layoutNavSide" collapsedWidth={55}>
                                        <div className="G-layoutNavSideSpace"></div>
                                        <aside className="G-layoutNavSideMenus">
                                            <NavMenu></NavMenu>
                                        </aside>
                                    </Sider>
                                )
                        }
                        <Layout className="G-layoutMainLayout">
                            <Header
                                title={title}
                                exStatus={hasEx}
                                isShow={!fullscreen}
                                onToggle={this.toggle}
                                fns={this.getHeaderFns()}
                            ></Header>

                            <AnimationRouter Routers={Routers} />
                        </Layout>
                    </Layout>
                </Content>
                <Footer isShow={true} />
            </Layout>
        );
    }
}

// @ts-ignore
export default withRouter(ClinetLayout);