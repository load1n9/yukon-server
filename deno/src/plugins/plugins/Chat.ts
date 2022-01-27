import {Plugin} from '../Plugin.ts'

import profaneWords from 'https://cdn.skypack.dev/profane-words';


export default class Chat extends Plugin {
    public events: any;
    public commands: any;
    constructor(users: any, rooms: any) {
        super(users, rooms)
        this.events = {
            'send_message': this.sendMessage,
            'send_safe': this.sendSafe,
            'send_emote': this.sendEmote
        }

        this.commands = {
            'ai': this.addItem,
            'users': this.userPopulation
        }

        this.bindCommands()
    }

    // Events

    sendMessage(args: any, user: any) {
        // Todo: message validation
        if (args.message.startsWith('!')) {
            return this.processCommand(args.message.substring(1), user)
        }

        if (profaneWords.some((word) => args.message.toLowerCase().indexOf(word) >= 0)) {
            return
        }

        user.room.send(user, 'send_message', { id: user.data.id, message: args.message }, [user], true)
    }

    sendSafe(args: any, user: any) {
        user.room.send(user, 'send_safe', { id: user.data.id, safe: args.safe }, [user], true)
    }

    sendEmote(args: any, user: any) {
        user.room.send(user, 'send_emote', { id: user.data.id, emote: args.emote }, [user], true)
    }

    // Commands

    bindCommands() {
        for (let command in this.commands) {
            this.commands[command] = this.commands[command].bind(this)
        }
    }

    processCommand(message: any, user: any) {
        let args = message.split(' ')
        let command = args.shift()

        if (command in this.commands) {
            return this.commands[command](args, user)
        }
    }

    addItem(args: any, user: any) {
        if (user.isModerator) {
            this.plugins.item.addItem({ item: args[0] }, user)
        }
    }

    userPopulation(args: any, user: any) {
        user.send('error', { error: `Users online: ${this.handler.population}` })
    }

}
