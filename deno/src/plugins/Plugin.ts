export class Plugin {
    public db: any
    public users: any
    public usersById: any
    public config: any
    public crumbs: any
    public rooms: any
    constructor(public handler: any) {

        this.db = this.handler.db
        this.users = this.handler.users
        this.usersById = this.handler.usersById
        this.config = this.handler.config
        this.crumbs = this.handler.crumbs
        this.rooms = this.handler.rooms
    }

    get plugins() {
        return this.handler.plugins.plugins
    }

}
