import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript/dist';
import { User } from '../users/user.model';

interface ManageMessagesCreationAttrs {
    location: string;
    blocked: boolean;
}

@Table({ tableName: 'manageMessage' })
export class ManageMessages extends Model<ManageMessages, ManageMessagesCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    location: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    blocked: boolean;

    @Column({ type: DataType.DATE, allowNull: true })
    timeAddMessage: Date;

    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    lastReadMessage: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;

    @BelongsTo(() => User)
    user: User;
}
