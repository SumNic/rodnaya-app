import { ApiProperty } from '@nestjs/swagger';
import { Zoom } from '../models/zoom/zoom.model';

export class ZoomWithUnreadDto extends Zoom {
    @ApiProperty({ description: 'Флаг непрочитанной встречи', required: false })
    isUnread?: boolean;
}
