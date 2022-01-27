export class Buddy {
    public usersById: any;
    public db: any;
    public list: any = [];
    public requests: any = [];
    constructor(public user: any) {
        this.usersById = this.user.handler.usersById
        this.db = this.user.db
    }

    get flat() {
        return this.list.map(buddy => buddy.id)
    }

    async init(buddies: any[]) {
        for (let buddy of buddies) {
            let user = await this.db.getUserById(buddy)
            let online = this.isOnline(user.id)

            // Online status here is only used on initial load or adding of a new buddy,
            // further requests should use isOnline to stay updated.
            this.list.push({ id: user.id, username: user.username, online: online })

            // Send online status to buddy
            if (online) this.sendOnline(user.id)
        }
    }

    includes(buddy: any) {
        return this.flat.includes(buddy)
    }

    addRequest(id: any, username: string) {
        if (this.user.data.id == id) return
        // If user is ignored
        if (this.user.ignore.includes(id)) return
        // If buddy already added
        if (this.includes(id)) return
        // If request has already been received
        if (this.requests.includes(id)) return

        this.requests.push(id)
        this.user.send('buddy_request', { id: id, username: username })
    }

    addBuddy(id: any, username: string, requester = false) {
        let online = this.isOnline(id)

        this.list.push({ id: id, username: username, online: online })
        this.user.send('buddy_accept', { id: id, username: username, requester: requester, online: online })
    }

    removeBuddy(id: any) {
        // Filter buddy out of list
        this.list = this.list.filter(obj => obj.id != id)
        this.user.send('buddy_remove', { id: id })
    }

    /*========== Online status ==========*/

    isOnline(id: any) {
        return id in this.usersById
    }

    sendOnline(id: any) {
        let user = this.usersById[id]

        user.send('buddy_online', { id: this.user.data.id })
    }

    sendOffline() {
        for (let buddy of this.list) {
            if (this.isOnline(buddy.id)) {
                let user = this.usersById[buddy.id]

                user.send('buddy_offline', { id: this.user.data.id })
            }
        }
    }

}
