interface Props {
    type: string;
    form: string;
    id: string;
    value: string;
    style?: any;
  }

function MyButtonInput(props: Props):any {

    return (
        <button id="VKIDSDKAuthButton" className="button_my VkIdWebSdk__button_reset"  style={props.style ? props.style : {background: "#3e8a5b"}}>
            <div className="VkIdWebSdk__button_container">
                <div className="VkIdWebSdk__button_icon">
                </div>
                <div className="VkIdWebSdk__button_text">
                <input type={props.type} form={props.form} id={props.id} value={props.value}/>
                </div>
            </div>
        </button>
    );
}

export default MyButtonInput;