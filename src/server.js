// "use strict";
// const express = require("express");
// const bodyParser = require("body-parser");
// const nodemailer = require("nodemailer");

// // create express app snd setup port
// const app = express();
// const port = process.env.PORT || 3000;

// // MySQL connection configuration
// const dbConn = require("./db/connection");

// // Create a Nodemailer transporter for sending emails
// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: "your-email@gmail.com",
//     pass: "your-email-password",
//   },
// });

// // parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));
// // parse requests of content-type - application/json
// app.use(bodyParser.json());

// const rolesArr = ["admin", "manager", "technician"];

// // Root route
// app.get("/", (_, res) => {
//   res.send("Hello World");
// });

// // API endpoint to save a new task
// app.post("/tasks", (req, res) => {
//   const { summary, performedAt, technicianId } = req.body;
//   const performedAtTS = convertUTCStringToTimestamp(performedAt);

//   // Save the task to the database
//   const query =
//     "INSERT INTO tasks (summary, performed_at, created_by, updated_by) VALUES (?, ?, ?, ?)";
//   dbConn.query(
//     query,
//     [summary, performedAtTS, technicianId, technicianId],
//     (err, results) => {
//       if (err) {
//         console.error("Error executing database query:", err);
//         return res.sendStatus(500);
//       }

//       // Send email notification to the manager
//       // ToDo: enrich name
//       //   const notification = `The tech ${technicianName} (ID: ${technicianId}) performed the task '${summary}' on ${performedAt}`;
//       const notification = `The tech ${technicianId} performed the task '${summary}' on ${performedAt}`;
//       const mailOptions = {
//         from: "your-email@gmail.com",
//         to: "manager-email@gmail.com",
//         subject: "New Task Notification",
//         text: notification,
//       };

//       // Use async/await to send the email notification asynchronously
//       (async () => {
//         try {
//           await transporter.sendMail(mailOptions);
//           console.log("Email notification sent successfully");
//         } catch (error) {
//           console.error("Error sending email:", error);
//         }
//       })();

//       res.sendStatus(200);
//     }
//   );
// });

// // API endpoint to update a task
// app.put("/tasks/:taskId", (req, res) => {
//   // Extract task details from request body
//   const { summary, performedAt, technicianId } = req.body;
//   const performedAtTS = convertUTCStringToTimestamp(performedAt);
//   const taskId = req.params.taskId;
//   const currentDate = new Date();

//   // Update the task in the database
//   const query =
//     "UPDATE tasks SET summary = ?, performed_at = ?, updated_at = ? WHERE id = ?";
//   dbConn.query(
//     query,
//     [summary, performedAtTS, currentDate, taskId],
//     (err, results) => {
//       if (err) {
//         console.error("Error executing database query:", err);
//         return res.sendStatus(500);
//       }

//       // Send a success response
//       res.sendStatus(200);
//     }
//   );
// });

// // API endpoint to list tasks
// app.get("/tasks", (req, res) => {
//   const userId = req.query.userId;

//   // Fetch the role of the user from the database
//   const roleQuery = "SELECT user_role FROM users WHERE id = ?";
//   dbConn.query(roleQuery, [userId], (err, results) => {
//     if (err) {
//       console.error("Error executing database query:", err);
//       return res.sendStatus(500);
//     }

//     if (results.length === 0) {
//       // User with the specified ID not found
//       return res.sendStatus(404);
//     }

//     const userRole = results[0].user_role;
//     console.log(userRole);

//     if (!rolesArr.includes(userRole)) {
//       return res.sendStatus(403); // Forbidden
//     }

//     // Prepare the base query
//     let tasksQuery = "SELECT * FROM tasks WHERE is_deleted = 0";

//     // Check if the user is a technician
//     if (userRole === "technician") {
//       // Extend the query for technician-specific tasks
//       tasksQuery += " AND created_by = ?";
//     }

//     dbConn.query(tasksQuery, [userId], (err, tasks) => {
//       if (err) {
//         console.error("Error executing database query:", err);
//         return res.sendStatus(500);
//       }

//       res.json(tasks);
//     });
//   });
// });

// // API endpoint to delete a task (accessible to manager only)
// app.delete("/tasks/:taskId", (req, res) => {
//   const { taskId } = req.params;
//   const { userId } = req.query;

//   // Fetch the role of the user from the database
//   const getQuery = "SELECT user_role FROM users WHERE id = ?";
//   dbConn.query(getQuery, [userId], (err, results) => {
//     if (err) {
//       console.error("Error executing database query:", err);
//       return res.sendStatus(500);
//     }

//     if (results.length === 0) {
//       // User with the specified ID not found
//       return res.sendStatus(404);
//     }

//     const userRole = results[0].user_role;

//     if (userRole !== "manager") {
//       // Forbidden, only managers can access this endpoint
//       return res.sendStatus(403);
//     }

//     // Soft-delete the task in the database
//     const updateQuery = "UPDATE tasks SET is_deleted = 1 WHERE id = ?";
//     dbConn.query(updateQuery, [taskId], (err, results) => {
//       if (err) {
//         console.error("Error executing database query:", err);
//         return res.sendStatus(500);
//       }

//       if (results.affectedRows === 0) {
//         // Task with the specified ID not found
//         return res.sendStatus(404);
//       }

//       // Task deleted successfully
//       res.sendStatus(200);
//     });
//   });
// });

// function convertUTCStringToTimestamp(utcString) {
//   const utcDate = new Date(utcString);
//   const timestamp = utcDate.toISOString().slice(0, 19).replace("T", " ");
//   return timestamp;
// }

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });
