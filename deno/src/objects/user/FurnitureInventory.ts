export class FurnitureInventory {
    public db: any;
    public furnitures: any;
    public list: any;
    constructor(public user: any, inventory: any) {
        this.db = this.user.db
        this.furnitures = this.user.crumbs.furnitures
        this.list = inventory
    }

    includes(item: any) {
        return item in this.list
    }

    add(item: any) {
        if (this.includes(item)) {
            // Already maxed quantity
            if (this.list[item] >= this.furnitures[item].max) {
                return false
            }

            // Increase quantity
            this.list[item]++
            this.db.furnitureInventories.update({ quantity: this.list[item] },
                { where: { userId: this.user.data.id, itemId: item }})

        } else {
            // New item
            this.list[item] = 1

            this.db.furnitureInventories.create({ userId: this.user.data.id, itemId: item, quantity: 1 })
        }

        return true
    }

}
