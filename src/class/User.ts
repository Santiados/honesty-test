export class User {
    private id: string;
    private username: string;
    private email: string;
    private contacts: Array<User>;
    private state: string;
    private theme: string;
    private deleted: number;
    private creation: string;

    constructor(id = null, username = null, email = null, state = null, theme = null, deleted = 0, creation = null) {
        if (id) {
            this.id = id;
            this.email = email;
        }
        if (username) {
            this.username = username;
        }
        if (email) {
            this.email = email;
        }
        if (state) {
            this.state = state;
        }
        if (theme) {
            this.theme = theme;
        } else {
            this.theme = 'secondary';
        }
        if(deleted){
            this.deleted = deleted;
        }else {
            this.deleted = 0;
        }
        if (creation) {
            this.creation = creation;
        }
        this.contacts = [];
    }


    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    setCreation(date) {
        this.creation = date;
    }

    getCreation() {
        return this.creation;
    }

    getContacts() {
        return this.contacts;
    }
    setContacts(contacts) {
        this.contacts = contacts;
    }
    getEmail() {
        return this.email;
    }
    setEmail(email) {
        this.email = email;
    }

    getUsername() {
        return this.username;
    }
    setUsername(username) {
        this.username = username;
    }

    getState() {
        return this.state;
    }
    setState(state) {
        this.state = state;
    }
    getTheme() {
        return this.theme;
    }
    setTheme(theme) {
        this.state = theme;
    }
    getDeleted(){
        return this.deleted;
    }
    setDeleted(deleted){
        this.deleted = deleted;
    }

    persist(db) {
        if (!this.creation) {
            db.child(this.id).set({
                id: this.id,
                username: this.username,
                email: this.email,
                state: this.state,
                theme: this.theme,
                deleted: this.deleted,
                creation: new Date().toJSON(),
            });
        } else {
            // Modificar perfil
        }
    }

    getUserById(db, id_user) {
        return new Promise((resolve, reject) => {
            db.child(id_user).on('value', snap => {
                this.setId(snap.val().id);
                this.setCreation(new Date(snap.val().creation));
                this.setEmail(snap.val().email);
                this.setUsername(snap.val().username);
                this.setState(snap.val().state);
                this.setTheme(snap.val().theme);
                resolve(this);
            });
        });
    }

    addContact(db, new_contact, to) {
        return new Promise((resolve, reject) => {
            db.child(to.id).child('contacts').push({
                id: new_contact.id,
                username: new_contact.username
            }, error => {
                if (error) reject(error)
            });
            resolve('ok');
        });
    }

    getContactsById(db) {
        return new Promise((resolve, reject) => {
            db.child(this.id).child('contacts').on('value', snap => {
                let aux = [];
                console.log('heeeey')
                snap.forEach(element => {
                    let el = element.val();
                    let user = new User(el.id, el.username, el.email);
                    aux.push(user);
                });
                resolve(aux);
            });
        });
    }

    getUsersBySearching(db, search, who_search) {
        return new Promise((resolve, reject) => {
            db.on('value', data => {
                let aux = [];
                data.forEach(element => {
                    let con = element.val()
                    if (con.username.toLowerCase().includes(search.toLowerCase()) && con.state == 'publico' && con.username != who_search.getUsername()) {
                        let fecha = 'Se unio el: ' + (new Date(con.creation).getDate()) + '/' + (new Date(con.creation).getMonth()+1) + '/' + (new Date(con.creation).getFullYear());
                        let user = new User(con.id, con.username, con.email, con.state, con.theme,con.deleted, fecha);
                        aux.push(user);
                    }
                    if (who_search.getContacts().length > 0) {
                        who_search.getContacts().forEach(user_contact => {
                            aux.forEach((found_contact, i) => {
                                if (found_contact.getUsername() == user_contact.username) {
                                    aux.splice(i, 1);
                                }
                            });
                        });
                    }
                });
                resolve(aux);
            }, error => {
                if (error) reject(error)
            });
        });
    }

    delete(dbSessions,dbUsers,user){
        return new Promise((resolve,reject)=>{
            dbSessions.on('value', data =>{
                data.forEach(element => {
                    let el = element.val();
                    console.log(el.id)
                    if((el.id_user1 == user.getId() || el.id_user2 == user.getId()) && !el.user_out.includes(user.getUsername())){
                        console.log(user.getId())
                        dbSessions.child(el.id).update({
                            user_out: user.getUsername(),
                            last_msg: user.getUsername() + ' ha decidido marcharse',
                            last_msg_time: new Date().toJSON()
                        });
                    }
                });
                dbUsers.child(user.getId()).update({
                    deleted: 1
                });
                resolve('ok');
            }, error => {
                if(error) reject(error);
            });
        });
    }
}