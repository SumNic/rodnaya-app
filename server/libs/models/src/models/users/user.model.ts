import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from './role.model';
import { UserRoles } from './user-roles.model';
import { Residency } from './residency.model';
import { Token } from './tokens.model';

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

  @Column({ type: DataType.STRING, allowNull: true })
  secret: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isRegistration: boolean;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @ForeignKey(() => Residency)
  @Column({type: DataType.INTEGER})
  residencyId: number;

  @BelongsTo(() => Residency)
  residency: Residency;

  @HasMany(() => Token) 
  token: Token[];
}
