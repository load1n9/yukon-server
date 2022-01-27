import * as fs from "https://deno.land/std@0.122.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.122.0/path/mod.ts";
import Sequelize from 'https://cdn.skypack.dev/sequelize';

const Op = Sequelize.Op;

const __dirname = new URL('.', import.meta.url).pathname;

export class Database {
    public sequelize: Sequelize;
    public slots: string[] = [ 'color', 'head', 'face', 'neck', 'body', 'hand', 'feet', 'flag', 'photo', 'award' ]
    public dir = `${__dirname}/models`;
    public model: any = {}

    constructor(config: any) {
        this.sequelize = new Sequelize(
            config.database,
            config.user,
            config.password, {
                host: config.host,
                dialect: config.dialect,
                logging: (config.debug) ? console.log : false
        });
        this.loadModels();

        this.sequelize
            .authenticate()
            .then(() => {
                // Connected
            })
            .catch((error: any) => {
                console.error(`[Database] Unable to connect to the database: ${error}`)
            });
    }

    loadModels() {
        fs.readdirSync(this.dir).forEach((model: any) => {
            let modelImport = require(path.join(this.dir, model)).default
            let modelObject = modelImport.init(this.sequelize, Sequelize)

            let name = model.charAt(0).toLowerCase() + model.slice(1, -3)

            this.model[name] = modelObject
        })
    }

    async getItems() {
        let items = await this.getCrumb('items')
        items.slots = this.slots
        return items
    }

    async getIgloos() {
        return await this.getCrumb('igloos')
    }

    async getFurnitures() {
        return await this.getCrumb('furnitures')
    }

    async getFloorings() {
        return await this.getCrumb('floorings')
    }

    async getRooms() {
        return await this.findAll('rooms', {
            raw: true
        })
    }

    async getWaddles() {
        return await this.findAll('waddles', {
            raw: true
        })
    }

    async getUserByUsername(username: string) {
        return await this.findOne('users', {
            where: { username: username }
        })
    }

    async getUserById(userId: string | number) {
        return await this.findOne('users', {
            where: { id: userId }
        })
    }

    async getAuthToken(userId: string | number, selector: any) {
        return await this.findOne('authTokens', {
            where: { userId: userId, selector: selector }
        })
    }

    async getActiveBan(userId: string | number) {
        return await this.findOne('bans', {
            where: {
                userId: userId,
                expires: {
                    [Op.gt]: Date.now()
                }
            }
        })
    }

    async getBanCount(userId:string | number) {
        return await this.bans.count({
            where: { userId: userId }
        })
    }

    async getBuddies(userId: string | number) {
        return await this.findAll('buddies', {
            where: { userId: userId },
            attributes: ['buddyId']

        }, [], (result: any) => {
            return result.map((result: any) => result.buddyId)
        })
    }

    async getIgnores(userId: string | number) {
        return await this.findAll('ignores', {
            where: { userId: userId },
            attributes: ['ignoreId']

        }, [], (result: any) => {
            return result.map((result: any) => result.ignoreId)
        })
    }

    async getInventory(userId: string | number) {
        return await this.findAll('inventories', {
            where: { userId: userId },
            attributes: ['itemId']

        }, [], (result) => {
            return result.map(result => result.itemId)
        })
    }

    async getIglooInventory(userId: string | number) {
        return await this.findAll('iglooInventories', {
            where: { userId: userId },
            attributes: ['iglooId']

        }, [], (result) => {
            return result.map(result => result.iglooId)
        })
    }

    async getFurnitureInventory(userId: string | number) {
        return await this.findAll('furnitureInventories', {
            where: { userId: userId },
            attributes: ['itemId', 'quantity'],
            raw: true

        }, {}, (result) => {
            return this.arrayToObject(result, 'itemId', 'quantity')
        })
    }

    async getIgloo(userId: string | number) {
        return await this.findOne('userIgloos', {
            where: { userId: userId },
            raw: true

        }, null, async (result) => {
            // Add furniture to igloo object
            result.furniture = await this.getUserFurnitures(userId)
            return result
        })
    }

    async getUserFurnitures(userId: string | number) {
        return await this.findAll('userFurnitures', {
            where: { userId: userId },
            raw: true

        }, [], (result) => {
            // Removes user id from all objects in furniture array
            return result.map(({ userId, ...furnitures}) => furnitures)
        })
    }

    async getWorldPopulations() {
        return await this.getCrumb('worlds')
    }

    /*========== Helper functions ==========*/

    findOne(table: any, options: any = {}, emptyReturn: any = null, callback: any = null) {
        return this.find('findOne', table, options, emptyReturn, callback)
    }

    findAll(table: any, options: any = {}, emptyReturn: any = null, callback: any = null) {
        return this.find('findAll', table, options, emptyReturn, callback)
    }

    find(find: any, table: any, options: any, emptyReturn: any, callback: any) {
        return this.model[table][find](options).then((result) => callback && result ? callback(result) : result? result : emptyReturn);
    }

    async getCrumb(table: any) {
        return await this.findAll(table, {
            raw: true
        }, {}, (result) => this.arrayToObject(result, 'id'));
    }

    arrayToObject(array: any[], key: string, value: any = null) {
        return array.reduce((obj, item) => {
            // If a value is passed in then the key will be mapped to item[value]
            let result = (value) ? item[value] : item

            obj[item[key]] = result
            delete item[key]

            return obj
        }, {})
    }

}
