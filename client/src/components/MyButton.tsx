interface Props {
    text: string;
    style?: any;
    type?: "button" | "submit" | "reset" | undefined;
    func?: () => void;
  }

function MyButton(props: Props) {

    return (
        <button id="VKIDSDKAuthButton" className="button_my VkIdWebSdk__button_reset" type={props.type} onClick={props.func} style={props.style ? props.style : {background: "#3e8a5b"}}>
            <div className="VkIdWebSdk__button_container">
                <div className="My__button_text">
                    {props.text}
                </div>
            </div>
        </button>
    );
}

export default MyButton;