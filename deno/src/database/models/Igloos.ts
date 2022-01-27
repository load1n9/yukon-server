import Sequelize from 'https://cdn.skypack.dev/sequelize';


export class Igloos extends Sequelize.Model {

    static init(sequelize: any, DataTypes: any) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    primaryKey: true
                },
                name: {
                    type: DataTypes.STRING(50),
                    allowNull: false
                },
                cost: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    defaultValue: 0
                },
                patched: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: 0
                }
            },
            { sequelize, timestamps: false, tableName: 'igloos' }
        )
    }

}
