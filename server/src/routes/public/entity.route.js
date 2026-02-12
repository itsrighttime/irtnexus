import express from "express";
import { entityController, entityRelController } from "#controllers";

const router = express.Router();

router.post("/", entityController.createEntity);
router.post("/relationship", entityRelController.addRelationship);
router.patch("/", entityController.updateEntity);

export const entityRoute = router;
