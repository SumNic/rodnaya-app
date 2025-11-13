import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript/dist';
import { User } from '../users/user.model';
import { Files } from '../files/files.model';
import { ApiProperty } from '@nestjs/swagger';

interface PublicationsCreationAttrs {
    country: string;
    region: string;
    locality: string;
    message: string;
    video?: string[];
}

@Table({ tableName: `publications` })
export class Publications extends Model<Publications, PublicationsCreationAttrs> {
    @ApiProperty({ type: Number })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ type: String })
    @Column({ type: DataType.TEXT, allowNull: false })
    message: string;

    @ApiProperty({ type: [String] })
    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
    video: string[];

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: false })
    country: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: false })
    region: string;

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: false })
    locality: string;

    @ApiProperty({ type: Boolean })
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    blocked: boolean;

    @ApiProperty({ type: Number })
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;

    @ApiProperty({ type: () => User })
    @BelongsTo(() => User)
    user: User;

    @ApiProperty({ type: () => [Files] })
    @HasMany(() => Files)
    files: Files[];

    @ApiProperty({ type: Date })
    readonly createdAt!: Date;

    @ApiProperty({ type: Date })
    readonly updatedAt!: Date;
}
