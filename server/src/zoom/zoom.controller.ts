import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ZoomService } from './zoom.service';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateMeetingDto } from 'src/common/dtos/create-meeting.dto';
import { AuthenticatedRequest } from 'src/common/types/types';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Zoom } from 'src/common/models/zoom/zoom.model';
import { ZoomWithUnreadDto } from 'src/common/dtos/zoom-with-unread.dto';

@ApiTags('Zoom')
@Controller('api')
export class ZoomController {
    constructor(private readonly zoomService: ZoomService) {}

    @Post('create-meeting')
    @ApiBody({
        type: CreateMeetingDto,
    })
    @ApiCreatedResponse({
        description: 'Вече успешно создано',
        type: Zoom,
    })
    @UseGuards(JwtAuthGuard)
    createMeeting(@Req() req: AuthenticatedRequest, @Body() dto: CreateMeetingDto): Promise<Zoom> {
        return this.zoomService.createMeeting(req.user.id, dto);
    }

    @Get('get-meeting')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'Список доступных Веч',
        type: ZoomWithUnreadDto,
        isArray: true,
    })
    getMeeting(@Req() req: AuthenticatedRequest): Promise<ZoomWithUnreadDto[]> {
        return this.zoomService.getMeeting(req.user.id);
    }

    @Post('meeting/:id/view')
    @UseGuards(JwtAuthGuard)
    markViewed(@Req() req: AuthenticatedRequest, @Param('id') zoomId: number) {
        return this.zoomService.markViewed(req.user.id, zoomId);
    }
}
