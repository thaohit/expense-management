import { Router } from "express";

import * as homeController from "../controllers/homeController";

export const homeRouter = Router();

// 
// homeRouter.get("/", showHome);
// Year
homeRouter.get("/api/v2/year", homeController.viewYearv2);
homeRouter.post("/api/v2/year", homeController.saveYearv2);
homeRouter.delete("/api/v2/year", homeController.deleteYearv2);
homeRouter.put("/api/v2/year", homeController.updateYearv2);


// Month
homeRouter.get("/api/v2/time", homeController.viewTimev2);
homeRouter.post("/api/v2/time", homeController.saveTimev2);
homeRouter.delete("/api/v2/time", homeController.deleteTimev2);
homeRouter.put("/api/v2/time", homeController.updateTimev2);


// Category
homeRouter.get("/api/v2/category", homeController.viewCategoryv2);
homeRouter.get("/api/v2/category-by-year", homeController.getLitsCategoryByYearv1);
homeRouter.post("/api/v2/category", homeController.saveCategoryv2);
homeRouter.post("/api/v2/category-by-year", homeController.saveCategoryByYearv1);
homeRouter.put("/api/v2/category", homeController.updateCategoryv2);
homeRouter.delete("/api/v2/category", homeController.deleteCategoryv2);

// Expense
homeRouter.get("/api/v2/expense", homeController.viewExpensev2);
homeRouter.post("/api/v2/expense", homeController.saveExpensev2);
homeRouter.put("/api/v2/expense", homeController.updateExpensev2);
homeRouter.delete("/api/v2/expense", homeController.deleteExpensev2);

// Statistics
homeRouter.get("/api/v1/statistics", homeController.getStatisticsViewv1);
homeRouter.get("/api/v1/statistics-in-out", homeController.getStatisticsInOutViewv1);


