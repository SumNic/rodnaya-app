import { Controller } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('messages')
export class MessagesController {}
