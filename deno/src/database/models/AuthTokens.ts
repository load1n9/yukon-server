import Sequelize from 'https://cdn.skypack.dev/sequelize';



export class AuthTokens extends Sequelize.Model {

    static init(sequelize: any, DataTypes: any) {
        return super.init(
            {
                userId: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    primaryKey: true
                },
                selector: {
                    type: DataTypes.STRING(36),
                    allowNull: false,
                    primaryKey: true
                },
                validator: {
                    type: DataTypes.STRING(60),
                    allowNull: false
                },
                timestamp: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
                }
            },
            { sequelize, timestamps: false, tableName: 'auth_tokens' }
        )
    }

}
