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
import { User } from '../users/user.model';

interface MessagesCreationAttrs {
  message: string;
}

@Table({ tableName: `messages` })
export class Messages extends Model<Messages, MessagesCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  message: string;

  @Column({ type: DataType.STRING, allowNull: false })
  location: string;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER})
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
