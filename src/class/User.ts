export class User {
    id_user: string;
    username: string;
    email: string;
    contacts: Array<User>;
    creation: string;

    constructor(id = null, username = null, email = null) {
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
        this.contacts = [];
    }


    setId(id){
        this.id_user = id;
    }

    getId(){
        return this.id_user;
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
        let user = new User();
        db.child(id_user).on('value',snap => {
           snap = snap.val();
           user.id_user = snap.id_user;
           user.username = snap.username,
           user.email = snap.email,
           user.contacts = user.getContacts(db),
           user.creation = snap.creation
        });
        return user;
    }

    getContacts(db){
        let aux = [];
        db.child(this.id_user).child('contacts').on('value',snap => {
            snap.forEach(element => {
                let el = element.val();
                let user = new User(el.id_user,el.username);
                aux.push(el);
            });
        });
        console.log(aux)
        return aux;
    }
}