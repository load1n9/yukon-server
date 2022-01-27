import Sequelize from 'https://cdn.skypack.dev/sequelize';



export class UserIgloos extends Sequelize.Model {

    static init(sequelize: any, DataTypes: any) {
        return super.init(
            {
                userId: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    primaryKey: true
                },
                type: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                flooring: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                music: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                location: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                locked: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false
                }
            },
            { sequelize, timestamps: false, tableName: 'user_igloos' }
        )
    }

}
