import { Link } from "react-router-dom";
import {
    DOMEN,
    LOCAL_STORAGE_END_READ_MESSAGE_ID,
    LocationEnum,
    PERSONALE_CARD_ROUTE,
} from "../../../utils/consts";
import { IFiles } from "../../../models/IFiles";
import { Buffer } from "buffer";
import {
    createRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { observer } from "mobx-react-lite";
import { useMessageContext } from "../../../contexts/MessageContext.ts";
import { useStoreContext } from "../../../contexts/StoreContext.ts";
import { useStore } from "../../../hooks/useStore.hook.ts";
import { EndReadMessagesId } from "../../../models/endReadMessagesId.ts";
import MessagesService from "../../../services/MessagesService.ts";
// import React from "react";

interface Props {
    posts: [];
    location: string;
}

const MessagesList: React.FC<Props> = ({ posts, location }) => {
    const [heights, setHeights] = useState<number>();
    const [endIdFromPage, setEndIdFromPage] = useState<EndReadMessagesId[]>();

    const { store } = useStoreContext();

    const elementsRef = useRef<React.RefObject<HTMLDivElement>[]>(
        posts.map(() => createRef() as React.RefObject<HTMLDivElement>)
    );

    useEffect(() => {
        elementsRef.current = posts.map(
            () => createRef() as React.RefObject<HTMLDivElement>
        );
    }, [posts, location]);

    const memoizedIndexMap = useMemo(() => {
        const entries = Object.values(LocationEnum).filter(
            (type): type is LocationEnum => typeof type === "string"
        );
        return entries.map((item, index) => ({ item: String(item), index }));
    }, []);

    useEffect(() => {
        if (!location || !endIdFromPage?.length || !elementsRef.current.length)
            return;
        let i = 0;
        elementsRef.current.reduce((accum, ref) => {
            if (ref.current && heights && accum < heights - 120) {
                i++;
                return accum + ref.current.clientHeight;
            }
            return accum;
        }, 0);
        const newEndIdFromPage = endIdFromPage.map((elem, index) => {
            const indexLocation = memoizedIndexMap.findIndex(
                ({ item }) => item === location
            );
            if (index === indexLocation && i !== 0) {
                const currentElement = elementsRef.current[i - 1]?.current;
                return {
                    ...elem,
                    id: currentElement?.id ? +currentElement?.id : 0,
                };
            }
            return elem;
        });

        setEndIdFromPage((prev) => {
            if (
                prev &&
                JSON.stringify(prev) !== JSON.stringify(newEndIdFromPage)
            ) {
                return newEndIdFromPage;
            }
            return prev;
        });
    });

    useEffect(() => {
        if (endIdFromPage) {
            localStorage.setItem(
                LOCAL_STORAGE_END_READ_MESSAGE_ID,
                JSON.stringify(endIdFromPage)
            );
        }
        endIdFromPage?.map(async (elem, index) => {
            try {
                console.log(elem.id, 'elem.id');
                // console.log(store.arrEndMessagesId[index].id, 'store.arrEndMessagesId[index].id');
                if (elem && store.arrEndMessagesId.length ) {
                    if (elem.id > store.arrEndMessagesId[index].id) {
                        console.log(store.arrEndMessagesId[index].id, 'store.arrEndMessagesId[index]?.id');
                        await MessagesService.setEndReadMessagesId(
                            store.user.id,
                            elem.id,
                            elem.location,
                            store.user.secret.secret
                        );
                    }
                }
            } catch (e) {
                console.log(e, 'e');
            }
        });
    }, [endIdFromPage]);

    useEffect(() => {
        const storageId = localStorage.getItem(
            LOCAL_STORAGE_END_READ_MESSAGE_ID
        );
        if (storageId && !endIdFromPage)
            setEndIdFromPage(JSON.parse(storageId) as EndReadMessagesId[]);
        if (!storageId && store.arrEndMessagesId.length) {
            setEndIdFromPage(store.arrEndMessagesId as EndReadMessagesId[]);
        }
    });

    var options_time: {} = {
        timezone: "UTC",
        hour: "numeric",
        minute: "numeric",
    };

    var options_day: {} = {
        year: "numeric",
        month: "long",
        day: "numeric",
        timezone: "UTC",
    };

    function openInfo() {}

    function foulSend() {}

    useEffect(() => {
        window.addEventListener("beforeunload", handleWindowBeforeUnload);
    });

    function handleWindowBeforeUnload(e: any) {
        console.log(e, "e");
    }

    useEffect(() => {
        const messagesElement = document.getElementById("div__messages");
        if (messagesElement) {
            const scrollTop = messagesElement.scrollTop;
            const clientHeight = messagesElement.clientHeight;
            setHeights(scrollTop + clientHeight);
        }
    }, [elementsRef.current]);

    useEffect(() => {
        document
            .getElementById("div__messages")
            ?.addEventListener("scroll", scrollHandler);

        return () => {
            document
                .getElementById("div__messages")
                ?.removeEventListener("scroll", scrollHandler);
        };
    });

    const scrollHandler = (e: Event) => {
        const target = e.target as HTMLElement;
        const { scrollTop, clientHeight } = target;
        setHeights(scrollTop + clientHeight);
    };

    return (
        <div className="main__text" id="div__messages">
            <div id="message__ajax">
                {posts.map((post: any, index: number, arr: any) => (
                    <div
                        key={post.id}
                        id={post.id}
                        ref={elementsRef.current[index]}
                    >
                        {index === 0 ? (
                            <div className="date__wrapper">
                                <p className="name__time">
                                    {new Date(post.createdAt).toLocaleString(
                                        "ru",
                                        options_day
                                    )}
                                </p>
                            </div>
                        ) : (
                            new Date(post.createdAt).toDateString() !==
                                new Date(
                                    arr[
                                        index === 0 ? index : index - 1
                                    ].createdAt
                                ).toDateString() && (
                                <div className="date__wrapper">
                                    <p className="name__time">
                                        {new Date(
                                            post.createdAt
                                        ).toLocaleString("ru", options_day)}
                                    </p>
                                </div>
                            )
                        )}

                        <div className="mes__wrapper">
                            <Link to={PERSONALE_CARD_ROUTE} onClick={openInfo}>
                                <img
                                    className="mes_foto"
                                    src={post.user.photo_50}
                                />
                            </Link>
                            <div className="name__first_last">
                                <Link
                                    to={PERSONALE_CARD_ROUTE}
                                    className="name__first"
                                >
                                    <p className="name__first">
                                        {post.user.first_name}
                                    </p>
                                </Link>
                                <Link
                                    to={PERSONALE_CARD_ROUTE}
                                    className="name__first"
                                >
                                    <p className="name__first">
                                        {post.user.last_name}
                                    </p>
                                </Link>
                                <p className="name__time">
                                    {new Date(post.createdAt).toLocaleString(
                                        "ru",
                                        options_time
                                    )}
                                </p>
                                <div className="foul">
                                    <select
                                        name="foul"
                                        className="foul_select"
                                        onChange={foulSend}
                                    >
                                        <option></option>
                                        <option
                                            className="foul__mes"
                                            id="foul__mes'.$user['id'].'"
                                            value="'.$user['id'].'"
                                        >
                                            нарушение правил
                                        </option>
                                    </select>
                                    <p id="foul__respons"></p>
                                </div>
                            </div>
                            <div className="mes_message">{post.message}</div>
                            <div className="div_name_file">
                                {post.files.map((file: IFiles) => {
                                    let originFileName = Buffer.from(
                                        file.fileName,
                                        "latin1"
                                    ).toString("utf8");
                                    return (
                                        <a
                                            href={`${DOMEN}/${file.fileNameUuid}`}
                                            target="_blank"
                                            key={file.id}
                                            className="name__file"
                                        >
                                            {originFileName}
                                        </a>
                                    );
                                    // return (<Link to={`${FILES_ROUTE}/${file.fileNameUuid}`} target="_blank" key={file.id} className="name__file">{originFileName}</Link>)
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div id="button__message">
                <button
                    id="button"
                    // onClick={openNewMesseg}
                >
                    У вас есть непрочитанные сообщения. Показать?
                </button>
            </div>
        </div>
    );
};

export default MessagesList;
