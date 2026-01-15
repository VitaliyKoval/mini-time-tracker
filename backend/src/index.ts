import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

require("dotenv").config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/time-entries", async (req, res) => {
  const timeEntries = await prisma.timeEntry.findMany();
  res.json(timeEntries);
});

app.post("/time-entries", async (req, res) => {
  const { project, hours, description } = req.body;
  const timeEntry = await prisma.timeEntry.create({
    data: {
      project,
      hours,
      description,
    },
  });
  res.json(timeEntry);
});

app.put("/time-entries/:id", async (req, res) => {
  const { id } = req.params;
  const { project, hours, description } = req.body;
  const timeEntry = await prisma.timeEntry.update({
    where: { id },
    data: {
      project,
      hours,
      description,
    },
  });
  res.json(timeEntry);
});

app.delete("/time-entries/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.timeEntry.delete({
    where: { id },
  });
  res.json({ message: "Time entry deleted" });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
