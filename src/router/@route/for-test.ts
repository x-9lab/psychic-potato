
import { BugOutlined } from "@ant-design/icons";
import translate from "@components/translate";
import { lazy } from "react";

const Test: PsychicPotato.Route[] = [
    {
        "path": "/test"
        , "component": lazy(() => import(/* webpackChunkName: "pages-test" */"@pages/test"))
        , "title": translate("测试", true)
        , "key": "test"
        , "icon": BugOutlined
        , "type": "all"
    }
    // , {
    //     "path": "/faucet"
    //     , "component": lazy(() => import(/* webpackChunkName: "pages-faucet" */"@pages/faucet"))
    //     , "title": translate("Faucet", true)
    //     , "key": "faucet"
    //     , "icon": FilterOutlined
    // }
]
export default Test;