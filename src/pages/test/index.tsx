import LayoutContent from "@components/layout-content";
import { Typography, Row } from "antd";
import { PureComponent } from "react";
import "./index.less";

const { Title } = Typography;

interface LoginState {

    /**提交状态 */
    loading: boolean;

    /**正在离开 */
    leave: boolean;

    editorVal: string;

    data: ModelDatas;
}


interface IModel {
    make: string;
    model: string;
    price: number;
}

type ModelDatas = IModel[];

class Test extends PureComponent<any, LoginState> {

    state = {
        "loading": false
        , "leave": false
        , "editorVal": null
        , "data": []
    }

    storageVal: number = null;

    private columns = [
        { "field": "make" }
        , { "field": "model", "editable": true }
        , { "field": "price", "editable": true }
    ];

    async componentDidMount() {
        this.load();
    }

    componentWillUnmount() {
    }

    onEditorChange = async (val: string) => {

    }

    onTest = async () => {
    }

    async load() {

    }

    render() {
        const { data } = this.state;
        return (
            <LayoutContent>
                <div className="P-test">
                    Test
                    <div>{JSON.stringify(data)}</div>
                </div>
            </LayoutContent>
        )
    }
}

export default Test;