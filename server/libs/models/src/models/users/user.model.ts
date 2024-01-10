import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from './role.model';
import { UserRoles } from './user-roles.model';

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

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  vk_id: string;

  @Column({ type: DataType.STRING, allowNull: true })
  avatar: string;

  @Column({ type: DataType.STRING, allowNull: true })
  first_name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  last_name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  avatar_base: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  registr: boolean;

  @Column({ type: DataType.STRING, defaultValue: false }) 
  refreshToken: string; 

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];
}
