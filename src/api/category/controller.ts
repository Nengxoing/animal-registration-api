import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../../middleware/logger/config";
import { validatePaginationParams } from "../../utils/pagination";
import { createCategoryService, getAllCategoryService } from "./service";

export const getAllCategoryController = async (req: Request, res: Response) => {
  const pagination = validatePaginationParams(req);
  if (!pagination) {
    return;
  }
  const { search, status } = req.query;
  try {
    const result = await getAllCategoryService({
      page: pagination.page,
      limit: pagination.limit,
      paginate: pagination.paginate,
      search,
      status,
    });
    res.json({
      status: "ok",
      message: "success",
      ...result,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to fetch categories",
    });
  }
};

export const createCategoryController = async (req: Request, res: Response) => {
  try {
    // const payload = dataTokenPayload(req, res);
    const { name, status } = req.body;
    const newCategory = {
      name,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // Save the new category using the service
    const created = await createCategoryService(newCategory);
    res.status(StatusCodes.CREATED).json({
      status: "ok",
      message: "Category created successfully",
      data: created,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to create category",
    });
  }
};