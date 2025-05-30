import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript/dist';
import { User } from '../users/user.model';

interface LastReadPostChatCreationAttrs {
    group_id: number;
}

@Table({ tableName: 'lastReadPostChat' })
export class LastReadPostChat extends Model<LastReadPostChat, LastReadPostChatCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.INTEGER })
    group_id: number;

    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    countReadPosts: number;

    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    lastReadPostId: number;

    @BelongsTo(() => User)
    users: User;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;
}
