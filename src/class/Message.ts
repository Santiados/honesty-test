export class Message {
    id: string;
    content: string;
    id_user: string;
    id_session: string;
    creation: string;

    constructor(id = null, content = null, id_user = null, id_session = null) {
        if (id) {
            this.id = id;
        }
        if (content) {
            this.content = content;
        }
        if (id_user) {
            this.id_user = id_user;
        }
        if (id_session) {
            this.id_session = id_session;
        }
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    getMsgByIdUser(db) {

    }
    getMsgByIdSession(db) {

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
                // Modificar
            }
        });
    }

    delete(db) {

    }
}