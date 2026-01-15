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
const router = express.Router();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

router.get("/time-entries", async (req, res, next) => {
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

router.post(
  "/time-entries",
  validateCreateTimeEntry,
  async (req, res, next) => {
    try {
      const { description, startTime, endTime, projectId, projectName } =
        req.body;

      const start = new Date(startTime);
      const end = new Date(endTime);
      const newHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      // compute UTC calendar date for the entry
      const dateStr = start.toISOString().slice(0, 10);
      const dateStart = new Date(`${dateStr}T00:00:00.000Z`);
      const nextDate = new Date(dateStart.getTime() + 24 * 60 * 60 * 1000);

      // sum existing hours for that calendar date
      const existing = await prisma.timeEntry.findMany({
        where: {
          startTime: {
            gte: dateStart,
            lt: nextDate,
          },
        },
      });

      const existingHours = existing.reduce((acc: number, e: any) => {
        const s = new Date(e.startTime).getTime();
        const en = new Date(e.endTime).getTime();
        const hours = (en - s) / (1000 * 60 * 60);
        return acc + (Number.isFinite(hours) ? hours : 0);
      }, 0);

      if (existingHours + newHours > 24 + 1e-9) {
        return res.status(400).json({
          statusCode: 400,
          message: "Total hours for the selected date cannot exceed 24 hours.",
        });
      }

      const timeEntry = await prisma.timeEntry.create({
        data: {
          description,
          startTime: start,
          endTime: end,
          projectId: projectId ?? null,
          projectName: projectName ?? null,
        },
      });

      res.json(timeEntry);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/time-entries/:id",
  validateUpdateTimeEntry,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { description, startTime, endTime } = req.body;

      // If startTime and endTime are provided, validate the 24-hour-per-day constraint
      if (startTime && endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const newHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

        const dateStr = start.toISOString().slice(0, 10);
        const dateStart = new Date(`${dateStr}T00:00:00.000Z`);
        const nextDate = new Date(dateStart.getTime() + 24 * 60 * 60 * 1000);

        const existing = await prisma.timeEntry.findMany({
          where: {
            startTime: {
              gte: dateStart,
              lt: nextDate,
            },
            AND: [{ id: { not: String(id) } }],
          },
        });

        const existingHours = existing.reduce((acc: number, e: any) => {
          const s = new Date(e.startTime).getTime();
          const en = new Date(e.endTime).getTime();
          const hours = (en - s) / (1000 * 60 * 60);
          return acc + (Number.isFinite(hours) ? hours : 0);
        }, 0);

        if (existingHours + newHours > 24 + 1e-9) {
          return res.status(400).json({
            statusCode: 400,
            message:
              "Total hours for the selected date cannot exceed 24 hours.",
          });
        }
      }

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

router.delete("/time-entries/:id", async (req, res, next) => {
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

// Mount router under /api so frontend can call /api/time-entries
app.use("/api", router);

app.use(handleErrors);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
