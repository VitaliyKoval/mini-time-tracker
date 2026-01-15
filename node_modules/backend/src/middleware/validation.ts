import { celebrate } from "celebrate";
import {
  createTimeEntrySchema,
  updateTimeEntrySchema,
} from "../schemas/time-entry";

export const validateCreateTimeEntry = celebrate(createTimeEntrySchema);
export const validateUpdateTimeEntry = celebrate(updateTimeEntrySchema);
