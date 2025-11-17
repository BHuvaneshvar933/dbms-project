export const SQL_QUERIES = {
  // Events
  CREATE_EVENT_TABLE: `
    CREATE TABLE events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      start_date DATETIME NOT NULL,
      end_date DATETIME NOT NULL,
      location VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      total_seats INT DEFAULT 100,
      available_seats INT DEFAULT 100,
      category_id INT,
      created_by INT,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );
  `,


  SELECT_ALL_EVENTS: `
    SELECT e.*, u.name AS organizer_name, c.name AS category_name
    FROM events e
    JOIN users u ON e.created_by = u.id
    LEFT JOIN categories c ON e.category_id = c.id;
  `,

  SELECT_EVENT_BY_ID: `
    SELECT e.*, u.name AS organizer_name, c.name AS category_name
    FROM events e
    JOIN users u ON e.created_by = u.id
    LEFT JOIN categories c ON e.category_id = c.id
    WHERE e.id = ?;
  `,

  SELECT_EVENT_BY_ID_FOR_UPDATE: `
    SELECT id, available_seats, price FROM events WHERE id = ?;
  `,

  UPDATE_EVENT_AVAILABLE_SEATS: `
    UPDATE events SET available_seats = ? WHERE id = ?;
  `,

  //  Bookings
  CREATE_BOOKING_TABLE: `
    CREATE TABLE bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_id INT NOT NULL,
      user_id INT NOT NULL,
      no_of_tickets INT NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (event_id) REFERENCES events(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `,

  INSERT_BOOKING: `
    INSERT INTO bookings (event_id, user_id, no_of_tickets, total_price)
    VALUES (?, ?, ?, ?);
  `,

  SELECT_BOOKINGS_FOR_EVENT: `
    SELECT b.*, u.name AS user_name, u.email AS user_email
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    WHERE b.event_id = ?;
  `,

  //  Payments
  CREATE_PAYMENT_TABLE: `
    CREATE TABLE payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      booking_id INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      status ENUM('pending','completed') DEFAULT 'pending',
      FOREIGN KEY (booking_id) REFERENCES bookings(id)
    );
  `,

  INSERT_PAYMENT: `
    INSERT INTO payments (booking_id, amount, status)
    VALUES (?, ?, ?);
  `,

  SELECT_PAYMENT_BY_ID: `
    SELECT * FROM payments WHERE id = ?;
  `,

  UPDATE_PAYMENT_STATUS: `
    UPDATE payments SET status = ? WHERE id = ?;
  `,

  UPDATE_BOOKING_PAYMENT_STATUS: `
    UPDATE bookings SET payment_status = ? WHERE id = ?;
  `,

  // Categories
  SELECT_ALL_CATEGORIES: `
    SELECT id, name FROM categories;
  `,

  INSERT_CATEGORY: `
    INSERT INTO categories (name) VALUES (?);
  `,

  // Feedback
  INSERT_FEEDBACK: `
    INSERT INTO feedbacks (userId, eventId, rating, comment) VALUES (?, ?, ?, ?);
  `,

  SELECT_FEEDBACK_BY_EVENT_ID: `
    SELECT f.*, u.name AS user_name, u.email AS user_email
    FROM feedbacks f
    JOIN users u ON f.userId = u.id
    WHERE f.eventId = ?;
  `,

  // Users
  SELECT_USER_BY_EMAIL: `
    SELECT * FROM users WHERE email = ?;
  `,

  INSERT_USER: `
    INSERT INTO users (name, email, password, role, organization_name) VALUES (?, ?, ?, ?, ?);
  `,

  // Triggers 
  TRIGGER_UPDATE_SEATS: `
    DELIMITER //
    CREATE TRIGGER after_booking_insert
    AFTER INSERT ON bookings
    FOR EACH ROW
    BEGIN
      UPDATE events
      SET available_seats = available_seats - NEW.no_of_tickets
      WHERE id = NEW.event_id;
    END //
    DELIMITER ;
  `
};

export const rSql = (queryName, queryString, params = []) => {
  let formattedQuery = queryString;
  let paramIndex = 0;
  formattedQuery = formattedQuery.replace(/\?/g, () => {
    const param = params[paramIndex];
    paramIndex++;
    if (typeof param === 'string') {
      return `'${param}'`;
    } else if (param === null || param === undefined) {
      return 'NULL';
    } else {
      return param;
    }
  });
  console.log(`Executing: ${queryName}`);
  console.log(formattedQuery);
  console.log("----------------------------------------------------------");
};
