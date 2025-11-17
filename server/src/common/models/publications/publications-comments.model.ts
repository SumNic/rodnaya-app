import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript/dist';
import { User } from '../users/user.model';
import { Files } from '../files/files.model';
import { ApiProperty } from '@nestjs/swagger';
import { Publications } from 'src/common/models/publications/publications.model';

interface PublicationCommentsCreationAttrs {
    location: string;
    message: string;
    video?: string[];
}

@Table({ tableName: `publication_comments` })
export class PublicationComments extends Model<PublicationComments, PublicationCommentsCreationAttrs> {
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
    text: string;

    @ApiProperty({ type: [String] })
    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
    video: string[];

    @ApiProperty({ type: Boolean })
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    blocked: boolean;

    @ApiProperty({ type: Number })
    @ForeignKey(() => Publications)
    @Column({ type: DataType.INTEGER })
    piblicationId: number;

    @ApiProperty({ type: () => Publications })
    @BelongsTo(() => Publications)
    publication: Publications;

    @ApiProperty({ type: Date })
    readonly createdAt!: Date;

    @ApiProperty({ type: Date })
    readonly updatedAt!: Date;
}
