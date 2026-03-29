import { Router } from "express";

import * as homeController from "../controllers/homeController";

export const homeRouter = Router();

// 
// homeRouter.get("/", showHome);
// Year
homeRouter.get("/api/v1/all-year", homeController.viewYearv1);
homeRouter.post("/api/v1/year", homeController.saveYearv1);
homeRouter.delete("/api/v1/year", homeController.deleteYearv1);
homeRouter.put("/api/v1/year", homeController.updateYearv1);


// Month
homeRouter.get("/api/v1/time", homeController.viewTimev1);
homeRouter.post("/api/v1/time", homeController.saveTimev1);
homeRouter.delete("/api/v1/time", homeController.deleteTimev1);


// Category
homeRouter.get("/api/v1/category", homeController.viewCategoryv1);
homeRouter.post("/api/v1/category", homeController.saveCategoryv1);
homeRouter.put("/api/v1/category", homeController.updateCategoryv1);
homeRouter.delete("/api/v1/category", homeController.deleteCategoryv1);

// Expense
homeRouter.get("/api/v1/expense", homeController.viewExpensev1);
homeRouter.post("/api/v1/expense", homeController.saveExpensev1);
homeRouter.put("/api/v1/expense", homeController.updateExpensev1);
homeRouter.delete("/api/v1/expense", homeController.deleteExpensev1);


