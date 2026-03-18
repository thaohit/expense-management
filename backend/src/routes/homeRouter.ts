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

// Expense
homeRouter.get("/api/v1/get-data", homeController.expenseSave);


