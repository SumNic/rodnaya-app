import { Table, Column, DataType, ForeignKey, Model } from 'sequelize-typescript';
import { Group } from 'src/common/models/groups/groups.model';
import { User } from 'src/common/models/users/user.model';

@Table({ tableName: 'group_admins', createdAt: false, updatedAt: false })
export class GroupAdmins extends Model<GroupAdmins> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => Group)
    @Column({ type: DataType.INTEGER })
    groupId: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;
    references: { model: User; key: 'id' };
}
