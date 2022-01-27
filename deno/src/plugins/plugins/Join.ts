import {Plugin} from '../Plugin.ts'
import {Igloo} from '../../objects/room/Igloo.ts'


export default class Join extends Plugin {
    public events: any;
    constructor(users: any, rooms: any) {
        super(users, rooms)
        this.events = {
            'load_player': this.loadPlayer,
            'join_server': this.joinServer,
            'join_room': this.joinRoom,
            'join_igloo': this.joinIgloo
        }
    }

    // Events

    loadPlayer(args: any, user: any) {
        user.room = this.getRandomSpawn()

        user.send('load_player', {
            user: user.string,
            room: user.room.id,

            joinTime: user.data.joinTime,

            buddies: user.buddy.list,
            ignores: user.ignore.list,
            inventory: user.inventory.list,
            igloos: user.iglooInventory.list,
            furniture: user.furnitureInventory.list
        })
    }

    joinServer(args: any, user: any) {
        // Update token on database now that user has fully connected
        if (user.token.oldSelector) {
            this.db.authTokens.destroy({ where: { userId: user.data.id, selector: user.token.oldSelector } })
        }

        if (user.token.selector && user.token.validatorHash) {
            this.db.authTokens.create({ userId: user.data.id, selector: user.token.selector, validator: user.token.validatorHash })
        }

        user.room.add(user)
    }

    // Limit this to 1/2 uses per second
    joinRoom(args: any, user: any) {
        user.joinRoom(this.rooms[args.room], args.x, args.y)
    }

    async joinIgloo(args: any, user: any) {
        let igloo = await this.getIgloo(args.igloo)
        user.joinRoom(igloo, args.x, args.y)
    }

    // Functions

    getRandomSpawn() {
        let spawns = Object.values(this.rooms).filter(room => room.spawn && !room.isFull)

        // All spawns full
        if (!spawns.length) {
            spawns = Object.values(this.rooms).filter(room => !room.game && !room.isFull)
        }

        return spawns[Math.floor(Math.random() * spawns.length)]
    }

    async getIgloo(id: any) {
        let internalId = id + 2000 // Ensures igloos are above all default rooms

        if (!(internalId in this.rooms)) {
            let igloo = await this.db.getIgloo(id)
            if (!igloo) return null

            this.rooms[internalId] = new Igloo(igloo, this.db)
        }

        return this.rooms[internalId]
    }

}
