import Request, { config as setRequestConfig, R } from "@x-drive/request";
import eventcenter from "@x-drive/event-center";
import { LAYOUT_LOGOUT } from "@consts/events";
import { message as notifyMod } from "antd";
import { isObject } from "@x-drive/utils";
import Logger from "@components/logger";
import hosts from "@consts/hosts";
import apis from "@consts/apis";

import "./index.less";

const RequestLogger = Logger.getLogger("Req");

setRequestConfig(
    {
        hosts
        , "apis": Object.keys(apis).reduce(
            (subject, key) => {
                const item = apis[key];
                subject[key] = isObject(item) ? item.uri : item;
                return subject;
            }
            , Object.create(null)
        )
        , "successCode": 0
        , "notifyMod": notifyMod.error
        , notifyMsgFormater(opt) {
            return {
                "content": opt.description
                , "duration": 4
            };
        }
        , "logger": RequestLogger
    }
    , process.env.NODE_ENV
);

var is403InProgress = false;

Request.setting({
    "keys": {
        "data": "result"
        , "message": "msg"
    }
    , "hooks": {
        onResponseError(re) {
            if (re.code === 403) {
                if (!is403InProgress) {
                    is403InProgress = true;
                    setTimeout(() => {
                        is403InProgress = false;
                        eventcenter.emit(LAYOUT_LOGOUT);
                    });
                }
            }
            return true;
        }
    }
    , "config": {
        "credentials": true
    }
});

function cancel(pathname?: string) {
    R.cancel(pathname);
}

export { cancel }

export default Request;

