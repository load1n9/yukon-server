export class Room {
    public users: any = {}

    // Only used by rooms with waddles
    public waddles: any = {}
    constructor(data: any) {
        Object.assign(this, data)

        this.users = {}

        // Only used by rooms with waddles
        this.waddles = {}
    }

    get userValues() {
        return Object.values(this.users)
    }

    get strings() {
        return this.userValues.map(user => user.string)
    }

    get isFull() {
        return Object.keys(this.users).length >= this.maxUsers
    }

    add(user: any) {
        this.users[user.socket.id] = user

        if (this.game) {
            return user.send('join_game', { room: this.id })
        }

        user.send('join_room', { room: this.id, users: this.strings })
        this.send(user, 'add_player', { user: user.string })
    }

    remove(user: any) {
        if (!this.game) {
            this.send(user, 'remove_player', { user: user.data.id })
        }

        delete this.users[user.socket.id]
    }

    /**
     * Sends a packet to all users in the room, by default the client is excluded.
     *
     * @param {User} user - Client User object
     * @param {string} action - Packet name
     * @param {object} args - Packet arguments
     * @param {Array} filter - Users to exclude
     * @param {boolean} checkIgnore - Whether or not to exclude users who have user added to their ignore list
     */
    send(user: any, action: any, args: any = {}, filter: any = [user], checkIgnore = false) {
        const users = this.userValues.filter(u => !filter.includes(u))

        for (let u of users) {
            if (checkIgnore && u.ignore.includes(user.data.id)) continue

            u.send(action, args)
        }
    }

}
