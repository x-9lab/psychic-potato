import type { FormInstance, RuleObject } from "antd/lib/form";
import type { RouteComponentProps } from "react-router-dom";
import { Card, Divider, Button, Input, Form } from "antd";
import { LAYOUT_TOGGLE_DISPLAY } from "@consts/events";
import { user as userStore } from "@components/store";
import { parseStr, cookie } from "@x-drive/utils";
import { PureComponent, createRef } from "react";
import { ApiOutlined } from "@ant-design/icons";
import eventcenter from "@x-drive/event-center";
import { X_LAB_SESSION } from "@consts/system";
import translate from "@components/translate";
import Request from "@components/request";
import { getRouterPath } from "@/router";
import klass from "@x-drive/klass";

import "./index.less";

type LoginData = {
    /**用户名 */
    username: string;

    /**密码 */
    password: string;
}


/**验证规则 */
type Rules = Record<keyof LoginData, RuleObject[]>;

interface LoginState {

    /**表单数据 */
    data: LoginData;

    /**提交状态 */
    loading: boolean;

    /**正在离开 */
    leave: boolean;

    /**已经登陆 */
    loginStatus: number;
}

/**登录界面的特殊全局样式 */
const SpStyle = document.createElement("style");
SpStyle.appendChild(
    document.createTextNode(
        `
        .G-root {
            background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
        }
        .ant-layout {
            background: transparent;
        }
        `
    )
);

class Login extends PureComponent<RouteComponentProps, LoginState> {

    state = {
        "data": {
            "username": ""
            , "password": ""
        }
        , "loading": false
        , "leave": false
        , "loginStatus": 0
    }

    /**表单对象 */
    private form = createRef<FormInstance>();

    /**表单验证规则 */
    private rules: Rules = {
        "password": [
            { "required": true, "message": translate("请输入密码") }
        ]
        , "username": [
            { "required": true, "message": translate("请输入用户名") }
        ]
    }

    private boxStyle = {
        "borderRadius": "5px"
    }

    async componentDidMount() {
        const session = cookie.get(X_LAB_SESSION);
        if (session) {
            try {
                await userStore.check();
                this.setState({
                    "loginStatus": 2
                });
                setTimeout(() => {
                    this.goBack();
                }, 1000);
            } catch (e) {
                this.setState({
                    "loginStatus": 1
                });
            }
        } else {
            this.setState({
                "loginStatus": 1
            });
        }
        document.head.appendChild(SpStyle);
        eventcenter.emit(LAYOUT_TOGGLE_DISPLAY, true);
    }

    componentWillUnmount() {
        document.head.removeChild(SpStyle);
        eventcenter.emit(LAYOUT_TOGGLE_DISPLAY, false);
    }

    goBack() {
        const search = this.props?.location?.search;
        const q = search ? parseStr(search.replace("?", "") || "") : {};
        eventcenter.emit(LAYOUT_TOGGLE_DISPLAY, false);
        this.props.history.replace(q && q.r ? q.r : getRouterPath("/"));
    }

    onComfirm = async () => {
        this.setState({
            "loading": true
        });
        try {
            await this.form.current!.validateFields();
            const formData = this.form.current!.getFieldsValue();
            await Request.post("/login", formData);
            await userStore.check();
            this.setState({
                "leave": true
                , "loading": false
            }, () => {
                setTimeout(() => {
                    this.goBack();
                }, 444);
            });
        } catch (e) {
            this.setState({
                "loading": false
            });
        }
    }

    onNext = () => {
        this.onComfirm();
    }

    render() {
        const { loading, leave, loginStatus } = this.state;
        return (
            <div className="P-loginWarp">
                {
                    loginStatus === 0
                        ? <></>
                        : (
                            <div className="P-loginSkyTitle">
                                <div className="main">Login</div>
                                {
                                    loginStatus === 2
                                        ? (
                                            <div className="sub">已登录, 正在跳转...</div>
                                        )
                                        : null
                                }
                            </div>
                        )
                }

                {
                    loginStatus === 1
                        ? (
                            <div className={klass("P-login", { "hide": leave }, true)}>
                                <Card hoverable bodyStyle={this.boxStyle}>
                                    <header className="P-loginTitle">{translate("欢迎使用")}</header>
                                    <div className="P-loginForm">
                                        <Form layout="vertical" requiredMark ref={this.form}>
                                            <div className="P-loginFormRow">
                                                <Form.Item
                                                    name="username"
                                                    rules={this.rules.username}
                                                    label={translate("用户名", true)}
                                                >
                                                    <Input placeholder={translate("请输入用户名")} autoComplete="off" />
                                                </Form.Item>
                                            </div>
                                            <div className="P-loginFormRow">
                                                <Form.Item
                                                    name="password"
                                                    rules={this.rules.password}
                                                    label={translate("密码", true)}
                                                >
                                                    <Input.Password placeholder={translate("请输入密码")} autoComplete="off" onPressEnter={this.onNext} />
                                                </Form.Item>
                                            </div>
                                        </Form>
                                    </div>
                                    <Divider orientation="right" plain>
                                        <ApiOutlined />
                                    </Divider>
                                    <div className="P-loginCtrl">
                                        <Button onClick={this.onComfirm} loading={loading} type="primary">{translate("登录", true)}</Button>
                                    </div>
                                </Card>
                            </div>
                        )
                        : null
                }

                <div className="P-loginSky">
                    <div className="P-loginStars" data-size="small"></div>
                    <div className="P-loginStars" data-size="mid"></div>
                    <div className="P-loginStars" data-size="big"></div>
                </div>
            </div>
        )
    }
}

export default Login;