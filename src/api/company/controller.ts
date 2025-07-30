/* eslint-disable linebreak-style */
/* eslint-disable max-nested-callbacks */
import { ActionType, company } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma";
import { getFileUrlsWithName } from "../../utils/fileUrl";
import { dataTokenPayload } from "../../utils/lib";
import { validatePaginationParams } from "../../utils/pagination";
import {
  aggregationCompanyServices,
  createCompanyLogRecord,
  editCompanyService,
  getAllCompanyService,
  getBusinessTypeService,
  getCompanyLogService,
  getOneCompanyService,
} from "./service";

export const getAllCompanyController = async (req: Request, res: Response) => {
  const paginate = !req.query.paginate;
  const pagination = validatePaginationParams(req);
  if (!pagination) {
    return;
  }
  const { search } = req.query;
  try {
    const result = await getAllCompanyService({
      page: pagination.page,
      limit: pagination.limit,
      search,
      paginate,
      req,
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
      message: "Failed to fetch company",
    });
  }
};

export const getCompanyLogController = async (req: Request, res: Response) => {
  try {
    const result = await getCompanyLogService(req);
    res.json({
      status: "ok",
      message: "success",
      ...result,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to fetch company log",
    });
  }
};

export const getOneCompanyController = async (req: Request, res: Response) => {
  try {
    const result = await getOneCompanyService({ id: Number(req.params.id), req });
    res.json({
      status: "ok",
      message: "success",
      ...result,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to fetch application requests",
    });
  }
};

export const createCompanyController = async (req: Request, res: Response) => {
  try {
    const companyFile = getFileUrlsWithName(req);
    const officeId = dataTokenPayload(req, res)?.officeId;
    const newOfficeId = officeId && Number(officeId) !== 0 ? Number(officeId) : null;
    const businessType = req.body.businessType === "add" ? req.body.customBusinessType : req.body.businessType;
    const newCompany = {
      name: req.body.name as string,
      businessCode: req.body.businessCode ?? null,
      officeId: newOfficeId,
      businessRegisterBy: req.body.businessRegisterBy as string,
      businessType: businessType as string,
      status: req.body.status ? Number(req.body.status) : 0,
      companyFile: {
        create: companyFile.map((file) => ({
          name: file.name,
          file: file.file,
        })),
      },
      companyLog: {
        create: {
          action: ActionType.CREATE,
          changedBy: Number(dataTokenPayload(req, res)?.id),
          newName: req.body.name as string,
          newBusinessCode: req.body.businessCode as string ?? null,
        },
      },
    };
    const transactionResult = await createCompanyService({ data: newCompany as Omit<company, "id"> });
    if (!transactionResult) {
      res.json({
        status: "error",
        message: "Company not created",
      });
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Company created successfully",
      result: transactionResult,
    });
    return;
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "error",
    });
    return;
  }
};

const createCompanyService = async ({ data }: { data: Omit<company, "id"> }) => {
  try {
    const createdCompany = await prisma.company.create({ data });
    return createdCompany;
  } catch (error) {
    logger.error(error);
    throw new Error("An unexpected error occurred");
  } finally {
    await prisma.$disconnect();
  }
};

export const ediCompanyController = async (req: Request, res: Response) => {
  const companyId = Number(req.params.id);
  try {
    // แก้ไขตรงนี้: ตรวจสอบก่อน parse
    const companyFileIds: number[] = req?.body?.companyFileIds ? JSON.parse(req.body.companyFileIds) : []; // ถ้าไม่มีค่า ให้ใช้ array ว่างแทน
    // const companyFileIds: number[] = JSON.parse(req?.body?.companyFileIds);
    const updatedFiles = getFileUrlsWithName(req);
    const officeId = dataTokenPayload(req, res)?.officeId;
    const newOfficeId = officeId && Number(officeId) !== 0 ? Number(officeId) : null;
    const businessType = req.body.businessType === "add" ? req.body.customBusinessType : req.body.businessType;
    const updatedData = {
      name: req.body.name,
      businessCode: req.body.businessCode ?? null,
      officeId: newOfficeId,
      businessRegisterBy: req.body.businessRegisterBy,
      businessType: businessType,
      ...(req.body.status !== undefined && req.body.status !== null && { status: Number(req.body.status) }),
    };

    const result = await prisma.$transaction(async (tx) => {
      // await tx.companyFile.updateMany({
      //   data: {
      //     deletedAt: new Date(),
      //   },
      //   where: {
      //     companyId,
      //     id: {
      //       notIn: companyFileIds,
      //     },
      //   },
      // });

      // ตรวจสอบและลบไฟล์เก่าที่ไม่ได้อยู่ใน companyFileIds
      // ตรวจสอบให้แน่ใจว่า companyFileIds ไม่ใช่ undefined ก่อนใช้งาน
      if (companyFileIds.length > 0) { // <--- เพิ่มเงื่อนไขนี้
        await tx.companyFile.updateMany({
          data: {
            deletedAt: new Date(),
          },
          where: {
            companyId,
            id: {
              notIn: companyFileIds,
            },
          },
        });
      }

      const oldCompany = await tx.company.findUnique({ where: { id: companyId } });
      if (!oldCompany) {
        throw new Error("Company not found");
      }
      const updatedCompany = await editCompanyService({
        data: updatedData,
        id: companyId,
        tx,
      });
      if (updatedFiles && updatedFiles.length > 0) {
        const newFilesData = updatedFiles.map((file) => ({
          name: file.name,
          file: file.file,
          companyId,
        }));
        await tx.companyFile.createMany({ data: newFilesData });
      }
      const changedBy = Number(dataTokenPayload(req, res)?.id);
      await createCompanyLogRecord({
        action: ActionType.UPDATE,
        data: oldCompany,
        changes: updatedData,
        changedBy,
        tx,
      });

      return updatedCompany;
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Company updated successfully",
      result,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to update company",
    });
  }
};

export const aggregationController = async (req: Request, res: Response) => {
  try {
    const aggregationResult = await aggregationCompanyServices();
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Aggregation successful",
      result: aggregationResult,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occurred while fetching user aggregation.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getBusinessTypeController = async (req: Request, res: Response) => {
  try {
    const result = await getBusinessTypeService();
    res.json({
      status: "ok",
      message: "success",
      ...result,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to fetch company type",
    });
  }
};
