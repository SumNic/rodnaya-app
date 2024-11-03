import { UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WsException } from '@nestjs/websockets';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { HOST } from 'src/common/constants/hosts';

@WebSocketGateway({ cors: { origin: `${HOST}` }, namespace: 'ws' })
export class MessagesGateway {
    handleConnection(client: any) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: any) {
        console.log(`Client disconnected: ${client.id}`);
    }

    // @SubscribeMessage('message')
    // handleMessage(client: any, payload: any): string {
    //     return 'Hello world!';
    // }

    @UseGuards(JwtAuthGuard)
    @SubscribeMessage('new_message')
    async addMessage(client: any, dto: any): Promise<number> {
        console.log(dto, 'вещ');
        try {
            // const user = await this.usersService.getUser(dto.id_user);

            // if (user && user.secret === dto.secret) {
            //     const locationUser = user.residency[`${dto.location}`] ? user.residency[`${dto.location}`] : 'Земля'
            //     const message = await this.messagesRepository.create({
            //         location: locationUser,
            //         message: dto.form.message,
            //     });
            //     await user.$add('messages', message);
            //     const arrFileId = JSON.parse(dto.form.files);
            //     arrFileId.map((fileId: number) => {
            //         message.$add('file', fileId);
            //     });

            //     const DATA = {
            //         v: this.configService.get<string>('VK_VERSION'),
            //         access_token: this.configService.get<string>('VK_ACCESS_TOKEN'),
            //         client_url: this.configService.get<string>('CLIENT_URL'),
            //     };

            //     const usersByResidence = this.usersService.getUsersByResidence(locationUser)
            //     const peer_ids = (await usersByResidence).map(user => user.vk_id)

            //     const params = new URLSearchParams();
            //     params.append('v', DATA.v);
            //     params.append('access_token', DATA.access_token);
            //     params.append('peer_ids', `${peer_ids.join(',')}`);
            //     params.append('random_id', '0');
            //     params.append('message', `Отправитель: ${user.first_name} ${user.last_name} \nСообщение: ${message.message} \nПерейти к сообщениям: ${DATA.client_url}/messages/${dto.location}`);

            //     const response = await fetch('https://api.vk.com/method/messages.send', {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/x-www-form-urlencoded',
            //         },
            //         body: params.toString(),
            //     });

            //     const data = await response.json();
            //     console.log('Успешно отправлено', data);

            client.emit('new_message', dto);
            //     return message.id;
            // }

            throw new WsException('Сообщение не было отправлено');
        } catch (err) {
            throw new WsException(err?.message);
        }
    }
}
