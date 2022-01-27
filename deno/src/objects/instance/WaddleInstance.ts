export class WaddleInstance {
    public users: any[];
    public ready: any = [];
    public started = false;
    public payouts: any = [];
    public minPayout = 5;
    constructor(waddle: any) {
        this.users = [...waddle.users]
    }

    init() {
        for (let user of this.users) {
            user.waddle = this
            user.joinRoom(user.handler.rooms[this.id])
        }
    }

    // Events

    startGame(user: any) {
        if (!this.started && !this.ready.includes(user)) {
            this.ready.push(user)

            this.checkStart()
        }
    }

    sendMove(args: any, user: any) {
        // To be overridden in derived class
    }

    // Functions

    getPayout(user: any, score: number) {
        this.remove(user)

        return this.payouts[score] || this.minPayout
    }

    checkStart() {
        // Compare with non null values in case user disconnects
        if (this.ready.length == this.users.filter(Boolean).length) {
            this.gameReady()
        }
    }

    gameReady() {
        this.started = true
    }

    remove(user: any) {
        // Remove from users
        let seat = this.users.indexOf(user)
        this.users[seat] = null

        // Remove from ready
        this.ready = this.ready.filter(u => u != user)

        user.waddle = null

        if (!this.started) {
            this.checkStart()
        }
    }

    send(action: any, args: any = {}, user: any = null, filter: any = [user]) {
        let users = this.users.filter(u => !filter.includes(u)).filter(Boolean)

        for (let u of users) {
            u.send(action, args)
        }
    }

}
