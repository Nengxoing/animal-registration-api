import { Request, Response } from "express";
import { responseError } from "../lib";
import { prisma } from "../../prisma";

export const getTotalRevenueController = async (req: Request, res: Response) => {
  try {
    const { officeId, paymentMethod } = req.query;
    const data = await getTotalRevenueService(
      officeId ? Number(officeId) : null, 
      paymentMethod ? String(paymentMethod) : null, 
    );
    res.json({
      paymentMethod: "ok",
      result: data,
    });
  } catch (error) {
    responseError({ error, res });
  }
};

const getTotalRevenueService = async (officeId: number | null, paymentMethod: string | null) => {
  try {
    const currentDate = new Date();
    const previousMonthDate = new Date();
    previousMonthDate.setMonth(currentDate.getMonth() - 1);

    const filter: any = {};
    if (officeId !== null) {
      filter.officeId = officeId;
    }
    if (paymentMethod !== null) {
      filter.paymentMethod = paymentMethod;
    }

    const totalRevenue = await prisma.finance.aggregate({
      _sum: {
        amount: true,
      },
      where: filter,
    });

    const previousMonthRevenue = await prisma.finance.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        ...filter,
        createdAt: {
          gte: previousMonthDate,
          lt: currentDate,
        },
      },
    });

    const totalAmount = totalRevenue._sum.amount || 0;
    const previousMonthAmount = previousMonthRevenue._sum.amount || 0;

    const percentageChange =
      previousMonthAmount === 0
        ? 0
        : ((Number(totalAmount) - Number(previousMonthAmount)) / Number(previousMonthAmount)) * 100;
    const response = [
      {
        name: "Total Revenue",
        value: `$${totalAmount.toLocaleString()}`,
        description: `${percentageChange.toFixed(2)}% from last month`,
      },
    ];
    return response;
  } catch (error) {
    throw error;
  }
};
export const getRevenueAggregationController = async (req: Request, res: Response) => {
  try {
    const data = await getRevenueLast12MonthsService();
    res.json({
      status: "ok",
      result: data,
    });
  } catch (error) {
    responseError({ error, res });
  }
};

const getRevenueLast12MonthsService = async () => {
  try {
    const currentDate = new Date();
    const twelveMonthsAgo = new Date();
    const MONTHS_IN_YEAR = 12;
    twelveMonthsAgo.setMonth(currentDate.getMonth() - MONTHS_IN_YEAR);

    const monthlyRevenue = await prisma.$queryRaw<
      { month: number; year: number; total: number }[]
    >`
      SELECT 
        EXTRACT(MONTH FROM "createdAt") AS month,
        EXTRACT(YEAR FROM "createdAt") AS year,
        COALESCE(SUM(amount), 0) AS total
      FROM 
        "finance"
      WHERE 
        "createdAt" >= ${twelveMonthsAgo}
      GROUP BY 
        year, month
      ORDER BY 
        year, month
    `;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedData = monthlyRevenue.map(({ month, total }) => ({
      month: monthNames[month - 1], 
      revenue: Number(total), 
    }));
    const completeData = [];
    for (let i = 0; i < MONTHS_IN_YEAR; i++) {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - i);
      const monthName = monthNames[date.getMonth()];
      const existingMonth = formattedData.find((item) => item.month === monthName);
      completeData.unshift({
        name: monthName,
        value: existingMonth ? existingMonth.revenue : 0,
      });
    }

    return completeData;
  } catch (error) {
    throw error;
  }
};