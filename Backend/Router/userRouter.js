import express from "express";

const userRouter = express.Router();

// Example route to get all users
userRouter.get("/", (req, res) => {
  res.send("Get all users");
});

// Example route to create a new user
userRouter.post("/", (req, res) => {
  res.send("Create a new user");
});

// Example route to get a user by ID
userRouter.get("/:id", (req, res) => {
  res.send(`Get user with ID: ${req.params.id}`);
});

export default userRouter;
