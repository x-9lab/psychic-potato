import { PureComponent, createRef, ReactEventHandler, memo } from "react";
import { isString, random } from "@x-drive/utils";
import { DEF_IMG_BASE64 } from "@consts/common";
import { Logger } from "@components/helper";
import { Popover } from "antd";
import "./index.less";

interface ILazyProps {
    /**节点选择器 */
    selector?: string;

    /**将本组件设为 root 节点 */
    isRoot?: boolean;

    /**刷新触发属性 */
    refresh?: number;
}

/**组件 id */
var lid = random(23333, 233);

const LazyLogger = Logger.getLogger("Lazy");

/**懒加载图片属性 */
type ILazyImageProps = {
    /**图片原始地址 */
    src: string;

    /**待加载时的图片 */
    holder?: string;

    /**图片描述 */
    alt?: string;
}

/**懒加载图片 */
const LazyImage = memo<ILazyImageProps>(({ src, holder = DEF_IMG_BASE64, alt = "" }) => {

    /**储物处理函数 */
    const onError: ReactEventHandler<HTMLImageElement> = (ev) => {
        (ev.target as HTMLImageElement).src = DEF_IMG_BASE64;
    }

    return (
        <Popover arrowPointAtCenter placement="right" content={
            <div className="M-lazyPop">
                <img className="M-lazyPopImg" src={src} alt={alt} />
            </div>
        }>
            <img src={holder} onError={onError} data-src={src} alt={alt} />
        </Popover>
    );
});
export { LazyImage };


class Lazy extends PureComponent<ILazyProps> {

    /**IntersectionObserver */
    private io: IntersectionObserver = null;

    /**容器 id */
    private lazyId: string;

    /**容器节点 */
    private content = createRef<HTMLDivElement>();

    /**节点对象列表 */
    private eles: NodeListOf<Element> = null;

    /**监控节点选择器 */
    private selector: string;

    /**还未触发的个数 */
    private remain: number = 0;

    componentDidMount() {
        this.lazyId = `LAZY_RRR_${(lid++).toString(16)}`;
        if (isString(this.props.selector)) {
            this.selector = this.props.selector;
        } else {
            this.selector = "img[data-src]";
        }
        this.io = new IntersectionObserver(
            this.onOb
            , {
                "threshold": 0.1
            }
        );
        setTimeout(() => {
            this.tryToObserve();
        }, 50);
    }

    componentDidUpdate(prevProps: ILazyProps) {
        if (prevProps.refresh !== this.props.refresh) {
            this.refresh();
        }
    }

    componentWillUnmount() {
        if (this.io) {
            this.io.disconnect();
            this.io = null;
        }
    }

    /**绑定监听 */
    private tryToObserve() {
        if (this.content && this.content.current) {
            const eles = this.content.current.querySelectorAll(this.selector);
            if (eles && eles.length) {
                this.eles = eles;
                this.remain = eles.length;
                this.eles.forEach(el => {
                    this.io.observe(el);
                });
            }
        }
    }

    /**监听回调函数 */
    private onOb = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((item) => {
            if (item.isIntersecting) {
                const target = item.target as unknown as HTMLImageElement;
                target.src = target.dataset.src;
                this.io.unobserve(target);
                this.remain -= 1;
            }
        });
    }

    /**手动刷新内部监听节点 */
    refresh() {
        if (!this.io) {
            return;
        }
        if (this.eles && this.eles.length && this.remain > 0) {
            // 还有剩下未触发的
            try {
                for (let i = 0; i < this.eles.length; i++) {
                    this.io.unobserve(this.eles[i]);
                }
                this.remain = 0;
            } catch (e) {
                LazyLogger.error(e);
            }
        }
        setTimeout(() => {
            this.tryToObserve();
        }, 16);
    }

    render() {
        const { children } = this.props;
        return (
            <div id={this.lazyId} ref={this.content}>
                {children}
            </div>
        )
    }
}

export default Lazy;
