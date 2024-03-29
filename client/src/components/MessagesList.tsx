import { Link } from "react-router-dom";
import { PERSONALE_CARD_ROUTE } from "../utils/consts";

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

    return (
        <div id="message__ajax">
            {props.posts.map((post: any, index: number, arr: any) => 
                <div key={post.id} id={post.id}>
                    
                    {index === 0  
                        ? <div className="date__wrapper"><p className="name__time">{new Date(post.createdAt).toLocaleString("ru", options_day)}</p></div>
                        : new Date(post.createdAt).toDateString() !== new Date(arr[index === 0 ? index : index - 1].createdAt).toDateString() 
                            && 
                            <div className="date__wrapper"><p className="name__time">{new Date(post.createdAt).toLocaleString("ru", options_day)}</p></div>}
                    
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
                            <a href="../uploads/' . $sign . '" className="name__file">' . $name_file . '</a>
                        </div>
                    </div>
                </div>)}
        </div>
        )
}

export default MessagesList;