import { Joi } from "celebrate";

export const createTimeEntrySchema = {
  body: Joi.object({
    description: Joi.string().required(),
    startTime: Joi.date().iso().required(),
    endTime: Joi.date().iso().greater(Joi.ref("startTime")).required(),
  }),
};

export const updateTimeEntrySchema = {
  body: Joi.object({
    description: Joi.string(),
    startTime: Joi.date().iso(),
    endTime: Joi.date().iso().greater(Joi.ref("startTime")),
  }).min(1),
};
