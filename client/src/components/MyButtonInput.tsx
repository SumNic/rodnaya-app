import { useEffect, useState } from "react";

function MyButtonInput():any {

    return (
        <button id="VKIDSDKAuthButton" className="button_my VkIdWebSdk__button_reset">
            <div className="VkIdWebSdk__button_container">
                <div className="VkIdWebSdk__button_icon">
                </div>
                <div className="VkIdWebSdk__button_text">
                <input type="submit" form="condition" id="submit" value="Продолжить регистрацию"/>
                </div>
            </div>
        </button>
    );
}

export default MyButtonInput;