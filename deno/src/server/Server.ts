import RateLimiterFlexible from 'https://cdn.skypack.dev/rate-limiter-flexible';
import socketIo from 'https://cdn.skypack.dev/socket.io';
import http from "https://deno.land/std@0.122.0/node/http.ts";
import https from "https://deno.land/std@0.122.0/node/https.ts";
import * as fs from "https://deno.land/std@0.122.0/fs/mod.ts";
import { User } from '../objects/user/User.ts';


export class Server {
    public rateLimiter: any;
    public server: any;
    constructor(
        id: any,
        public users: any,
        public db: any,
        public handler: any,
        config: any
    ) {

        let io = this.createIo(config.socketio, {
            cors: {
                origin: config.cors.origin,
                methods: ['GET', 'POST']
            },
            path: '/'
        })

        this.rateLimiter = new RateLimiterFlexible.RateLimiterMemory({
            // 20 events allowed per second
            points: 20,
            duration: 1
        })

        this.server = io.listen(config.worlds[id].port)
        this.server.on('connection', this.connectionMade.bind(this))

        console.log(`[Server] Started world ${id} on port ${config.worlds[id].port}`)
    }

    createIo(config: any, options: any) {
        let server = (config.https)
            ? this.httpsServer(config.ssl)
            : this.httpServer()

        return socketIo(server, options)
    }

    httpServer() {
        return http.createServer()
    }

    httpsServer(ssl: any) {
        let loaded: any = {}

        // Loads ssl files
        for (let key in ssl) {
            loaded[key] = fs.readFileSync(ssl[key]).toString()
        }

        return https.createServer(loaded)
    }

    connectionMade(socket: any) {
        console.log(`[Server] Connection from: ${socket.id}`)
        let user = new User(socket, this.handler)
        this.users[socket.id] = user

        socket.on('message', (message) => this.messageReceived(message, user))
        socket.on('disconnect', () => this.connectionLost(user))
    }

    messageReceived(message: any, user: any) {
        // Consume 1 point per event from IP address
        this.rateLimiter.consume(user.socket.handshake.address)
            .then(() => {
                // Allowed
                this.handler.handle(message, user)
            })
            .catch(() => {
                // Blocked
            })
    }

    connectionLost(user: any) {
        console.log(`[Server] Disconnect from: ${user.socket.id}`)
        this.handler.close(user)
    }

}
