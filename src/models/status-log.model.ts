import { Table, Column, Model, DataType, AllowNull } from "sequelize-typescript";

@Table({
    tableName: "status_logs",
    timestamps: true,
})
export class StatusLog extends Model<StatusLog> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    notification_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    status: string;
}