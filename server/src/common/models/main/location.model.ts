import { Column, DataType, Model, Table } from 'sequelize-typescript/dist';

interface GeoLocationsCreationAttrs {
    country: string;
    region: string;
    locality: string;
}

@Table({ tableName: 'location' })
export class GeoLocations extends Model<GeoLocations, GeoLocationsCreationAttrs> {
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
