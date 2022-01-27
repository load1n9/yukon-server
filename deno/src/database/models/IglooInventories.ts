import Sequelize from 'https://cdn.skypack.dev/sequelize';

export class IglooInventories extends Sequelize.Model {

    static init(sequelize: any, DataTypes: any) {
        return super.init(
            {
                userId: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    primaryKey: true
                },
                iglooId: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    primaryKey: true
                }
            },
            { sequelize, timestamps: false, tableName: 'igloo_inventories' }
        )
    }

}
