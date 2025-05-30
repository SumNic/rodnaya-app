import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript/dist';
import { User } from '../users/user.model';
import { UserGroups } from 'src/common/models/users/user-groups.model';
import { GroupAdmins } from 'src/common/models/groups/group-admins.model';

interface GroupsCreationAttrs {
    name: string;
    task: string;
    userId: number;
}

@Table({ tableName: `groups` })
export class Group extends Model<Group, GroupsCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    task: string;

    @Column({ type: DataType.STRING, allowNull: true })
    avatar: string;

    @Column({ type: DataType.STRING, allowNull: true })
    world: string;

    @Column({ type: DataType.STRING, allowNull: true })
    country: string;

    @Column({ type: DataType.STRING, allowNull: true })
    region: string;

    @Column({ type: DataType.STRING, allowNull: true })
    locality: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    blocked: boolean;

    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;

    @BelongsToMany(() => User, {
        through: () => UserGroups,
        as: 'users', // Алиас для связи
    })
    users: User[];

    @BelongsToMany(() => User, {
        through: () => GroupAdmins,
        as: 'admins', // Алиас для связи
    })
    admins: User[];
}
