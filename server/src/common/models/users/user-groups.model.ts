import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript/dist';
import { User } from './user.model';
import { Group } from 'src/common/models/groups/groups.model';

@Table({ tableName: 'user_groups', createdAt: false, updatedAt: false })
export class UserGroups extends Model<UserGroups> {
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
