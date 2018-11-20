export class Session {
    id: string;
    tipo: number;
    id_user1: string;
    username_user1: string;
    id_user2: string;
    username_user2: string;
    msgs: Array<any>;
    last_msg: string;
    creation: string;
    constructor(id = null, id_user1 = null, username_user1 = null, id_user2 = null, username_user2 = null, last_msg = null, msgs = null) {
        if (id) {
            this.id = id;
        }
        if (id_user1) {
            this.id_user1 = id_user1;
            this.username_user1 = username_user1;
        }
        if (id_user2) {
            this.id_user2 = id_user2;
            this.username_user2 = username_user2;
        }

        this.msgs = [];
    }

    setId(id) {
        this.id = id;
    }
    getId() {
        return this.id;
    }

    setId_User1(id) {
        this.id_user1 = id;
    }
    setId_User2(id) {
        this.id_user2 = id;
    }

    protected getSessionsByIdUser(db, id_user) {
        let aux = [];
        db.on('value', snap => {
            snap.forEach(element => {
                if (element.hasChild(id_user)) {
                    aux.push(element);
                }
            });
        });
        return aux;
    }
    persist(db) {
        return new Promise((resolve, reject) => {
            if (!this.creation) {
                this.creation = new Date().toLocaleString();
                db.push(this);
                db.on('child_added', snap => {
                    this.setId(snap.key);
                    db.child(snap.key).update({
                        id: snap.key
                    }, error => {
                        if (error) reject(error);
                        else resolve(this);
                    });
                });
            } else {

            }
        });
    }

    delete(db) {

    }

    deleteUserFromSession() {

    }
}