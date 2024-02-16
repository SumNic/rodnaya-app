import {
  BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
  } from 'sequelize-typescript';
import { User } from './user.model';
  
  interface TokenCreationAttrs {
    uuid: string;
    refreshToken: string;
  }
  
  @Table({ tableName: 'token' })
  export class Token extends Model<Token, TokenCreationAttrs> {
    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;
  
    @Column({ type: DataType.STRING, allowNull: true })
    uuid: string;
  
    @Column({ type: DataType.STRING, allowNull: true })
    refreshToken: string;

    @BelongsTo(() => User)
    users: User;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;
    // references: { model: User, key: 'id' } 
    
    
  }