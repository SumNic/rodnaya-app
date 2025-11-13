import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript/dist';
import { User } from '../users/user.model';
import { Messages } from '../messages/messages.model';
import { Publications } from 'src/common/models/publications/publications.model';
import { GroupMessage } from 'src/common/models/groups/groupMessage';
import { ApiProperty } from '@nestjs/swagger';

interface FilesCreationAttrs {
    fileName: string;
    fileNameUuid: string;
}

@Table({ tableName: `files` })
export class Files extends Model<Files, FilesCreationAttrs> {
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
    fileName: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: false })
    fileNameUuid: string;

    @ApiProperty({ type: Number })
    @ForeignKey(() => Messages)
    @Column({ type: DataType.INTEGER })
    messageId: number;

    @ApiProperty({ type: () => Messages })
    @BelongsTo(() => Messages)
    messages: Messages;

    @ApiProperty({ type: Number })
    @ForeignKey(() => Publications)
    @Column({ type: DataType.INTEGER })
    publicationId: number;

    @ApiProperty({ type: () => Publications })
    @BelongsTo(() => Publications)
    publications: Publications;

    @ApiProperty({ type: Number })
    @ForeignKey(() => GroupMessage)
    @Column({ type: DataType.INTEGER })
    chatId: number;

    @ApiProperty({ type: () => GroupMessage })
    @BelongsTo(() => GroupMessage)
    chat: GroupMessage;
}
