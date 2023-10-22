
### Creating the Virtual Environment

1. Change working directories to the first `server` folder:

   ```
   cd ./server
   ```

1. Create the virtual environment as the folder `server_venv`:

   ```
   py -3.8 -m venv server\server_venv
   (Mac/Linux) sudo python3.8 -m venv server/server_venv
   ```

1. Activate the virtual environment

   ```
   ./server/server_venv/Scripts/activate
   (Mac/Linux) source server/server_venv/bin/activate
   ```

1. Install the packages in order:
   ```
   server/server_venv\scripts\pip install --upgrade pip setuptools
   server/server_venv\scripts\pip install -r requirements.txt
   ```
   (Mac/Linux)
   ```
   sudo server/server_venv/bin/pip install --upgrade pip setuptools
   sudo server/server_venv/bin/pip install -r requirements.txt
   ```


### Setting up the Database

1. Open an admin Powershell terminal and run the following to start mysql

   ```
   mysql -h localhost -P 3306 -u root -p
   ```

1. Create an empty `ecapital` database

   ```
   CREATE DATABASE ecapital;
   ```

1. Create the database users, with the `ecapital_user` password matching the one from the config file

   ```
   CREATE USER 'ecapital_user'@'localhost' IDENTIFIED BY '<your_password>';
   ```

1. In the `mysql` terminal, connect to the `ecapital` database

   ```
   use ecapital
   ```

1. Then grant permissions on the database to `ecapital_user`
   ```
   GRANT ALL PRIVILEGES ON ecapital.* TO 'ecapital_user'@'localhost';
   ```

1. Then create table employee
   ```
   CREATE TABLE employee (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'employee id',
    `db_create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'employee data create time',
    `db_modify_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'employee data modify time',
    `first_name` VARCHAR(50) NOT NULL DEFAULT '' COMMENT 'employee legal first name',
    `last_name` VARCHAR(50) NOT NULL DEFAULT '' COMMENT 'employee legal last name',
    `salary` bigint(20) NOT NULL DEFAULT 0 COMMENT 'employee salary',
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_employee` (`first_name`, `last_name`)) 
    ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COMMENT='employee table';

   ```

1. Then insert initial data
   ```
   INSERT INTO employee (first_name, last_name, salary)
   VALUES
      ('Lewis', 'Burson', 40700),
      ('Ian', 'Malcolm', 70000),
      ('Ellie', 'Sattler', 102000),
      ('Dennis', 'Nedry', 52000),
      ('John', 'Hammond', 89600),
      ('Ray', 'Arnold', 45000),
      ('Laura', 'Burnett', 80000);
   ```



## Running

1. Switch to the server directory
   ```
   cd ./server
   ```

1. Activate your virtual environment (if not already activated):

   ```
   ./server/server/server_venv/Scripts/activate
   (Mac/Linux) source ./server/server/server_venv/bin/activate
   ```

1. Run the server with `uvicorn`:

   ```
   server\server_venv\Scripts\python -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
   (Mac/Linux) server/server_venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
   ```
