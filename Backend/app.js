import express from "express";
import connectDB from "./config/DB.js"; // นำเข้าไฟล์เชื่อมต่อ MongoDB
import userRouter from "./Router/userRouter.js"; // นำเข้า userRouter
import authRouter from "./Router/authRoutes.js"; // นำเข้า authRouter
import roomRouter from "./Router/roomRoutes.js"; // นำเข้า roomRouter
import bookingRouter from "./Router/bookingRoutes.js"; // นำเข้า bookingRouter
import notificationRouter from "./Router/notificationRoutes.js"; // Import notificationRouter
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();
const PORT = 3000;

// Middleware สำหรับ parse JSON body
app.use(express.json());

// เชื่อมต่อ MongoDB
await connectDB();

// ใช้ userRouter สำหรับเส้นทาง /api/users
app.use("/api/users", userRouter);

// ใช้ authRouter สำหรับเส้นทาง /api/auth
app.use("/api/auth", authRouter);

// ใช้ roomRouter สำหรับเส้นทาง /api/rooms
app.use("/api/rooms", roomRouter);

// ใช้ bookingRouter สำหรับเส้นทาง /api/bookings
app.use("/api/bookings", bookingRouter); // Use bookingRouter for bookings and reports

app.use("/api/notifications", notificationRouter); // Use notificationRouter

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Meeting Room Booking API",
      version: "1.0.0",
      description: "API documentation for the Meeting Room Booking system",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
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
  apis: ["./Router/*.js", "./middlewares/*.js"], // Include middlewares for security definitions
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});