import Sequelize from 'https://cdn.skypack.dev/sequelize';


export class Furnitures extends Sequelize.Model {

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
                type: {
                    type: DataTypes.INTEGER(1),
                    allowNull: false
                },
                sort: {
                    type: DataTypes.INTEGER(1),
                    allowNull: false
                },
                cost: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                member: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false
                },
                bait: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false
                },
                patched: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false
                },
                max: {
                    type: DataTypes.INTEGER(3),
                    allowNull: false
                },
                fps: {
                    type: DataTypes.INTEGER(2),
                    allowNull: true
                }
            },
            { sequelize, timestamps: false, tableName: 'furnitures' }
        )
    }

}
