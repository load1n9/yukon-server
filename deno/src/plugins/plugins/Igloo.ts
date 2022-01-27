import {Plugin }from '../Plugin.ts'


export default class Igloo extends Plugin {
    public events: any;
    constructor(users: any, rooms: any) {
        super(users, rooms)
        this.events = {
            'add_igloo': this.addIgloo,
            'add_furniture': this.addFurniture,
            'update_igloo': this.updateIgloo,
            'update_furniture': this.updateFurniture,
            'update_flooring': this.updateFlooring
        }
    }

    // Events

    async addIgloo(args: any, user: any) {

    }

    addFurniture(args: any, user: any) {
        let furniture = user.validatePurchase.furniture(args.furniture)
        if (!furniture) return

        // If furniture added successfuly
        if (user.furnitureInventory.add(args.furniture)) {
            user.updateCoins(-furniture.cost)
            user.send('add_furniture', { furniture: args.furniture, coins: user.data.coins })
        }
    }

    async updateIgloo(args: any, user: any) {
        let igloo = this.getIgloo(user.data.id)
        if (!args.type || !igloo || igloo != user.room || igloo.type == args.type) {
            return
        }

        // check crumb
        let iglooItem = true
        if (!iglooItem) return

        await igloo.clearFurniture()

        igloo.update({ type: args.type })
        igloo.update({ flooring: 0 })
        igloo.type = args.type
        igloo.flooring = 0

        // Refresh igloo
        igloo.refresh(user)
    }

    async updateFurniture(args: any, user: any) {
        let igloo = this.getIgloo(user.data.id)
        if (!Array.isArray(args.furniture) || !igloo || igloo != user.room) {
            return
        }

        await igloo.clearFurniture()

        let quantities = {}

        for (let item of args.furniture) {
            let id = item.furnitureId
            if (!item || !user.furnitureInventory.includes(id)) continue

            // Update quantity
            quantities[id] = (quantities[id]) ? quantities[id] + 1 : 1

            // Validate quantity
            if (quantities[id] > user.furnitureInventory.list[id]) continue

            igloo.furniture.push(item)
            this.db.userFurnitures.create({ ...item, userId: user.data.id })
        }
    }

    updateFlooring(args: any, user: any) {
        let igloo = this.getIgloo(user.data.id)
        if (!igloo || igloo != user.room) return

        let flooring = user.validatePurchase.flooring(args.flooring)
        if (!flooring) return

        igloo.update({ flooring: args.flooring })
        igloo.flooring = args.flooring

        user.updateCoins(-flooring.cost)
        user.send('update_flooring', { flooring: args.flooring, coins: user.data.coins })
    }

    // Functions

    getIgloo(id: any) {
        let internalId = id + 2000

        if (internalId in this.rooms) {
            return this.rooms[internalId]
        }
    }

}
