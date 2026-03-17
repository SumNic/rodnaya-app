import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript/dist';
import { User } from './user.model';
import { ApiProperty } from '@nestjs/swagger';

interface ResidencyCreationAttrs {
    country: string;
    region: string;
    locality: string;
}

@Table({ tableName: 'residency' })
export class Residency extends Model<Residency, ResidencyCreationAttrs> {
    @ApiProperty({ type: Number })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: false })
    country: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: false })
    region: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: true })
    locality: string;

    @ApiProperty({ type: () => [User] })
    @HasMany(() => User)
    users: User[];
}
