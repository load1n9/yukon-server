import Sequelize from 'https://cdn.skypack.dev/sequelize';



export class Worlds extends Sequelize.Model {

    static init(sequelize: any, DataTypes: any) {
        return super.init(
            {
                id: {
                    type: DataTypes.STRING(3),
                    allowNull: false,
                    primaryKey: true
                },
                population: {
                    type: DataTypes.INTEGER(3),
                    allowNull: false,
                    defaultvalue: 0
                }
            },
            { sequelize, timestamps: false, tableName: 'worlds' }
        )
    }

}
