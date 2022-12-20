// import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
// import { PureComponent, createElement } from "react";
import { isFunction } from "@x-drive/utils";
import { PureComponent } from "react";
import klass from "@x-drive/klass";
import "./index.less";

type HeaderProps = {
    /**是否有权限 */
    exStatus?: boolean;

    /**标题 */
    title: string;

    /**切换响应函数 */
    onToggle?: (status: boolean) => void;

    /**是否显示头部区域 */
    isShow: boolean;

    /**头部功能 */
    fns?: any;
}

type HeaderState = {
    hasExPromission: boolean;
}

class Header extends PureComponent<HeaderProps, HeaderState> {

    static defaultProps = {
        "exStatus": false
        , "title": ""
        , "isShow": true
    }

    state = {
        "hasExPromission": false
    }

    componentDidMount() {
        this.checkProps();
    }

    componentDidUpdate() {
        this.checkProps();
    }

    private checkProps() {
        if (this.props.exStatus !== this.state.hasExPromission) {
            this.setState({
                "hasExPromission": this.props.exStatus
            });
        }
    }

    toggle = () => {
        const status = !this.state.hasExPromission;
        if (isFunction(this.props.onToggle)) {
            this.props.onToggle(status);
        } else {
            this.setState({
                "hasExPromission": status
            });
        }
    }

    getExClass() {
        return klass({
            "G-layoutHeaderEx": this.state.hasExPromission
        })
    }

    render() {
        const { title, fns, isShow } = this.props;
        // const { hasExPromission } = this.state;
        return (
            isShow
                ? (
                    <header className="G-layoutHeader">
                        <div className="G-layoutHeaderCtrls">
                            {/* {createElement(hasExPromission ? UnlockOutlined : LockOutlined, {
                                "className": this.getExClass()
                                , "onClick": this.toggle
                            })} */}
                        </div>
                        <div className="G-layoutHeaderContainer">{title}</div>
                        <div className="G-layoutHeaderFns">
                            {
                                fns ? fns : null
                            }
                        </div>
                    </header>
                )
                : null
        )
    }
}


export default Header;