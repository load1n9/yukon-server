import {WaddleInstance} from './WaddleInstance.ts'


export class SledInstance extends WaddleInstance {
    public id = 999;
    public payouts = [20, 10, 5, 5];
    constructor(waddle: any) {
        super(waddle)
    }

    // Events

    sendMove(args: any, user: any) {
        this.send('send_move', { id: args.id, x: args.x, y: args.y, time: args.time }, user)
    }

    // Functions

    gameReady() {
        let users = this.users.filter(Boolean).map(user => {
            return {
                username: user.data.username,
                color: user.data.color,
                hand: user.data.hand
            }
        })

        this.send('start_game', { seats: this.users.length, users: users })

        super.gameReady()
    }

}
