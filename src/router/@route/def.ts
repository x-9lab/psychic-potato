
import { EyeOutlined } from "@ant-design/icons";
import translate from "@components/translate";
import Home from "@pages/home";
import { lazy } from "react";

const Def: PsychicPotato.Route[] = [
    {
        "path": "/"
        , "exact": true
        , "component": Home
        , "title": translate("大绅士", true)
        , "key": "index"
        , "icon": EyeOutlined
        , "index": 0
        , "type": "web"
    }
    , {
        "path": "/login"
        , "component": lazy(() => import(/* webpackChunkName: "pages-login" */"@/pages/login"))
        , "title": translate("登录", true)
        , "key": "login"
        , "hide": true
        , "noAuth": true
        , "type": "web"
    }
]
export default Def;