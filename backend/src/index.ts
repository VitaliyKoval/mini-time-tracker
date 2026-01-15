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
  const timeEntries = await prisma.timeEntry.findMany({
    orderBy: {
      date: "desc",
    },
  });
  res.json(timeEntries);
});

app.post("/time-entries", async (req, res) => {
  const { project, hours, date, description } = req.body;

  if (!project || !hours || !date) {
    return res.status(400).json({
      message: "Project, hours, and date are required",
    });
  }

  if (hours <= 0) {
    return res.status(400).json({
      message: "Hours must be greater than 0",
    });
  }

  const newDate = new Date(date);
  const startOfDay = new Date(
    newDate.getFullYear(),
    newDate.getMonth(),
    newDate.getDate()
  );
  const endOfDay = new Date(
    newDate.getFullYear(),
    newDate.getMonth(),
    newDate.getDate() + 1
  );

  const todaysEntries = await prisma.timeEntry.findMany({
    where: {
      date: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });

  const totalHours = todaysEntries.reduce(
    (sum: number, entry: { hours: number }) => sum + entry.hours,
    0
  );

  if (totalHours + hours > 24) {
    return res.status(400).json({
      message: "Total hours for this date cannot exceed 24",
    });
  }

  const timeEntry = await prisma.timeEntry.create({
    data: {
      project,
      hours,
      date: newDate,
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
