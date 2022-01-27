import {Plugin} from '../Plugin.ts'


export default class Actions extends Plugin {
    public events: any;
    constructor(users: any, rooms: any) {
        super(users, rooms)
        this.events = {
            'send_position': this.sendPosition,
            'send_frame': this.sendFrame,
            'snowball': this.snowball
        }
    }

    sendPosition(args: any, user: any) {
        user.x = args.x
        user.y = args.y
        user.frame = 1

        user.room.send(user, 'send_position', { id: user.data.id, x: args.x, y: args.y })
    }

    sendFrame(args: any, user: any) {
        if (args.set) {
            user.frame = args.frame
        } else {
            user.frame = 1
        }

        user.room.send(user, 'send_frame', { id: user.data.id, frame: args.frame, set: args.set })
    }

    snowball(args: any, user: any) {
        user.room.send(user, 'snowball', { id: user.data.id, x: args.x, y: args.y })
    }

}
