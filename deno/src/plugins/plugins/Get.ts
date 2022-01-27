import {Plugin }from '../Plugin.ts'



export default class Get extends Plugin {
    public events: any;
    constructor(users: any, rooms: any) {
        super(users, rooms)
        this.events = {
            'get_player': this.getPlayer
        }
    }

    async getPlayer(args: any, user: any) {
        if (!args.id) return

        let userData = await this.db.getUserById(args.id)
        let { banned, coins, loginKey, password, rank, ...penguin } = userData.dataValues

        if (userData) {
            user.send('get_player', { penguin: penguin })
        }
    }

}
