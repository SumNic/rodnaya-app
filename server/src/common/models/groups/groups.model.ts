import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript/dist';
import { User } from '../users/user.model';
import { UserGroups } from 'src/common/models/users/user-groups.model';
import { GroupAdmins } from 'src/common/models/groups/group-admins.model';
import { ApiProperty } from '@nestjs/swagger';

interface GroupsCreationAttrs {
    name: string;
    task: string;
    userId: number;
}

@Table({ tableName: `groups` })
export class Group extends Model<Group, GroupsCreationAttrs> {
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
    name: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.TEXT, allowNull: false })
    task: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: true })
    avatar: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: true })
    world: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: true })
    country: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: true })
    region: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: true })
    locality: string;

    @ApiProperty({ type: Boolean })
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    blocked: boolean;

    @ApiProperty({ type: Number })
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;

    @ApiProperty({ type: () => [User] })
    @BelongsToMany(() => User, {
        through: () => UserGroups,
        as: 'users', // Алиас для связи
    })
    users: User[];

    @ApiProperty({ type: () => [User] })
    @BelongsToMany(() => User, {
        through: () => GroupAdmins,
        as: 'admins', // Алиас для связи
    })
    admins: User[];
}
