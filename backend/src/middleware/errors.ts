import { Request, Response, NextFunction } from "express";
import { isCelebrateError } from "celebrate";

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

const handleCelebrateError = (err: any, res: Response) => {
  const errorBody = err.details.get("body");
  const { details } = errorBody;
  const message = details.map((i: any) => i.message).join(",");

  return res.status(400).json({
    statusCode: 400,
    message,
  });
};

const handleError = (err: AppError, res: Response) => {
  const { statusCode = 500, message = "Internal Server Error" } = err;

  return res.status(statusCode).json({
    statusCode,
    message,
  });
};

export const handleErrors = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (isCelebrateError(err)) {
    return handleCelebrateError(err, res);
  }

  return handleError(err, res);
};
