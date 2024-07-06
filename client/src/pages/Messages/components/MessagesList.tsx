import { Link } from "react-router-dom";
import {
    DOMEN,
    PERSONALE_CARD_ROUTE,
} from "../../../utils/consts";
import { IFiles } from "../../../models/IFiles";
import { Buffer } from "buffer";
import { createRef, useEffect, useRef, useState } from "react";
// import React from "react";

interface Props {
    posts: [];
}

const MessagesList: React.FC<Props> = ({ posts }) => {
    const [heights, setHeights] = useState<number>();
    const [endVisibleMessage, setEndVisibleMessage] = useState<number>(0);
    // const refDivMessages = useRef(null);
    const elementsRef = useRef<React.RefObject<HTMLDivElement>[]>(
        posts.map(() => createRef() as React.RefObject<HTMLDivElement>)
    );

    // console.log(elementsRef)

    useEffect(() => {
        if (elementsRef.current.length) {
            let id = 0
            const endVisibleId = elementsRef.current.forEach(
                
                (ref) => {
                    if(ref.current && heights) {
                        
                        let checkHeight = heights - ref.current.clientHeight
                        
                        if (checkHeight < 0) {
                            return
                        }
                        id++
                    }
                }
            );
            console.log(id, 'id');
            // setHeights(nextHeights);
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

    // console.log(ref.current)

    // useEffect(() => {
    //     if (ref.current) ref.current = null
    // }, [props.posts])

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
        const { scrollHeight, scrollTop, clientHeight } = target;
        let h = scrollTop + clientHeight;
        console.log(h, 'h')
        setHeights(scrollTop + clientHeight)
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            // console.log("bottom reached");
            // scroll to the top of the next page
            // fetchNextPage();
        }
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
