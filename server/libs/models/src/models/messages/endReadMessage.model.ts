import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

interface EndReadMessageCreationAttrs {
    location: string;
    endMessage: number;
}

@Table({ tableName: 'endReadMessage' })
export class EndReadMessage extends Model<
    EndReadMessage,
    EndReadMessageCreationAttrs
> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({type: DataType.INTEGER})
    user_id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    location: string;

    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    endMessage: number;

    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    endMessageId: number;

    @BelongsTo(() => User)
    users: User;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;
}
