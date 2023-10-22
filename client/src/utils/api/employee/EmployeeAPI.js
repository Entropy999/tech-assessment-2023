import axios from 'axios';


// axios.defaults.baseURL = process.env.API_BASE_URL;
const apiBaseUrl = "http://0.0.0.0:8000"; // Access the API base URL from the .env file


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
                    .get(`${apiBaseUrl}/employee/`)
                    .then(({ data }) => resolve(Employee.convertArray(data)))
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
                    .get(`${apiBaseUrl}/employee/${id}`)
                    .then(({ data }) => resolve(new Employee(data)))
                    .catch((err) => reject(err.response ? err.response.data : err.message))
            );
        }
    

    static delete(employeeId) {
        return new Promise((resolve, reject) =>
            axios
                .delete(`${apiBaseUrl}/employee/${employeeId}`)
                .then(({ data }) => resolve(new Employee(data)))
                .catch((err) => {reject(err.response ? err.response.data.detail : err.message)})
        );
    }

    static create(fname, lname, salary) {
        const formdata = {
            'first_name': fname,
            'last_name': lname,
            'salary': salary
        };

        return new Promise((resolve, reject) =>
            axios
                .post(`${apiBaseUrl}/employee/`, formdata)
                .then(({ data }) => resolve(new Employee(data)))
                .catch((err) => {reject(err.response ? err.response.data.detail : err.message)})
        );
    }

    static async edit(employeeId, fname, lname, salary){
        const formdata = {
            'first_name': fname,
            'last_name': lname,
            'salary': salary
        };

        return new Promise((resolve, reject) =>
            axios
                .put(`${apiBaseUrl}/employee/${employeeId}/`, formdata)
                .then(({ data }) => resolve(new Employee(data)))
                .catch((err) => {reject(err.response ? err.response.data.detail : err.message)})
        );
    }
    
}

class Employee {
    #employee = null;
    static convertArray(employees) {
        return employees.map((employee) => new Employee(employee));
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

    get id(){
        return this.#employee.id;
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
        return EmployeeAPI.edit(this.employee.id, this.employee.firstName, this.employee.lastName, this.employee.id);
    }

    toJSON() {
        return this.#employee;
    }
}

export { Employee };
export default EmployeeAPI;
