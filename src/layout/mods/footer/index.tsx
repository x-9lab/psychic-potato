import { date } from "@x-drive/utils";
import klass from "@x-drive/klass";
import { memo } from "react";
import "./index.less";

export default memo(({ isShow }: { isShow: boolean; }) => {
    return <footer className={klass(
        "G-layoutFooter"
        , {
            "show": isShow
            , "hide": !isShow
        }
        , true
    )}>
        <span>&copy; {date(new Date(), "Y")}</span>
        <a href="http://beian.miit.gov.cn" target="_blank" rel="noreferrer">粤ICP备2021056679号</a>
    </footer>;
});