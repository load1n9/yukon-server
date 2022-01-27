import Sequelize from 'https://cdn.skypack.dev/sequelize';


export class Buddies extends Sequelize.Model {

    static init(sequelize: any, DataTypes: any) {
        return super.init(
            {
                userId: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    primaryKey: true
                },
                buddyId: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    primaryKey: true
                }
            },
            { sequelize, timestamps: false, tableName: 'buddies' }
        )
    }

}
