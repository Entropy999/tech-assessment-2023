import axios from 'axios';
import Session from '../Session';
import UserProfilePhotoAPI from '../UserProfilePhotoAPI';

class DependantAPI {
    static #instance = null;

    #promise = null;

    /**
     * Retrieves the DependantAPI singleton instance
     * @returns {DependantAPI} DependantAPI instance
     */
    static getAPI() {
        if (!DependantAPI.#instance) {
            DependantAPI.#instance = new DependantAPI();
        }
        return DependantAPI.#instance;
    }

    get() {
        const session = Session.getSession();
        if (!this.#promise) {
            this.#promise = new Promise((resolve, reject) =>
                axios
                    .get(`/dependents`, session.axios)
                    .then(({ data: { data } }) => resolve(Dependant.convertArray(data)))
                    .catch((err) => reject(err.response ? err.response.data : err.message))
                    .finally(() => {
                        this.#promise = null;
                    })
            );
        }
        return this.#promise;
    }

    static getByid(id) {
        const session = Session.getSession();
        return new Promise((resolve, reject) =>
                axios
                    .get(`/dependent/${id}`, session.axios)
                    .then(({ data: {data} }) => resolve(data))
                    .catch((err) => reject(err.response ? err.response.data : err.message))
            );
        }
    

    static delete(dependentId) {
        const session = Session.getSession();
        return new Promise((resolve, reject) =>
            axios
                .delete(`/dependent/${dependentId}`, session.axios)
                .then(({ data: { success } }) => resolve(success))
                .catch((err) => reject(err.response ? err.response.data : err.message))
        );
    }

    static create(fname, lname) {
        const formdata = new FormData();
        formdata.append('add_dependant_first_name', fname);
        formdata.append('add_dependant_last_name', lname);

        return new Promise((resolve, reject) =>
            axios
                .post(`/dependent/`, formdata, Session.getSession().axios)
                .then(({ data: {success} }) => resolve(success))
                .catch((err) => reject(err.response ? err.response.data : err.message))
        );
    }

    static async edit(fname, lname, id){
        const formdata = new FormData();
        formdata.append('first_name', fname);
        formdata.append('last_name', lname);
        await Session.getSession().loginDependant(id);

        return new Promise((resolve, reject) =>
            axios
                .post(`/dependent_user_profile`, formdata, Session.getSession().axios)
                .then(({ data: {data} }) => resolve(data))
                .catch((err) => reject(err.response ? err.response.data : err.message))
        );
    }

    static register(id, pwd, email){
        const formdata = new FormData();
        formdata.append('register_id', id);
        formdata.append('register_password', pwd);
        formdata.append('register_email', email);

        return new Promise((resolve, reject) =>
            axios
                .post(`/register_dependent`, formdata, Session.getSession().axios)
                .then(({ data }) => resolve(data))
                .catch((err) => reject(err.response ? err.response.data : err.message))
        );
    }

    static registerNewsletter(email, name){
        const formdata = new FormData();
        formdata.append('email', email);
        formdata.append('name', name);

        return new Promise((resolve, reject) =>
            axios
                .post(`/notification_email`, formdata, Session.getSession().axios)
                .then(({ data }) => resolve(data))
                .catch((err) => reject(err.response ? err.response.data : err.message))
        );

    }

    static updatePhoto(userId, photo){
        const formdata = new FormData();
        formdata.append('photo', photo);
    
        return new Promise((resolve, reject) =>
            axios
                .post(`/user/${userId}/profile/photo`, formdata, Session.getSession().axios)
                .then(({ data }) => resolve(data))
                .catch((err) => reject(err.response ? err.response.data : err.message))
        );
    }

    static async login(id){
        await Session.getSession().loginDependant(id);
    }
}

class Dependant {
    #dependant = null;
    static convertArray(dependants) {
        return dependants.map((dependant) => new Dependant(dependant));
    }

    constructor(dependant) {
        this.#dependant = dependant;
    }

    get user() {
        return {
            id: this.#dependant.id,
            firstName: this.#dependant.first_name,
            lastName: this.#dependant.last_name,
            tamid: this.#dependant.tamid,
            disabled: this.#dependant.disabled,
            joineddate: this.#dependant.joineddate
        };
    }

    get photo() {
        return UserProfilePhotoAPI.getAPI().get(this.user.id);
    }

    get created() {
        return new Date(this.#dependant.joineddate);
    }

    get firstName(){
        return this.#dependant.first_name;
    }

    /**
     * @param {String} firstname
     */
    set firstName(firstname){
        this.#dependant.first_name=firstname;
    }

    get lastName(){
        return this.#dependant.last_name;
    }

    /**
     * @param {String} lastname
     */
    set lastName(lastname){
        this.#dependant.last_name=lastname;
    }
    
    details(){
        return DependantAPI.getByid(this.user.id);
    }

    delete() {
        return DependantAPI.delete(this.user.id);
    }

    create() {
        return DependantAPI.create(this.firstName, this.lastName);
    }

    editName(){
        return DependantAPI.edit(this.user.firstName, this.user.lastName, this.user.id);
    }

    register(pwd, email){
        return DependantAPI.register(this.user.id, pwd, email);
    }

    registerNewsletter(email){
        return DependantAPI.registerNewsletter(email, `${this.user.firstName} ${this.user.lastName}`);
    }

    updatePhoto(photo){
        return DependantAPI.updatePhoto(this.user.id, photo);
    }

    login(){
        return DependantAPI.login(this.user.id);
    }

    toJSON() {
        return this.#dependant;
    }
}

export { Dependant };
export default DependantAPI;
