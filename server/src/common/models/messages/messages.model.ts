import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript/dist';
import { User } from '../users/user.model';
import { Files } from '../files/files.model';

interface MessagesCreationAttrs {
    location: string;
    message: string;
}

@Table({ tableName: `messages` })
export class Messages extends Model<Messages, MessagesCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

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
