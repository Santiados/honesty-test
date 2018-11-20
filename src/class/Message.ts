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
    getContent(){
        return this.content;
    }
    setContent(content){
        this.content = content
    }
    getId_User(){
        return this.id_user;
    }
    setId_User(id_user){
        this.id_user = id_user;
    }
    getId_Session(){
        return this.id_session;
    }
    setId_Session(id_session){
        this.id_session = id_session;
    }
    getCreation(){
        return this.creation;
    }
    setCreation(creation){
        this.creation = creation;
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

    completeMe(db){
        let aux: Message;
        db.child(this.id).on('value',snap =>{
            let op = snap.val();
            this.setContent(op.content);
            this.setCreation(op.creation);
            this.setId_Session(op.id_session);
            this.setId_User(op.id_user);
        }, error =>{

        });
    }

    delete(db) {

    }
}