import klass from "@x-drive/klass";
import { memo } from "react";
import "./index.less";

const AreaLoading = memo(({ isShow }: { isShow: boolean; }) => {
    return (
        <div className={klass(
            "M-loadingArea"
            , {
                "show": isShow
            }
            , true
        )}>
            <div className="block"></div>
            <div className="block"></div>
            <div className="block"></div>
        </div>
    );
});

export default AreaLoading;