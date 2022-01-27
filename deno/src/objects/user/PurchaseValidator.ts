export class PurchaseValidator {
    public crumbs: any;
    constructor(public user: any) {
        this.crumbs = this.user.crumbs
    }

    item(id: any) {
        return this.validate(id, 'items', this.user.inventory)
    }

    igloo(id: any) {

    }

    furniture(id: any) {
        return this.validate(id, 'furnitures')
    }

    flooring(id: any) {
        return this.validate(id, 'floorings', [this.user.room.flooring])
    }

    validate(id: any, type: any, includes: any = []) {
        let item = this.crumbs[type][id]

        if (!item) {
            return false

        } else if (item.cost > this.user.data.coins) {
            this.user.send('error', { error: 'You need more coins.' })
            return false

        } else if (includes.includes(id)) {
            this.user.send('error', { error: 'You already have this item.' })
            return false

        } else if (item.patched) {
            this.user.send('error', { error: 'This item is not currently available.' })
            return false

        } else {
            return item
        }
    }

}
