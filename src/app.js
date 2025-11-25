import express from "express";
import { errorHandler } from "./middlewares/error_handler.middleware.js";
import InventoryRouter from "./routes/inventory.js"; 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Api Routes
app.use("/inventory", InventoryRouter);

// error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

