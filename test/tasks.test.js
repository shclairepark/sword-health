const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;

chai.use(chaiHttp);

const server = require("../src/app");

describe("Task API", () => {
  let taskId;

  it("should create a new task", (done) => {
    chai
      .request(server)
      .post("/api/tasks")
      .send({
        summary: "Test task",
        performedAt: "2023-05-10T10:00:00Z",
        technicianId: 5,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        taskId = res.body.id; // Assuming the response contains the ID of the created task
        done();
      });
  });

  it("should update a task", (done) => {
    chai
      .request(server)
      .put(`/api/tasks/${taskId}`)
      .send({
        summary: "Updated task",
        performedAt: "2023-05-10T12:00:00Z",
        technicianId: 5,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should list tasks", (done) => {
    chai
      .request(server)
      .get("/api/tasks")
      .query({ userId: 2 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("should delete a task", (done) => {
    chai
      .request(server)
      .delete(`/api/tasks/${taskId}`)
      .query({ userId: 2 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should return 500 when there is an error saving a task", (done) => {
    chai
      .request(server)
      .post("/api/tasks")
      .send({
        summary: "Test task",
        performedAt: "2023-05-10T10:00:00Z",
        technicianId: 9,
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

  it("should return 404 when updating a non-existing task", (done) => {
    chai
      .request(server)
      .put("/api/tasks/non-existing-task-id")
      .send({
        summary: "Updated task",
        performedAt: "2023-05-10T12:00:00Z",
        technicianId: 2,
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it("should return 404 when deleting a non-existing task", (done) => {
    chai
      .request(server)
      .delete("/api/tasks/non-existing-task-id")
      .query({ userId: 2 })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it("should return 403 when a non-manager user tries to delete a task", (done) => {
    chai
      .request(server)
      .delete(`/api/tasks/${taskId}`)
      .query({ userId: 3 }) // Non-manager user ID
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it("should return 500 when there is an error fetching user role from the database", (done) => {
    chai
      .request(server)
      .get("/api/tasks")
      .query({ userId: "invalid-user-id" })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});
