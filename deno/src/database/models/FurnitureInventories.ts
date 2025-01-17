import Sequelize from 'https://cdn.skypack.dev/sequelize';



export class FurnitureInventories extends Sequelize.Model {

    static init(sequelize: any, DataTypes: any) {
        return super.init(
            {
                userId: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    primaryKey: true
                },
                itemId: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    primaryKey: true
                },
                quantity: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                }
            },
            { sequelize, timestamps: false, tableName: 'furniture_inventories' }
        )
    }

}
