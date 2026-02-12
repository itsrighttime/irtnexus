import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ success: true, data: "You are using Private API" });
});

export const privateRoutes = router;
