import {Plugin} from '../Plugin.ts'


export default class Waddle extends Plugin {
    public events: any;
    constructor(users: any, rooms: any) {
        super(users, rooms)
        this.events = {
            'get_waddles': this.getWaddles,
            'join_waddle': this.joinWaddle,
            'leave_waddle': this.leaveWaddle
        }
    }

    getWaddles(args: any, user: any) {
        // let waddles = Object.fromEntries(Object.values(user.room.waddles).map(waddle => {
        //     let users = waddle.users.map(user => user ? user.data.username : null)

        //     return [waddle.id, users]
        // }))

        // user.send('get_waddles', { waddles: waddles })
    }

    joinWaddle(args: any, user: any) {
        // let waddle = user.room.waddles[args.id]

        // if (waddle && waddle.users.includes(null) && !user.waddle) {
        //     waddle.add(user)
        // }
    }

    leaveWaddle(args: any, user: any) {
        // if (user.waddle) {
        //     user.waddle.remove(user)
        // }
    }

}
