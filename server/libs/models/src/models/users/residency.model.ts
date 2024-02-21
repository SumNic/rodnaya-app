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
  
  interface ResidencyCreationAttrs {
    country: string;
    region: string;
    locality: string;
  }
  
  @Table({ tableName: 'residency' })
  export class Residency extends Model<Residency, ResidencyCreationAttrs> {
    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;
  
    @Column({ type: DataType.STRING, allowNull: false })
    country: string;
  
    @Column({ type: DataType.STRING, allowNull: false })
    region: string;
  
    @Column({ type: DataType.STRING, allowNull: true })
    locality: string;

    @HasMany(() => User)
    users: User[];
  }