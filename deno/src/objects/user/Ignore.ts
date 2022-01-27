export class Ignore {
    public list: any[] = [];
    public db: any;
    constructor(public user: any) {
        this.db = this.user.db
    }

    get flat() {
        return this.list.map(buddy => buddy.id)
    }

    async init(ignores: any) {
        for (let ignore of ignores) {
            let user = await this.db.getUserById(ignore)
            this.list.push({ id: user.id, username: user.username })
        }
    }

    includes(ignore: any) {
        return this.flat.includes(ignore)
    }

    addIgnore(id: any, username: string) {
        this.list.push({ id: id, username: username })
        this.user.send('ignore_add', { id: id, username: username })
    }

    removeIgnore(id: any) {
        // Filter ignore out of list
        this.list = this.list.filter(obj => obj.id != id)
        this.user.send('ignore_remove', { id: id })
    }

}
