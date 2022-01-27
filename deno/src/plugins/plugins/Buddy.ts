import { Plugin } from '../Plugin.ts'


export default class Buddy extends Plugin {
    public events: any;
    constructor(users: any, rooms: any) {
        super(users, rooms)
        this.events = {
            'buddy_request': this.buddyRequest,
            'buddy_accept': this.buddyAccept,
            'buddy_reject': this.buddyReject,
            'buddy_remove': this.buddyRemove,
            'buddy_find': this.buddyFind
        }
    }

    buddyRequest(args: any, user: any) {
        let recipient = this.usersById[args.id]

        // Send request to recipient if they are online
        if (recipient) {
            recipient.buddy.addRequest(user.data.id, user.data.username)
        }
    }

    buddyAccept(args: any, user: any) {
        if (user.buddy.includes(args.id)) return
        if (user.ignore.includes(args.id)) return
        if (!(user.buddy.requests.includes(args.id))) return

        // Remove request
        user.buddy.requests = user.buddy.requests.filter(item => item != args.id)

        // Add to recipient buddy list
        user.buddy.addBuddy(args.id, args.username)

        // Add to requester buddy list
        let requester = this.usersById[args.id]
        if (requester) {
            requester.buddy.addBuddy(user.data.id, user.data.username, true)
        }

        // Db queries
        this.db.buddies.create({ userId: user.data.id, buddyId: args.id })
        this.db.buddies.create({ userId: args.id, buddyId: user.data.id })
    }

    buddyReject(args: any, user: any) {
        // Remove request
        user.buddy.requests = user.buddy.requests.filter(item => item != args.id)
    }

    buddyRemove(args: any, user: any) {
        if (!user.buddy.includes(args.id)) return

        user.buddy.removeBuddy(args.id)

        let buddy = this.usersById[args.id]
        if (buddy) buddy.buddy.removeBuddy(user.data.id)

        this.db.buddies.destroy({ where: { userId: user.data.id, buddyId: args.id } })
        this.db.buddies.destroy({ where: { userId: args.id, buddyId: user.data.id } })
    }

    buddyFind(args: any, user: any) {
        if (user.buddy.includes(args.id) && args.id in this.usersById) {
            let buddy = this.usersById[args.id]

            if (buddy.room) user.send('buddy_find', { find: `${buddy.data.username} ${buddy.room.find}` })
        }
    }

}
