import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Zoom } from 'src/common/models/zoom/zoom.model';

@Table({ tableName: 'zoom_views', timestamps: false })
export class ZoomView extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @Column({ field: 'user_id' })
    userId: number;

    @Column({ field: 'viewed_at' })
    viewedAt: Date;

    @ForeignKey(() => Zoom)
    @Column({ field: 'zoom_id' })
    zoomId: number;

    @BelongsTo(() => Zoom)
    zoom: Zoom;
}
