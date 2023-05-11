const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;

chai.use(chaiHttp);

const server = require("../src/app");

describe("Task API", () => {
  let taskId;

  it("should create a new task", async () => {
    const res = await chai.request(server).post("/api/tasks").send({
      summary: "Test task",
      performedAt: "2023-05-10T10:00:00Z",
      technicianId: 5,
    });
    taskId = res.body.id;

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("id");
  });

  it("should update a task", async () => {
    const res = await chai.request(server).put(`/api/tasks/${taskId}`).send({
      summary: "Updated task",
      performedAt: "2023-05-10T12:00:00Z",
      userId: 5,
    });

    expect(res).to.have.status(200);
  });

  it("should list tasks", async () => {
    const res = await chai
      .request(server)
      .get("/api/tasks")
      .query({ userId: 2 });

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  it("should delete a task", async () => {
    const res = await chai
      .request(server)
      .delete(`/api/tasks/${taskId}`)
      .query({ userId: 2 });

    expect(res).to.have.status(200);
  });

  it("should return 500 when there is an error saving a task", async () => {
    const res = await chai.request(server).post("/api/tasks").send({
      summary: "Test task",
      performedAt: "2023-05-10T10:00:00Z",
      technicianId: "invalid-id",
    });

    expect(res).to.have.status(500);
  });

  it("should return 404 when updating a non-existing task", async () => {
    const res = await chai
      .request(server)
      .put("/api/tasks/non-existing-task-id")
      .send({
        summary: "Updated task",
        performedAt: "2023-05-10T12:00:00Z",
        technicianId: 5,
      });

    expect(res).to.have.status(404);
  });

  it("should return 404 when deleting a non-existing task", async () => {
    const res = await chai
      .request(server)
      .delete("/api/tasks/non-existing-task-id")
      .query({ userId: 2 });

    expect(res).to.have.status(404);
  });

  it("should return 403 when a non-manager user tries to delete a task", async () => {
    const res = await chai
      .request(server)
      .delete(`/api/tasks/${taskId}`)
      .query({ userId: 3 }); // Non-manager user ID

    expect(res).to.have.status(403);
  });

  it("should return 500 when there is an error fetching user role from the database", async () => {
    const res = await chai
      .request(server)
      .get("/api/tasks")
      .query({ userId: "invalid-id" });

    expect(res).to.have.status(500);
  });
});
