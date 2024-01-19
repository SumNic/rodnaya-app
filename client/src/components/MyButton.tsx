import { useEffect, useState } from "react";

interface Props {
    text: string;
    func: () => void;
  }

function MyButton(props: Props) {

    return (
        <button id="VKIDSDKAuthButton" className="button_my VkIdWebSdk__button_reset" onClick={props.func}>
            <div className="VkIdWebSdk__button_container">
                <div className="VkIdWebSdk__button_icon">
                </div>
                <div className="My__button_text">
                    {props.text}
                </div>
            </div>
        </button>
    );
}

export default MyButton;