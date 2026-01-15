import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import {
  validateCreateTimeEntry,
  validateUpdateTimeEntry,
} from "./middleware/validation";
import { handleErrors } from "./middleware/errors";

require("dotenv").config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/time-entries", async (req, res, next) => {
  try {
    const timeEntries = await prisma.timeEntry.findMany({
      orderBy: {
        startTime: "desc",
      },
    });
    res.json(timeEntries);
  } catch (error) {
    next(error);
  }
});

app.post("/time-entries", validateCreateTimeEntry, async (req, res, next) => {
  try {
    const { description, startTime, endTime } = req.body;

    const timeEntry = await prisma.timeEntry.create({
      data: {
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });
    res.json(timeEntry);
  } catch (error) {
    next(error);
  }
});

app.put(
  "/time-entries/:id",
  validateUpdateTimeEntry,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { description, startTime, endTime } = req.body;
      const timeEntry = await prisma.timeEntry.update({
        where: { id: String(id) },
        data: {
          description,
          startTime: startTime ? new Date(startTime) : undefined,
          endTime: endTime ? new Date(endTime) : undefined,
        },
      });
      res.json(timeEntry);
    } catch (error) {
      next(error);
    }
  }
);

app.delete("/time-entries/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.timeEntry.delete({
      where: { id: String(id) },
    });
    res.json({ message: "Time entry deleted" });
  } catch (error) {
    next(error);
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(handleErrors);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
