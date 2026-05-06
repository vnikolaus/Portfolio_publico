import { Router } from "express";
import { createOrderController, getOrderController } from "../../infra/container";

export const orderRoutes = Router();

orderRoutes.post("/", (request, response) =>
    createOrderController.handle(request, response),
);

orderRoutes.get("/:orderId", (request, response) =>
    getOrderController.handle(request, response),
);
