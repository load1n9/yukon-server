import {Plugin} from '../Plugin.ts'


export default class Moderation extends Plugin {
    public events: any;
    constructor(users: any, rooms: any) {
        super(users, rooms)
        this.events = {
            'mute_player': this.mutePlayer,
            'kick_player': this.kickPlayer,
            'ban_player': this.banPlayer
        }
    }

    mutePlayer(args: any, user: any) {

    }

    kickPlayer(args: any, user: any) {
        if (!user.isModerator) {
            return
        }

        let recipient = this.usersById[args.id]

        if (recipient && recipient.data.rank < user.data.rank) {
            recipient.close()
        }
    }

    async banPlayer(args: any, user: any) {
        if (!user.isModerator) {
            return
        }

        let recipient = this.usersById[args.id]
        let recipientRank = await this.getRecipientRank(recipient, args.id)

        if (recipientRank < user.data.rank) {
            await this.applyBan(user, args.id)

            if (recipient) {
                recipient.close()
            }
        }
    }

    async applyBan(moderator: any, id: any, hours = 24, message = '') {
        let expires = Date.now() + (hours * 60 * 60 * 1000)

        let banCount = await this.db.getBanCount(id)
        // 5th ban is a permanent ban
        if (banCount >= 4) {
            this.db.users.update({ permaBan: true }, { where: { id: id }})
        }

        this.db.bans.create({ userId: id, expires: expires, moderatorId: moderator.data.id, message: message })
    }

    async getRecipientRank(recipient: any, id: any) {
        return (recipient)
            ? recipient.data.rank
            : (await this.db.getUserById(id)).rank
    }

}
