import React, { Component, useContext } from 'react';
import { Context } from '..';

function VkCallback() {

    const {store} = useContext(Context)

    const queryParams = new URLSearchParams(window.location.search)
    const code = queryParams.get("payload")

    store.registrationVk(code)

    return (
        <div>
            <h1 className="main__text">Коллбек {code}</h1>
        </div>
    );
}

export default VkCallback;