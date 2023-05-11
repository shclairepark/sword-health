const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;

chai.use(chaiHttp);

const server = require("../src/app");

describe("Task API", () => {
  let taskId;

  it("should create a new task", (done) => {
    // Send a POST request to create a new task
    chai
      .request(server)
      .post("/api/tasks")
      .send({
        summary: "Test task",
        performedAt: "2023-05-10T10:00:00Z",
        technicianId: 5,
      })
      .end((err, res) => {
        // Should return 200 status code indicating success
        expect(res).to.have.status(200);
        // Assume the response contains the ID of the created task
        taskId = res.body.id;
        done();
      });
  });

  it("should update a task", (done) => {
    // Send a PUT request to update a task with a specific task ID
    chai
      .request(server)
      .put(`/api/tasks/${taskId}`) // Use exisiting taskId to update
      .send({
        summary: "Updated task",
        performedAt: "2023-05-10T12:00:00Z",
        technicianId: 5,
      })
      .end((err, res) => {
        // Should return 200 status code indicating success
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should list tasks", (done) => {
    // Send a GET request to retrieve a list of tasks
    chai
      .request(server)
      .get("/api/tasks")
      .query({ userId: 2 })
      .end((err, res) => {
        // Should return 200 status code indicating success
        expect(res).to.have.status(200);
        // Ensure the response body is an array
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("should delete a task", (done) => {
    // Send a DELETE request to delete a task with a specific task ID
    chai
      .request(server)
      .delete(`/api/tasks/${taskId}`) // Use exisiting taskId for deletion
      .query({ userId: 2 })
      .end((err, res) => {
        // Should return 200 status code indicating success
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should return 500 when there is an error saving a task", (done) => {
    // Send a POST request to create a task, but with invalid data that triggers an error
    chai
      .request(server)
      .post("/api/tasks")
      .send({
        summary: "Test task",
        performedAt: "2023-05-10T10:00:00Z",
        technicianId: "invalid-id",
      })
      .end((err, res) => {
        // Should return 500 status code indicating an internal server error
        expect(res).to.have.status(500);
        done();
      });
  });

  it("should return 404 when updating a non-existing task", (done) => {
    // Send a PUT request to update a non-existing task with an invalid task ID
    chai
      .request(server)
      .put("/api/tasks/non-existing-task-id")
      .send({
        summary: "Updated task",
        performedAt: "2023-05-10T12:00:00Z",
        technicianId: 2,
      })
      .end((err, res) => {
        // Should return 404 status code indicating the task was not found
        expect(res).to.have.status(404);
        done();
      });
  });

  it("should return 404 when deleting a non-existing task", (done) => {
    // Send a DELETE request to delete a non-existing task with an invalid task ID
    chai
      .request(server)
      .delete("/api/tasks/non-existing-task-id")
      .query({ userId: 2 })
      .end((err, res) => {
        // Should return 404 status code indicating the task was not found
        expect(res).to.have.status(404);
        done();
      });
  });

  it("should return 403 when a non-manager user tries to delete a task", (done) => {
    // Send a DELETE request to delete a task with a non-manager user
    chai
      .request(server)
      .delete(`/api/tasks/${taskId}`)
      .query({ userId: 3 }) // Non-manager user ID
      .end((err, res) => {
        // Should return 403 status code indicating access forbidden
        expect(res).to.have.status(403);
        done();
      });
  });

  it("should return 500 when there is an error fetching user role from the database", (done) => {
    // Send a GET request to retrieve tasks with an invalid user ID
    chai
      .request(server)
      .get("/api/tasks")
      .query({ userId: "invalid-user-id" })
      .end((err, res) => {
        // Should return 500 status code indicating an internal server error
        expect(res).to.have.status(500);
        done();
      });
  });
});
