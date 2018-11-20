export class User {
    id_user: string;
    username: string;
    email: string;
    contacts: Array<User>;
    creation: string;

    constructor(id = null, username = null, email = null, creation = null) {
        if(id){
            this.id_user = id;
            this.email = email;
        }
        if(username){
            this.username = username;
        }
        if(email){
            this.email = email;
        }
        if(creation){
            this.creation = new Date(creation).toLocaleString();
        }
        this.contacts = [];
    }


    setId(id){
        this.id_user = id;
    }

    getId(){
        return this.id_user;
    }

    setCreation(date){
        this.creation = date;
    }

    getCreation(){
        return this.creation;
    }

    getContacts(){
        return this.contacts;
    }
    setContacts(contacts){
        this.contacts = contacts;
    }

    persist(db) {
        if (!this.creation) {
            db.child(this.id_user).set({
                id_user: this.id_user,
                username: this.username,
                email: this.email,
                creation: new Date().toLocaleString()
            });
        } else {
            // Modificar perfil
        }
    }

    getUserById(db,id_user) {
        let aux;
        db.child(id_user).on('value',snap => {
        aux = snap.val();
        this.setContacts(this.getContactsById(db));
        this.setCreation(aux.creation);
        });
    }

    getContactsById(db){
        let aux = [];
        db.child(this.id_user).child('contacts').on('value',snap => {
            snap.forEach(element => {
                let el = element.val();
                let user = new User(el.id_user,el.username);
                aux.push(user);
            });
        });
        this.setContacts(aux);
    }
}