import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript/dist';

interface FooulSendMessageAttrs {
    id_cleaner: number;
    id_foul_message: number;
    selectedRules: number[];
    selectedActionWithFoul: number;
    selectedPunishment: number;
}

@Table({ tableName: 'foul_send_message' })
export class FooulSendMessage extends Model<FooulSendMessage, FooulSendMessageAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    id_cleaner: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    id_foul_message: number;

    @Column({ type: DataType.ARRAY(DataType.INTEGER), allowNull: false })
    selectedRules: number[];

    @Column({ type: DataType.INTEGER, allowNull: false })
    selectedActionWithFoul: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    selectedPunishment: number;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    is_decided: boolean;

    @Column({ type: DataType.STRING, allowNull: true })
    source: string;
}
