import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import crypto from 'https://deno.land/std@0.122.0/node/crypto.ts';
import jwt from 'https://cdn.skypack.dev/jsonwebtoken';
import { v4 as uuid } from 'https://cdn.skypack.dev/uuid';

import {Plugin }from '../Plugin.ts'



export default class GameAuth extends Plugin {
    public events: any;
    constructor(users: any, rooms: any) {
        super(users, rooms)
        this.events = {
            'game_auth': this.gameAuth
        }
    }

    // Events

    async gameAuth(args: any, user: any) {
        // Already authenticated
        if (user.authenticated) {
            return
        }

        let userData = await user.db.getUserByUsername(args.username)
        if (!userData) {
            return user.close()
        }

        user.data = userData

        // Full server
        if (this.handler.population > this.handler.maxUsers && !user.isModerator) {
            return user.close()
        }

        // Check banned
        let activeBan = await user.db.getActiveBan(user.data.id)
        if (activeBan || user.data.permaBan) {
            return user.close()
        }

        this.compareLoginKey(args, user)
    }

    // Functions

    async compareLoginKey(args: any, user: any) {
        let decoded: any;
        let token: any;

        // Verify JWT
        try {
            decoded = jwt.verify(user.data.loginKey, this.config.crypto.secret)
        } catch (_err: any) {
            return user.close()
        }

        // Verify hash
        let address = user.socket.handshake.address
        let userAgent = user.socket.request.headers['user-agent']
        let match = await bcrypt.compare(`${user.data.username}${args.key}${address}${userAgent}`, decoded.hash)

        if (!match) {
            return user.close()
        }

        // Remove login key from database
        user.update({ loginKey: null })

        // Set selector for token destruction
        if (args.token) {
            user.token.oldSelector = args.token
        }

        // Create new token
        if (args.createToken) {
            token = await this.genAuthToken(user)
        }

        // Disconnect if already logged in
        if (user.data.id in this.usersById) {
            this.usersById[user.data.id].close()
        }

        // Success
        this.usersById[user.data.id] = user

        await user.setBuddies(await user.db.getBuddies(user.data.id))
        await user.setIgnores(await user.db.getIgnores(user.data.id))
        user.setInventory(await user.db.getInventory(user.data.id))
        user.setIglooInventory(await user.db.getIglooInventory(user.data.id))
        user.setFurnitureInventory(await user.db.getFurnitureInventory(user.data.id))

        user.authenticated = true

        // Send response
        user.send('game_auth', { success: true })
        if (token) {
            user.send('auth_token', { token: token })
        }

        // Update world population
        await this.handler.updateWorldPopulation()
    }

    async genAuthToken(user: any) {
        let selector = uuid()
        let validator = crypto.randomBytes(32).toString('hex')
        let validatorHash = await bcrypt.hash(validator, this.config.crypto.rounds)

        user.token.selector = selector
        user.token.validatorHash = validatorHash

        return `${selector}:${validator}`
    }

}
