import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript/dist';
import { ApiProperty } from '@nestjs/swagger';
import { ZoomView } from 'src/common/models/zoom/zoom_views.model';

interface ZoomCreationAttrs {
    topic: string;
    description?: string;
    startTime: Date;
    timezone?: string;
    country?: string;
    region?: string;
    locality?: string;
    groupId?: number;
    userId: number;
    fullName: string;
    zoomMeetingId?: string;
    joinUrl?: string;
}

@Table({ tableName: `zoom` })
export class Zoom extends Model<Zoom, ZoomCreationAttrs> {
    @ApiProperty({ type: Number })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: false })
    topic: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.TEXT, allowNull: true })
    description: string;

    @ApiProperty({ type: String, format: 'date-time' })
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    startTime: Date;

    @Column({
        type: DataType.STRING,
        defaultValue: 'Europe/Moscow',
    })
    timezone: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: true })
    country: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: true })
    region: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: true })
    locality: string;

    @ApiProperty({ type: Number })
    @Column({ type: DataType.INTEGER })
    groupId: number;

    @ApiProperty({ type: Number })
    @Column({ type: DataType.INTEGER })
    userId: number;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING })
    fullName: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: true })
    zoomMeetingId: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: true })
    joinUrl: string;

    @ApiProperty({ type: () => [ZoomView] })
    @HasMany(() => ZoomView, { foreignKey: 'zoomId' })
    views: ZoomView[];
}
