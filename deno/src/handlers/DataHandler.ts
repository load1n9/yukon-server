import { Room } from '../objects/room/Room.ts'
import { WaddleRoom } from '../objects/room/WaddleRoom.ts'
import { PluginManager } from '../plugins/PluginManager.ts'


export class DataHandler {
    public usersById: any = {};
    public maxUsers: number;
    public crumbs: any = {};
    public rooms: { [key: string]: Room } = {};
    public plugins: PluginManager | undefined;

    constructor(
        public id: any, 
        public users: any, 
        public db: any, 
        public config: any
    ) {
        this.maxUsers = this.config.worlds[id].maxUsers;
        this.init();
    }

    async init() {
        this.crumbs = {
            items: await this.db.getItems(),
            igloos: await this.db.getIgloos(),
            furnitures: await this.db.getFurnitures(),
            floorings: await this.db.getFloorings()
        }

        this.rooms = await this.setRooms()

        await this.setWaddles()

        this.plugins = new PluginManager(this)

        this.updateWorldPopulation()
    }

    async setWaddles() {
        let waddles = await this.db.getWaddles()

        for (let waddle of waddles) {
            this.rooms[waddle.roomId].waddles[waddle.id] = new WaddleRoom(waddle)
        }
    }

    async setRooms() {
        let roomsData = await this.db.getRooms()
        let rooms = {}

        for (let data of roomsData) {
            rooms[data.id] = new Room(data)
        }

        return rooms
    }

    handle(message: string, user: any) {
        message.split('\xdd').filter(Boolean).forEach(packet => {
            try {
                let parsed = JSON.parse(packet)
                console.log(`[DataHandler] Received: ${parsed.action} ${JSON.stringify(parsed.args)}`)

                // Only allow game_auth until user is authenticated
                if (!user.authenticated && parsed.action != 'game_auth') {
                    return user.close()
                }

                this.fireEvent(parsed.action, parsed.args, user)

            } catch (error) {
                console.error(`[DataHandler] Error: ${error}`)
            }
        })
    }

    fireEvent(event: any, args: any, user: any) {
        this.plugins.getEvent(event, args, user)
    }

    close(user: any) {
        if (!user) {
            return
        }

        if (user.room) {
            user.room.remove(user)
        }

        if (user.buddy) {
            user.buddy.sendOffline()
        }

        if (user.waddle) {
            user.waddle.remove(user)
        }

        if (user.data && user.data.id && user.data.id in this.usersById) {
            delete this.usersById[user.data.id]
        }

        delete this.users[user.socket.id]

        this.updateWorldPopulation()
    }

    get population(): number {
        return Object.keys(this.users).length;
    }

    async updateWorldPopulation() {
        this.db.worlds.update({ population: this.population }, { where: { id: this.id } })
    }

}
