import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript/dist';
import { User } from '../users/user.model';
import { Messages } from '../messages/messages.model';
import { Publications } from 'src/common/models/publications/publications.model';
import { ChatGroup } from 'src/common/models/groups/chatGroups.model';

interface FilesCreationAttrs {
    fileName: string;
    fileNameUuid: string;
}

@Table({ tableName: `files` })
export class Files extends Model<Files, FilesCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    fileName: string;

    @Column({ type: DataType.STRING, allowNull: false })
    fileNameUuid: string;

    @ForeignKey(() => Messages)
    @Column({ type: DataType.INTEGER })
    messageId: number;

    @BelongsTo(() => Messages)
    messages: Messages;

    @ForeignKey(() => Publications)
    @Column({ type: DataType.INTEGER })
    publicationId: number;

    @BelongsTo(() => Publications)
    publications: Publications;

    @ForeignKey(() => ChatGroup)
    @Column({ type: DataType.INTEGER })
    chatId: number;

    @BelongsTo(() => ChatGroup)
    chat: ChatGroup;
}
