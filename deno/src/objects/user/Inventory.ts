export class Inventory {
    public db: any;
    public items: any;
    public list: any;
    constructor(public user: any, inventory: any) {
        this.db = this.user.db
        this.items = this.user.crumbs.items
        this.list = inventory
    }

    includes(item: any) {
        return this.list.includes(item)
    }

    /**
     * Adds an item to the users inventory.
     *
     * @param {number} item - Item ID
     */
    add(item: number) {
        this.list.push(item)

        // Db query
        this.db.inventories.create({ userId: this.user.data.id, itemId: item })
    }

}
