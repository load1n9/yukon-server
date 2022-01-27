import Sequelize from 'https://cdn.skypack.dev/sequelize';


export class Ignores extends Sequelize.Model {

    static init(sequelize: any, DataTypes: any) {
        return super.init(
            {
                userId: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    primaryKey: true
                },
                ignoreId: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    primaryKey: true
                }
            },
            { sequelize, timestamps: false, tableName: 'ignores' }
        )
    }

}
