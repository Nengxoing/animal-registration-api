import { Request, Response } from "express";
import { responseError } from "../lib";
import { prisma } from "../../prisma";

export const getApplicationAggregationController = async (req: Request, res: Response) => {
  try {
    const data = await getApplicationAggregationService();
    res.json({
      status: "ok",
      result: data,
    });
  } catch (error) {
    responseError({ error, res });
  }
};

const getApplicationAggregationService = async () => {
  try {
    const currentDate = new Date();
    const twelveMonthsAgo = new Date();
    const MONTHS_IN_YEAR = 12;
    twelveMonthsAgo.setMonth(currentDate.getMonth() - MONTHS_IN_YEAR);

    const monthlyApplications = await prisma.$queryRaw<
      { month: number; year: number; total: number }[]
    >`
      SELECT 
        EXTRACT(MONTH FROM "createdAt") AS month,
        EXTRACT(YEAR FROM "createdAt") AS year,
        COUNT(*) AS total
      FROM 
        "application"
      WHERE 
        "createdAt" >= ${twelveMonthsAgo}
        AND "status" = 'FINISHED'
      GROUP BY 
        year, month
      ORDER BY 
        year, month
    `;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedData = monthlyApplications.map(({ month, total }) => ({
      name: monthNames[month - 1], 
      total: Number(total), 
    }));

    const completeData = [];
    for (let i = 0; i < MONTHS_IN_YEAR; i++) {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - i);
      const monthName = monthNames[date.getMonth()];
      const existingMonth = formattedData.find((item) => item.name === monthName);
      completeData.unshift({
        name: monthName,
        value: existingMonth ? existingMonth.total : 0,
      });
    }
    return completeData;
  } catch (error) {
    throw error;
  }
};

export const getApplicationStatisticsController = async (req: Request, res: Response) => {
  try {
    const { officeId, status } = req.query;
    const data = await getApplicationStatsService(
      officeId ? Number(officeId) : null, 
      status ? String(status) : null, 
    );

    res.json({
      status: "ok",
      result: data,
    });
  } catch (error) {
    responseError({ error, res });
  }
};

const getApplicationStatsService = async (officeId: number | null, status: string | null) => {
  try {
    const currentDate = new Date();
    const previousMonthDate = new Date();
    previousMonthDate.setMonth(currentDate.getMonth() - 1);
    const filter: any = {};
    if (officeId !== null) {
      filter.officeId = officeId;
    }
    if (status !== null) {
      filter.status = status;
    }
    const totalApplications = await prisma.application.count({
      where: filter,
    });
    const previousMonthApplications = await prisma.application.count({
      where: {
        ...filter, 
        createdAt: {
          gte: previousMonthDate,
          lt: currentDate,
        },
      },
    });
    const percentageChange =
      previousMonthApplications === 0
        ? 0
        : ((totalApplications - previousMonthApplications) / previousMonthApplications) * 100;
    const response = [
      {
        name: "Total Applications",
        value: totalApplications.toLocaleString(), 
        description: `${percentageChange.toFixed(2)}% from last month`,
      },
    ];
    return response;
  } catch (error) {
    throw error;
  }
};
