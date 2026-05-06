import { Router } from "express";
import { eventController } from "../../infra/container";

export const eventRoutes = Router();

eventRoutes.post("/", (request, response) =>
    eventController.create(request, response),
);

eventRoutes.get("/", (request, response) =>
    eventController.findAll(request, response),
);

eventRoutes.put("/:eventId", (request, response) =>
    eventController.update(request, response),
);

eventRoutes.delete("/:eventId", (request, response) =>
    eventController.delete(request, response),
);
