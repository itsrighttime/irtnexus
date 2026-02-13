import express from "express";
import { userRoute } from "./user.route.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ success: true, data: "You are using Private API" });
});

router.use("/users", userRoute);

export const publicRoutes = router;
