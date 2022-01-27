import { Room } from './Room.ts';


export class Igloo extends Room {
    public db: any;
    constructor(data: any, db: any) {
        super(data);
        this.db = db;
    }

    get string() {
        return {
            igloo: this.userId,
            users: this.strings,
            type: this.type,
            flooring: this.flooring,
            music: this.music,
            location: this.location,
            furniture: this.furniture
        }
    }

    add(user: any) {
        this.users[user.socket.id] = user

        user.send('join_igloo', this.string)
        this.send(user, 'add_player', { user: user.string })
    }

    refresh(user: any) {
        for (let u of this.userValues) {
            u.x = 0
            u.y = 0
            u.frame = 1
        }
        this.send(user, 'join_igloo', this.string, [])
    }

    update(query: any) {
        this.db.userIgloos.update(query, { where: { userId: this.userId } })
    }

    async clearFurniture() {
        await this.db.userFurnitures.destroy({ where: { userId: this.userId } })
        this.furniture = []
    }

}
