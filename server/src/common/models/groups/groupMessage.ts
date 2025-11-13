import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript/dist';
import { User } from '../users/user.model';
import { Files } from 'src/common/models/files/files.model';
import { ApiProperty } from '@nestjs/swagger';

interface GroupMessagesCreationAttrs {
    groupId: number;
    location: string;
    message: string;
    video?: string[];
}

@Table({ tableName: `groupMessages` })
export class GroupMessage extends Model<GroupMessage, GroupMessagesCreationAttrs> {
    @ApiProperty({ type: Number })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ type: Number })
    @Column({ type: DataType.INTEGER, allowNull: false })
    groupId: number;

    @ApiProperty({ type: String })
    @Column({ type: DataType.TEXT, allowNull: false })
    message: string;

    @ApiProperty({ type: [String] })
    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
    video: string[];

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: false })
    location: string;

    @ApiProperty({ type: Boolean })
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    blocked: boolean;

    @ApiProperty({ type: Number })
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;

    @ApiProperty({ type: () => User })
    @BelongsTo(() => User)
    user: User;

    @ApiProperty({ type: () => [Files] })
    @HasMany(() => Files)
    files: Files[];

    @ApiProperty({ type: Date })
    readonly createdAt!: Date;

    @ApiProperty({ type: Date })
    readonly updatedAt!: Date;
}
