import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript/dist';
import { UserRoles } from './user-roles.model';
import { User } from './user.model';
import { ApiProperty } from '@nestjs/swagger';

interface RolesCreationAttrs {
    value: string;
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role, RolesCreationAttrs> {
    @ApiProperty({ type: Number })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    value: string;

    @ApiProperty({ type: () => [User] })
    @BelongsToMany(() => User, () => UserRoles)
    users: User[];
}
