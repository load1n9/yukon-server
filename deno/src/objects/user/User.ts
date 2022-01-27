import { Buddy } from './Buddy.ts';
import { FurnitureInventory } from './FurnitureInventory.ts';
import { IglooInventory } from './IglooInventory.ts';
import { Ignore } from './Ignore.ts';
import { Inventory } from './Inventory.ts';
import { PurchaseValidator } from './PurchaseValidator.ts';


export class User {
    public db: any;
    public crumbs: any;
    public validatePurchase: PurchaseValidator;
    public data: any;
    public room: any;
    public x = 0;
    public y = 0;
    public frame = 1;
    public buddy: any;
    public ignore: any;
    public inventory: Inventory | undefined;
    public iglooInventory: IglooInventory | undefined;
    public furnitureInventory: FurnitureInventory | undefined;
    public waddle: any;
    public authenticated = false;
    public token: any = {};
    constructor(
        public socket: any,
        public handler: any
    ) {
        this.db = this.handler.db
        this.crumbs = this.handler.crumbs
        this.validatePurchase = new PurchaseValidator(this);
    }

    get string() {
        return {
            id: this.data.id,
            username: this.data.username,
            color: this.data.color,
            head: this.data.head,
            face: this.data.face,
            neck: this.data.neck,
            body: this.data.body,
            hand: this.data.hand,
            feet: this.data.feet,
            flag: this.data.flag,
            photo: this.data.photo,
            coins: this.data.coins,
            x: this.x,
            y: this.y,
            frame: this.frame,
            rank: this.data.rank
        }
    }

    get inWaddleGame() {
        return this.waddle && this.room.game && this.waddle.id == this.room.id
    }

    get isModerator() {
        return this.data.rank > 1
    }

    async setBuddies(buddies: any) {
        this.buddy = new Buddy(this)
        await this.buddy.init(buddies)
    }

    async setIgnores(ignores: any) {
        this.ignore = new Ignore(this)
        await this.ignore.init(ignores)
    }

    setInventory(inventory: any) {
        this.inventory = new Inventory(this, inventory)
    }

    setIglooInventory(inventory) {
        this.iglooInventory = new IglooInventory(this, inventory)
    }

    setFurnitureInventory(inventory) {
        this.furnitureInventory = new FurnitureInventory(this, inventory)
    }

    setItem(slot, item) {
        if (this.data[slot] == item) return

        this.data[slot] = item
        this.room.send(this, 'update_player', { id: this.data.id, item: item, slot: slot }, [])

        this.update({ [slot]: item })
    }

    updateCoins(coins) {
        this.data.coins += coins
        this.update({ coins: this.data.coins })
    }

    joinRoom(room, x = 0, y = 0) {
        if (!room || room === this.room) {
            return
        }

        if (room.isFull) {
            return this.send('error', { error: 'Sorry this room is currently full' })
        }

        this.room.remove(this)

        this.room = room
        this.x = x
        this.y = y
        this.frame = 1

        this.room.add(this)
    }

    update(query) {
        this.db.users.update(query, { where: { id: this.data.id } })
    }

    send(action, args = {}) {
        this.socket.emit('message', JSON.stringify({ action: action, args: args }))
    }

    close() {
        this.socket.disconnect(true)
    }

}
