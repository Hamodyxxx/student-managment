import express from "express";
import { errorHandler } from "./middlewares/error_handler.middleware.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";

import AdminRouter from "./routes/admin.js";
import ClassesRouter from "./routes/classes.js";
import ExamRouter from "./routes/exam.js";
import HomeworkRouter from "./routes/homework.js";
import InventoryRouter from "./routes/inventory.js";
import LessonRouter from "./routes/lesson.js";
import ParentsRouter from "./routes/parents.js";
import StudentGradesRouter from "./routes/student-grades.js";
import StudentsRouter from "./routes/students.js";
import SubjectRouter from "./routes/subject.js";
import TeacherRouter from "./routes/teacher.js";
import UserRouter from "./routes/user.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggerMiddleware);

app.use("/api/admin", AdminRouter);
app.use("/api/classes", ClassesRouter);
app.use("/api/exam", ExamRouter);
app.use("/api/homework", HomeworkRouter);
app.use("/api/inventory", InventoryRouter);
app.use("/api/lesson", LessonRouter);
app.use("/api/parents", ParentsRouter);
app.use("/api/student-grades", StudentGradesRouter);
app.use("/api/students", StudentsRouter);
app.use("/api/subject", SubjectRouter);
app.use("/api/teacher", TeacherRouter);
app.use("/api/user", UserRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

