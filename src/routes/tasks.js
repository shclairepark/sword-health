const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const utils = require("./utils");

// MySQL connection configuration
const dbConn = require("../db/connection");

// Create a Nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-email-password",
  },
});

const rolesArr = ["admin", "manager", "technician"];

// API endpoint to save a new task
router.post("/", (req, res) => {
  const { summary, performedAt, technicianId } = req.body;
  const performedAtTS = utils.convertUTCStringToTimestamp(performedAt);

  // Save the task to the database
  const query =
    "INSERT INTO tasks (summary, performed_at, created_by, updated_by) VALUES (?, ?, ?, ?)";
  dbConn.query(
    query,
    [summary, performedAtTS, technicianId, technicianId],
    (err, results) => {
      if (err) {
        console.error("Error executing database query:", err);
        return res.sendStatus(500);
      }

      // Send email notification to the manager
      const notification = `The tech ${technicianId} performed the task '${summary}' on ${performedAt}`;
      const mailOptions = {
        from: "your-email@gmail.com",
        to: "manager-email@gmail.com",
        subject: "New Task Notification",
        text: notification,
      };

      // Use async/await to send the email notification asynchronously
      (async () => {
        try {
          await transporter.sendMail(mailOptions);
          console.log("Email notification sent successfully");
        } catch (error) {
          console.error("Error sending email:", error);
        }
      })();

      res.json({ id: results.insertId });
    }
  );
});

// API endpoint to update a task
router.put("/:taskId", (req, res) => {
  // Extract task details from request body
  const { summary, performedAt, userId } = req.body;
  const performedAtTS = utils.convertUTCStringToTimestamp(performedAt);
  const taskId = req.params.taskId;
  const currentDate = new Date();

  // Fetch the role of the user from the database
  const getQuery = "SELECT created_by FROM tasks WHERE id = ?";
  dbConn.query(getQuery, [taskId], (err, results) => {
    if (err) {
      console.error("Error executing database query:", err);
      return res.sendStatus(500);
    }

    if (results.length === 0) {
      // Task with the specified ID not found
      return res.sendStatus(404);
    }

    const createdBy = results[0].created_by;

    if (parseInt(createdBy) !== parseInt(userId)) {
      // Forbidden, only the technician who performed task can access this endpoint
      return res.sendStatus(403);
    }

    // Update the task in the database
    const query =
      "UPDATE tasks SET summary = ?, performed_at = ?, updated_at = ? WHERE id = ?";
    dbConn.query(
      query,
      [summary, performedAtTS, currentDate, taskId],
      (err, results) => {
        if (err) {
          console.error("Error executing database query:", err);
          return res.sendStatus(500);
        }

        if (results.affectedRows === 0) {
          // Task with the specified ID not found
          return res.sendStatus(404);
        }

        // Send a success response
        res.sendStatus(200);
      }
    );
  });
});

// API endpoint to list tasks
router.get("/", (req, res) => {
  const userId = req.query.userId;

  // Fetch the role of the user from the database
  const roleQuery = "SELECT user_role FROM users WHERE id = ?";
  dbConn.query(roleQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error executing database query:", err);
      return res.sendStatus(500);
    }

    if (results.length === 0) {
      // User with the specified ID not found
      return res.sendStatus(500);
    }

    const userRole = results[0].user_role;
    if (!rolesArr.includes(userRole)) {
      return res.sendStatus(403); // Forbidden
    }

    // Prepare the base query
    let tasksQuery = "SELECT * FROM tasks WHERE is_deleted = 0";

    // Check if the user is a technician
    if (userRole === "technician") {
      // Extend the query for technician-specific tasks
      tasksQuery += " AND created_by = ?";
    }

    dbConn.query(tasksQuery, [userId], (err, tasks) => {
      if (err) {
        console.error("Error executing database query:", err);
        return res.sendStatus(500);
      }

      res.json(tasks);
    });
  });
});

// API endpoint to delete a task (accessible to manager only)
router.delete("/:taskId", (req, res) => {
  const { taskId } = req.params;
  const { userId } = req.query;
  const currentDate = new Date();

  // Fetch the role of the user from the database
  const getQuery = "SELECT user_role FROM users WHERE id = ?";
  dbConn.query(getQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error executing database query:", err);
      return res.sendStatus(500);
    }

    if (results.length === 0) {
      // User with the specified ID not found
      return res.sendStatus(404);
    }

    const userRole = results[0].user_role;

    if (userRole !== "manager") {
      // Forbidden, only managers can access this endpoint
      return res.sendStatus(403);
    }

    // Soft-delete the task in the database
    const updateQuery =
      "UPDATE tasks SET is_deleted = 1, updated_at = ?, updated_by = ? WHERE id = ?";
    dbConn.query(updateQuery, [currentDate, userId, taskId], (err, results) => {
      if (err) {
        console.error("Error executing database query:", err);
        return res.sendStatus(500);
      }

      if (results.affectedRows === 0) {
        // Task with the specified ID not found
        return res.sendStatus(404);
      }

      // Task deleted successfully
      res.sendStatus(200);
    });
  });
});

module.exports = router;
