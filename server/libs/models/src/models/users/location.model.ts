import {
    BelongsToMany,
    Column,
    DataType,
    Model,
    Table,
  } from 'sequelize-typescript';
  
  interface LocationCreationAttrs {
    country: string;
    region: string;
    locality: string;
  }
  
  @Table({ tableName: 'location_users' })
  export class LocationUser extends Model<LocationUser, LocationCreationAttrs> {
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
  }