import { SwitchTransition, CSSTransition } from "react-transition-group";
import { Switch, Route, useLocation } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons"
import { Suspense, useMemo } from "react";

import "./index.less"

function Loading() {
    return (
        <div className="M-animationRouterLoading">
            <LoadingOutlined />
            Loading...
        </div>
    )
}

type AnimationRouterProps = {
    /**路由表 */
    Routers: PsychicPotato.Route[];
}

function AnimationRouter({ Routers }: AnimationRouterProps) {
    let location = useLocation<PsychicPotato.RouteLocation>();
    return (
        <div className="M-animationRouter">
            <SwitchTransition>
                <CSSTransition
                    key={location.pathname}
                    classNames="fade"
                    timeout={300}
                >
                    <Suspense fallback={<Loading />}>
                        <Switch location={location}>
                            {
                                useMemo(() => {
                                    return Routers.map((route, index) => {
                                        return route.childs
                                            ? route.childs.map((child, cIndex) => {
                                                return <Route key={`${index}_${cIndex}_${route.path}`} {...child} />;
                                            })
                                            : <Route key={`${index}_${route.path}`} {...route} />
                                    })
                                }, [Routers])
                            }
                        </Switch>
                    </Suspense>
                </CSSTransition>
            </SwitchTransition>
        </div>
    )
}

export default AnimationRouter;