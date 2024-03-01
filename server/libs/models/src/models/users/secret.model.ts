import {
  BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
  } from 'sequelize-typescript';
import { User } from './user.model';
  
  interface SecretAttrs {
    secret: string;
  }
  
  @Table({ tableName: 'secrets' })
  export class Secret extends Model<Secret, SecretAttrs> {
    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;
  
    @Column({ type: DataType.STRING, allowNull: true })
    secret: string;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number; 
  }