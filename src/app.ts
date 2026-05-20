import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { pool } from "./db/index.js";
import { authRoute } from "./modules/auth/auth.route.js";
const app: Application = express();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Express Server",
    author: "Next Level",
  });
});

app.use("/api/auth", authRoute);

app.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, password, age } = req.body;
    const result = await pool.query(
      `INSERT INTO users(name, email, password, age) VALUES($1, $2, $3, $4) RETURNING *`,
      [name, email, password, age],
    );

    res
      .status(201)
      .send({ message: "user created successfully", result: result.rows[0] });
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
});

export default app;
