import { Link } from "react-router-dom";
import { FILES_ROUTE, PERSONALE_CARD_ROUTE } from "../utils/consts";
import { IFiles } from "../models/IFiles";
import {Buffer} from 'buffer';
import { useEffect } from "react";

interface Props {
    posts: [];
  }

function MessagesList(props: Props) {

    var options_time: {} = {
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
    };

    var options_day: {} = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timezone: 'UTC',
    };

    function openInfo() {

    }

    function foulSend() {

    }

    useEffect(() => {
        window.addEventListener('beforeunload', handleWindowBeforeUnload);
    })

    function handleWindowBeforeUnload(e: any) {
        console.log(e, 'e')
    }

    return (
        <div id="message__ajax">
            {props.posts.map((post: any, index: number, arr: any) => 
                <div key={post.id} id={post.id}>
                    
                    {index === 0  
                        ? 
                        <div className="date__wrapper">
                            <p className="name__time">{new Date(post.createdAt).toLocaleString("ru", options_day)}</p>
                        </div>
                        : 
                        new Date(post.createdAt).toDateString() !== new Date(arr[index === 0 ? index : index - 1].createdAt).toDateString() 
                        && 
                        <div className="date__wrapper">
                            <p className="name__time">{new Date(post.createdAt).toLocaleString("ru", options_day)}</p>
                        </div>
                    }
                    
                    <div className="mes__wrapper">
                        <Link to={PERSONALE_CARD_ROUTE} onClick={openInfo}><img className="mes_foto" src={post.user.photo_50} /></Link>
                        <div className="name__first_last">
                            <Link to={PERSONALE_CARD_ROUTE} className="name__first"><p className="name__first">{post.user.first_name}</p></Link>
                            <Link to={PERSONALE_CARD_ROUTE} className="name__first"><p className="name__first">{post.user.last_name}</p></Link>
                            <p className="name__time">{new Date(post.createdAt).toLocaleString("ru", options_time)}</p>
                            <div className="foul">
                                <select name="foul" className="foul_select" onChange={foulSend}>
                                    <option></option>
                                    <option className="foul__mes" id="foul__mes'.$user['id'].'" value="'.$user['id'].'">нарушение правил</option>
                                </select>
                                <p id="foul__respons"></p>
                            </div>
                        </div>
                        <div className="mes_message">{post.message}</div>
                        <div className="div_name_file">
                            {post.files.map((file: IFiles) => {
                                let originFileName = Buffer.from(file.fileName, 'latin1').toString('utf8')
                                return (<a href={`http://localhost:5000/${file.fileNameUuid}`}  target="_blank" key ={file.id} className="name__file">{originFileName}</a>)
                                // return (<Link to={`${FILES_ROUTE}/${file.fileNameUuid}`} target="_blank" key={file.id} className="name__file">{originFileName}</Link>)

                            })}
                        </div>
                    </div>
                </div>)
            }
        </div>
        )
}

export default MessagesList;