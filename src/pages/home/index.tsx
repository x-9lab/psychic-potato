import LayoutContent from "@components/layout-content";
import { Button, message } from "antd";
import { PureComponent } from "react";
import "./index.less";

interface HomeState {

    /**提交状态 */
    loading: boolean;

    /**正在离开 */
    leave: boolean;
}

class Home extends PureComponent<any, HomeState> {

    state = {
        "loading": false
        , "leave": false
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    onComfirm = async () => {
        const win = window.open("http://us.1234566f90c245c6a8ec6e0d6ef99fb1.dev.opsamz.com/login/callback?jwt=eyJraWQiOiJcL0NTRHZvRkRkRFB3dlB1MXlrREJ3bmd0Q2hlNklTbnZmeUFxRXRHQmVDRT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJlYTUzODIxNi01OTRiLTQ2OTMtYjVlMy01NzQ2MTVjNDExYTkiLCJjdXN0b206SXNBZG1pbiI6IjEiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTFfRzE5bURmQVZsIiwiY29nbml0bzp1c2VybmFtZSI6ImppYW5nemhvdWFkbWluIiwib3JpZ2luX2p0aSI6ImE0ZDNkOGJkLWMzNDQtNGZjMi1hNDI1LWE0ZDc3N2M0ZWE1ZiIsImF1ZCI6IjVwOThkMWgybHM0MG50dmc4dGFhMXZmdW1mIiwiZXZlbnRfaWQiOiJkZTA1NDRjMC0zNDFiLTQ0YTEtODBkYy00OTUyYmM4YjdjNDAiLCJjdXN0b206SXNTdXBwZXJVc2VyIjoiMCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjQ4MDkwMTQxLCJleHAiOjE2NDgxNzY1NDEsImlhdCI6MTY0ODA5MDE0MSwianRpIjoiZGI0NmM0MzgtZDYzNy00ZDUxLWFiNDgtNmJkMzAzNWViNjNhIn0.PL0b3hADVKMyVd4q8LEM7JVbkfEUG8GRTjOwMz_qwhK9WfXOg5klGSbygNJ4QbYLhIuVlnp6x5pOKjgUb9KgZYzIOXFtkrXssMrLbvzbGUGcodYUMQfN4ulkfZtcfGmxG23eo-Hh1MOwUM9wNbWHWQnPNu2r7S65VIkHq9ulCVI4nsJnNmvvGS6wDPhCkfvY7IsRMiOzQkFfitOAomlkFbnXk3xvCeqfI0kiV3wSd2_4EOH4CBiUmyz42p7ThS25M5QF_BI0MOiL_ZYz7aYP2FEsB2kOJ6QXzByhz4_coZBwKIpDpBw2-4SGvaHxCoCelS9yd8vbz-gdHlUCn2ALvQ&merchant=zhncadmin1");
        if (!win) {
            message.error("请允许在本页打开新窗口");
        }
    }

    onNext = () => {

    }

    render() {
        const { loading } = this.state;
        return (
            <LayoutContent>
                <div className="P-home">
                    <Button onClick={this.onComfirm} loading={loading} type="primary">测试</Button>
                </div>
            </LayoutContent>
        )
    }
}

export default Home;