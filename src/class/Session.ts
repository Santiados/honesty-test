export class Session {
    id: string;
    tipo: number;
    id_user1: string;
    username_user1: string;
    id_user2: string;
    username_user2: string;
    last_msg: string;
    last_msg_time: string;
    user_out: string;
    sessionOpen: string;
    creation: string;
    msgs: Array<any>;
    constructor(id = null, id_user1 = null, username_user1 = null, id_user2 = null, username_user2 = null, last_msg = null, last_msg_time = null, user_out = null, sessionOpen = null, creation = null) {
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

        if (last_msg) {
            this.last_msg = last_msg;
        }
        if (last_msg_time) {
            this.last_msg_time = last_msg_time;
        }
        if (sessionOpen) {
            this.sessionOpen = sessionOpen;
        }
        if (user_out) {
            this.user_out = user_out;
        } else {
            this.user_out = 'none'
        }
        if (creation) {
            this.creation = creation;
        }

        this.msgs = [];
    }

    setId(id) {
        this.id = id;
    }
    getId() {
        return this.id;
    }
    getId_User1(){
        return this.id_user1;
    }
    setId_User1(id) {
        this.id_user1 = id;
    }
    getId_User2(){
        return this.id_user2;
    }
    setId_User2(id) {
        this.id_user2 = id;
    }

    getLast_Msg() {
        return this.last_msg;
    }

    setLast_Msg(last_msg) {
        this.last_msg = last_msg;
    }
    getLast_Msg_Time() {
        return this.last_msg_time;
    }

    setLast_Msg_Time(last_msg_time) {
        this.last_msg_time = last_msg_time;
    }

    getSessionOpen() {
        return this.sessionOpen;
    }

    setSessionOpen(sessionId) {
        this.sessionOpen = sessionId;
    }

    getUserOut() {
        return this.user_out;
    }

    setUserOut(user_out) {
        this.user_out = user_out;
    }




    persist(db) {
        return new Promise((resolve, reject) => {
            if (!this.id) {
                this.creation = new Date().toJSON();
                db.push(this);
                db.on('child_added', snap => {
                    this.setId(snap.key);
                    db.child(snap.key).update({
                        id: snap.key
                    }, error => {
                        if (error) reject(error);
                    });
                });
            } else {
                db.child(this.id).update({
                    last_msg: this.last_msg,
                    last_msg_time: this.last_msg_time,
                    sessionOpen: this.sessionOpen
                }, error => {
                    reject(error)
                });
            }
            resolve('ok');
        });
    }

    delete(db) {

    }

    deleteUserFromSession() {

    }

    getSessionByIdUsers(db, id_user1, id_user2) {
        let aux = [];
        return new Promise((resolve, reject) => {
            db.on('value', snap => {
                snap.forEach(element => {
                    if (element.val().id_user1 == id_user1 && element.val().id_user2 == id_user2 || element.val().id_user1 == id_user2 && element.val().id_user2 == id_user1) {
                        let el = element.val();
                        let session = new Session(el.id, el.id_user1, el.username_user1, el.id_user2, el.username_user2, el.last_msg, el.last_msg_time, el.user_out, el.sessionOpen);
                        aux.push(session);
                    }
                });
                resolve(aux);
            }, error => {
                if (error) reject(error);
            });
        });
    }

    getSessionsByIdUser(db, id_user) {
        let aux = [];
        return new Promise((resolve, reject) => {
            db.on('value', snap => {
                snap.forEach(element => {
                    if (element.val().id_user1 == id_user || element.val().id_user2 == id_user) {
                        let el = element.val();
                        let session = new Session(el.id, el.id_user1, el.username_user1, el.id_user2, el.username_user2, el.last_msg, el.last_msg_time, el.user_out, el.sessionOpen);
                        aux.unshift(session);
                    }
                });
                resolve(aux);
            }, error => {
                reject(error);
            });
        });
    }
}