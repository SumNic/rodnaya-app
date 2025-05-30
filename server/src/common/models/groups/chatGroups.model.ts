import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript/dist';
import { User } from '../users/user.model';
import { Files } from 'src/common/models/files/files.model';

interface ChatGroupsCreationAttrs {
    groupId: number;
    location: string;
    message: string;
}

@Table({ tableName: `chatGroups` })
export class ChatGroup extends Model<ChatGroup, ChatGroupsCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    groupId: number;

    @Column({ type: DataType.TEXT, allowNull: false })
    message: string;

    @Column({ type: DataType.STRING, allowNull: false })
    location: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    blocked: boolean;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @HasMany(() => Files)
    files: Files[];
}
