import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript/dist';
import { Role } from './role.model';
import { UserRoles } from './user-roles.model';
import { Residency } from './residency.model';
import { Token } from './tokens.model';
import { Declaration } from './declaration.model';
import { Secret } from './secret.model';
import { Messages } from '../messages/messages.model';
import { ManageMessages } from '../messages/manageMessages.model';
import { EndReadMessage } from '../messages/endReadMessage.model';
import { Publications } from 'src/common/models/publications/publications.model';
import { Group } from 'src/common/models/groups/groups.model';
import { UserGroups } from 'src/common/models/users/user-groups.model';
import { GroupAdmins } from 'src/common/models/groups/group-admins.model';
import { LastReadPostChat } from 'src/common/models/groups/lastReadPostChat.model';
import { GroupMessage } from 'src/common/models/groups/groupMessage';
import { ApiProperty } from '@nestjs/swagger';

interface UserCreationAttrs {
    user_id: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({ type: Number })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ type: Number })
    @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
    vk_id: number;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: true })
    first_name: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: true })
    last_name: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: true })
    photo_50: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: true })
    photo_max: string;

    @ApiProperty({ type: Boolean })
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isDelProfile: boolean;

    @ApiProperty({ type: Boolean })
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isRegistration: boolean;

    @ApiProperty({
        type: String,
        format: 'date-time',
        required: false, // allowNull: true
        description: 'Дата создания записи',
    })
    @Column({ type: DataType.DATE, allowNull: true })
    dateEditResidency: Date;

    @ApiProperty({ type: Boolean })
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    blocked: boolean;

    @ApiProperty({ type: Boolean })
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    blockedforever: boolean;

    @ApiProperty({
        type: String,
        format: 'date-time',
        required: false, // allowNull: true
        description: 'Дата создания записи',
    })
    @Column({ type: DataType.DATE, allowNull: true })
    blockeduntil: Date;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: false })
    secret: string;

    @ApiProperty({ type: Number })
    @Column({ type: DataType.INTEGER, unique: false })
    tg_id: number;

    @ApiProperty({ type: () => [Role] })
    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];

    @ApiProperty({ type: Number })
    @ForeignKey(() => Residency)
    @Column({ type: DataType.INTEGER })
    residencyId: number;

    @ApiProperty({ type: () => Residency })
    @BelongsTo(() => Residency)
    residency: Residency;

    @ApiProperty({ type: () => [Token] })
    @HasMany(() => Token)
    tokens: Token[];

    @ApiProperty({ type: () => Declaration })
    @HasOne(() => Declaration)
    declaration: Declaration;

    @ApiProperty({ type: () => [Messages] })
    @HasMany(() => Messages)
    messages: Messages[];

    @ApiProperty({ type: () => [ManageMessages] })
    @HasMany(() => ManageMessages)
    manageMessages: ManageMessages[];

    @ApiProperty({ type: () => [EndReadMessage] })
    @HasMany(() => EndReadMessage)
    endReadMessage: EndReadMessage[];

    @ApiProperty({ type: () => [LastReadPostChat] })
    @HasMany(() => LastReadPostChat)
    lastReadPostChat: LastReadPostChat[];

    @ApiProperty({ type: () => [Publications] })
    @HasMany(() => Publications)
    publications: Publications[];

    @ApiProperty({ type: () => [GroupMessage] })
    @HasMany(() => GroupMessage)
    messagesChat: GroupMessage[];

    @ApiProperty({ type: () => [Group] })
    @BelongsToMany(() => Group, {
        through: () => UserGroups,
        as: 'userGroups', // Алиас для связи
    })
    userGroups: Group[];

    @ApiProperty({ type: () => [Group] })
    @BelongsToMany(() => Group, {
        through: () => GroupAdmins,
        as: 'adminGroups', // Алиас для связи
    })
    adminGroups: Group[];

    @ApiProperty({ type: Date })
    readonly createdAt!: Date;

    @ApiProperty({ type: Date })
    readonly updatedAt!: Date;
}
