import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript/dist';

interface InfoAttrs {
    version_app: string;
}

@Table({ tableName: 'info' })
export class Info extends Model<Info, InfoAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING, allowNull: true })
    version_app: string;
}
