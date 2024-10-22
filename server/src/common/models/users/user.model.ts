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

interface UserCreationAttrs {
    user_id: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
    vk_id: number;

    @Column({ type: DataType.STRING, allowNull: true })
    first_name: string;

    @Column({ type: DataType.STRING, allowNull: true })
    last_name: string;

    @Column({ type: DataType.STRING, allowNull: true })
    photo_50: string;

    @Column({ type: DataType.STRING, allowNull: true })
    photo_max: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isDelProfile: boolean;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isRegistration: boolean;

    @Column({ type: DataType.DATE, allowNull: true })
    dateEditResidency: Date;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    blocked: boolean;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    blockedforever: boolean;

    @Column({ type: DataType.DATE, allowNull: true })
    blockeduntil: Date;

    @Column({ type: DataType.STRING, allowNull: false })
    secret: string;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];

    @ForeignKey(() => Residency)
    @Column({ type: DataType.INTEGER })
    residencyId: number;

    @BelongsTo(() => Residency)
    residency: Residency;

    @HasMany(() => Token)
    tokens: Token[];

    @HasOne(() => Declaration)
    declaration: Declaration;

    @HasMany(() => Messages)
    messages: Messages[];

    @HasMany(() => ManageMessages)
    manageMessages: ManageMessages[];

    @HasMany(() => EndReadMessage)
    endReadMessage: EndReadMessage[];
}
