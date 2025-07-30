import { Request } from "express";

export function builderOfficeRecord(req: Request) {
  const result = {
    name: req.body.name,
    provinceId: req.body.provinceId,
    status: req.body.status,
    districtId: req.body.districtId,
    village: req.body.village,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };
  return result;
}
