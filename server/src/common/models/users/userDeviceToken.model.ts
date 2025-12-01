import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';
import { DevicePlatform } from 'src/common/types/types';

interface UserDeviceTokenCreationAttrs {
    token: string;
    deviceId?: string;
    platform?: DevicePlatform;
}

@Table({ tableName: 'user_device_tokens' })
export class UserDeviceToken extends Model<UserDeviceToken, UserDeviceTokenCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    token: string;

    @Column({ type: DataType.STRING, allowNull: true })
    deviceId: string;

    @Column({
        type: DataType.ENUM(...Object.values(DevicePlatform)), // ← enum здесь
        allowNull: false,
        defaultValue: DevicePlatform.UNKNOWN,
    })
    platform: DevicePlatform;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;

    @BelongsTo(() => User)
    user: User;
}
