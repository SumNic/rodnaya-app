import {
  BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
  } from 'sequelize-typescript';
import { User } from './user.model';
  
  interface DeclarationCreationAttrs {
    declaration: string;
  }
  
  @Table({ tableName: 'declarations' })
  export class Declaration extends Model<Declaration, DeclarationCreationAttrs> {
    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;
  
    @Column({ type: DataType.STRING, allowNull: false })
    declaration: string;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number; 
  }