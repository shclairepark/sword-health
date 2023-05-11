CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  user_role ENUM('admin', 'manager', 'technician') NOT NULL
);

CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  created_by INT NOT NULL,
  updated_by INT NOT NULL,
  summary VARCHAR(2500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (updated_by) REFERENCES users(id)
);

INSERT INTO users (name, email, user_role)
VALUES
  ('John Doe', 'john.doe@example.com', 'admin'),
  ('Jane Smith', 'jane.smith@example.com', 'manager'),
  ('Bob Johnson', 'bob.johnson@example.com', 'technician'),
  ('Baker Smith', 'baker.smith@example.com', 'technician'),
  ('Joe Thomson', 'bob.thomson@example.com', 'technician');

ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'ms1234'; 
flush privileges;
