import type { RouteComponentProps } from "react-router-dom";
import { user as userStore } from "@components/store";
import { withRouter } from "react-router-dom";
import { PureComponent } from "react";
import type { MenuProps } from "antd";
import Router from "@/router"
import { Menu } from "antd";
import "./index.less";

interface Props extends RouteComponentProps {

}

type MenuItem = Required<MenuProps>["items"][number];

type State = {
    current: string;
    currentGroup: string;
}

const GroupMap = {};
Router.forEach(item => {
    if (item.childs) {
        item.childs.forEach(child => {
            GroupMap[child.path.toString()] = item.key;
        });
    }
});

console.log(GroupMap);



class AppMenu extends PureComponent<Props, State> {

    state: State = {
        "current": "/"
        , "currentGroup": ""
    }

    constructor(prpos) {
        super(prpos);
        var location = prpos.location;
        if (location && location.pathname) {
            this.state.current = location.pathname;
            this.state.currentGroup = GroupMap[location.pathname] || "";
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps?.location.pathname !== this.props?.location.pathname) {
            const current = this.props.location.pathname;
            this.setState({
                current
                , "currentGroup": GroupMap[current] || ""
            });
        }
    }

    onClick = e => {
        if (e.key === this.state.current) {
            e.domEvent.preventDefault();
            e.domEvent.stopPropagation();
            return false;
        }
        this.setState({
            "current": e.key
        });
        this.props.history.push(e.key);
    }

    genMenuItems() {
        const user = userStore.get();

        const menuItems: MenuProps["items"] = Router
            .filter(item => {
                if (item.hide) {
                    return false;
                }
                return item.role ? user && user.authority.includes(item.role) : true;
            })
            .map(item => {
                const re: MenuItem = {
                    "key": item.path.toString()
                    , "icon": (<item.icon /> || null)
                    , "label": item.title
                    , "children": null
                }
                if (item.childs) {
                    re.children = item.childs.map(subItem => {
                        return {
                            "key": subItem.path.toString()
                            , "label": item.title
                        } as MenuItem;
                    });
                }
                return re;
            });
        return menuItems;
    }

    render() {
        const { current, currentGroup } = this.state;
        return (
            <Menu
                selectedKeys={[current]}
                defaultOpenKeys={[currentGroup]}
                className='G-layoutMenu'
                onClick={this.onClick}
                mode="inline"
                items={this.genMenuItems()}
            ></Menu>
        )
    }
}

export default withRouter(AppMenu);