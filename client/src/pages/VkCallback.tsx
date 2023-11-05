import React, { Component } from 'react';

class VkCallback extends Component {

    

    render() {

        const queryParams = new URLSearchParams(window.location.search)
        const code = queryParams.get("code")

        // const VKDATA = {
        //     client_id: this.configService.get('VK_CLIENT_ID'),
        //     client_secret: this.configService.get('VK_CLIENT_SECRET'),
        //     callback: this.configService.get('VK_CALLBACK'),
        //   };
      
        //   const url = `https://oauth.vk.com/access_token?client_id=${VKDATA.client_id}&client_secret=${VKDATA.client_secret}&redirect_uri=${VKDATA.callback}&code=${query.code}`;
        //   res.redirect(url);


        const VK_CLIENT_ID=51694852
        const VK_CALLBACK='http://localhost:3000/vk/callback'
        const VK_CLIENT_SECRET='rd1Swsokw00lPJvVrDQD'

        const CLIENT_URL='http://localhost:3000'

        const VKDATA = {
            client_id: VK_CLIENT_ID,
            client_secret: VK_CLIENT_SECRET,
            callback: VK_CALLBACK,
        };
        const url = `https://oauth.vk.com/access_token?client_id=${VKDATA.client_id}&client_secret=${VKDATA.client_secret}&redirect_uri=${VKDATA.callback}&code=${code}`;
        // return res.redirect(url);

        // if (url['access_token']) {}

        return (
            <div>
                <h1 className="main__text">Коллбек {code}</h1>
            </div>
        );
    }
}

export default VkCallback;