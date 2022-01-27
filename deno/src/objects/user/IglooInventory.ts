export class IglooInventory {
    public db: any;
    public igloos: any;
    public list: any;
    constructor(public user: any, inventory: any) {
        this.db = this.user.db
        this.igloos = this.user.crumbs.igloos
        this.list = inventory
    }

    includes(item: any) {
        return this.list.includes(item)
    }

}
