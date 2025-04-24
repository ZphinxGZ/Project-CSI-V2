import express from "express";
import connectDB from "./config/DB.js"; // นำเข้าไฟล์เชื่อมต่อ MySQL
import userRouter from "./Router/userRouter.js"; // นำเข้า userRouter
import roomRouter from "./Router/roomRoutes.js"; // นำเข้า roomRouter
import notificationRouter from "./Router/notificationRoutes.js"; // Import notificationRouter
import bookingRouter from "./Router/bookingRoutes.js"; // นำเข้า bookingRouter
import reportRouter from "./Router/reportRouter.js"; // เพิ่ม reportRouter
import calendarRouter from "./Router/calendarRouter.js"; // เพิ่ม calendarRouter
import authRouter from "./Router/authRoutes.js"; // นำเข้า authRouter
import morgan from "morgan";
import cors from "cors";
import fs from "fs"; // Import fs module
import path from "path";
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const app = express();
const PORT = 3456;

// Ensure the uploads directory exists
const uploadsDir = path.join(path.resolve(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware สำหรับ parse JSON body
app.use(express.json());
app.use(cors());

// Serve static files from the uploads directory
app.use("/uploads", express.static(uploadsDir));

// Middleware สำหรับ log IP ของผู้ใช้
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms - IP: :remote-addr")
);

// เชื่อมต่อ MySQL
await connectDB();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Meeting Room Booking API",
      version: "1.0.0",
      description: `Meeting Room Booking กลุ่มที่ 28 
คณะเทคโนโลยีสารสนเทศ สาขาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยศรีปทุม

สมาชิกกลุ่ม
- นายคุณากร ขำเจริญ รหัส 66075070
- นายนิติพน อุดมโภชน์ รหัส 66075854
- นายธีรพันธ์ เทียนพรหมทอง รหัส 66075063
- นางสาวณัฏณิชา ปรือปรัง รหัส 66013672
- นายเมธาพร ทองนาค รหัส 66087954

หมวดหมู่ API ทั้งหมดมีดังนี้
- Authentication จำนวน 5 API
- Booking จำนวน 6 API
- Calendar จำนวน 1 API
- Notification จำนวน 4 API
- Report จำนวน 1 API
- Room จำนวน 5 API
- User จำนวน 4 API
รวมทั้งหมด 26 API

การแบ่งงานของสมาชิกกลุ่ม:
- นายคุณากร ขำเจริญ 66075070
  - User จำนวน 4 API
  - Calendar จำนวน 1 API
- นายนิติพน อุดมโภชน์ 66075854
  - Authentication จำนวน 5 API
- นายธีรพันธ์ เทียนพรหมทอง 66075063
  - Room จำนวน 5 API
- นางสาวณัฏณิชา ปรือปรัง 66013672
  - Notification จำนวน 4 API
  - Report จำนวน 1 API
- นายเมธาพร ทองนาค 66087954
  - Booking จำนวน 6 API
      `,
    },
    servers: [
      {
        url: "http://localhost:3456",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./Router/*.js", "./controllers/*.js"], // Specify the files containing Swagger annotations
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ใช้ userRouter สำหรับเส้นทาง /api/users
app.use("/api/users", userRouter);

// ใช้ authRouter สำหรับเส้นทาง /api/auth
app.use("/api/auth", authRouter);

// ใช้ roomRouter สำหรับเส้นทาง /api/rooms
app.use("/api/rooms", roomRouter);

// ใช้ bookingRouter สำหรับเส้นทาง /api/bookings
app.use("/api/bookings", bookingRouter); // Use bookingRouter for bookings and reports

// ใช้ reportRouter สำหรับเส้นทาง /api/reports
app.use("/api/reports", reportRouter);

// ใช้ calendarRouter สำหรับเส้นทาง /api/calendar
app.use("/api/calendar", calendarRouter);

// ใช้ notificationRouter สำหรับเส้นทาง /api/notifications
app.use("/api/notifications", notificationRouter);

// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});