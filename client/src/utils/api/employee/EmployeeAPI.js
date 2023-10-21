import axios from 'axios';

class EmployeeAPI {
    static #instance = null;

    #promise = null;

    /**
     * Retrieves the EmployeeAPI singleton instance
     * @returns {EmployeeAPI} EmployeeAPI instance
     */
    static getAPI() {
        if (!EmployeeAPI.#instance) {
            EmployeeAPI.#instance = new EmployeeAPI();
        }
        return EmployeeAPI.#instance;
    }

    get() {
        if (!this.#promise) {
            this.#promise = new Promise((resolve, reject) =>
                axios
                    .get(`/employee`)
                    .then(({ data: { data } }) => resolve(Employee.convertArray(data)))
                    .catch((err) => reject(err.response ? err.response.data : err.message))
                    .finally(() => {
                        this.#promise = null;
                    })
            );
        }
        return this.#promise;
    }

    static getByid(id) {
        return new Promise((resolve, reject) =>
                axios
                    .get(`/employee/${id}`)
                    .then(({ data: {data} }) => resolve(data))
                    .catch((err) => reject(err.response ? err.response.data : err.message))
            );
        }
    

    static delete(employeeId) {
        return new Promise((resolve, reject) =>
            axios
                .delete(`/employee/${employeeId}`)
                .then(({ data: { success } }) => resolve(success))
                .catch((err) => reject(err.response ? err.response.data : err.message))
        );
    }

    static create(fname, lname, salary) {
        const formdata = new FormData();
        formdata.append('first_name', fname);
        formdata.append('last_name', lname);
        formdata.append('salary', salary);

        return new Promise((resolve, reject) =>
            axios
                .post(`/employee/`, formdata)
                .then(({ data: {success} }) => resolve(success))
                .catch((err) => reject(err.response ? err.response.data : err.message))
        );
    }

    static async edit(fname, lname, salary){
        const formdata = new FormData();
        formdata.append('first_name', fname);
        formdata.append('last_name', lname);
        formdata.append('salary', salary);

        return new Promise((resolve, reject) =>
            axios
                .put(`/employee`, formdata)
                .then(({ data: {data} }) => resolve(data))
                .catch((err) => reject(err.response ? err.response.data : err.message))
        );
    }
    
}

class Employee {
    #employee = null;
    static convertArray(employees) {
        return employees.map((employee) => new employee(employee));
    }

    constructor(employee) {
        this.#employee = employee;
    }

    get employee() {
        return {
            id: this.#employee.id,
            firstName: this.#employee.first_name,
            lastName: this.#employee.last_name,
            salary: this.#employee.salary
        };
    }
    
    get firstName(){
        return this.#employee.first_name;
    }

    /**
     * @param {String} firstname
     */
    set firstName(firstname){
        this.#employee.first_name=firstname;
    }

    get lastName(){
        return this.#employee.last_name;
    }

    /**
     * @param {String} lastname
     */
    set lastName(lastname){
        this.#employee.last_name=lastname;
    }

    get salary(){
        return this.#employee.salary;
    }
    
    /**
     * @param {Number} salary
     */
    set salary(salary){
        this.#employee.salary=salary;
    }

    
    details(){
        return EmployeeAPI.getByid(this.employee.id);
    }

    delete() {
        return EmployeeAPI.delete(this.employee.id);
    }

    create() {
        return EmployeeAPI.create(this.firstName, this.lastName, this.salary);
    }

    edit(){
        return EmployeeAPI.edit(this.employee.firstName, this.employee.lastName, this.employee.id);
    }

    toJSON() {
        return this.#employee;
    }
}

export { Employee };
export default EmployeeAPI;
