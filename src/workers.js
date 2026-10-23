import { Hono } from "hono";

const app = new Hono();

// Home
app.get("/", (c) => c.json({ title: "Vehicle Rental Platform" }));

// Search
app.get("/search", (c) => c.json({ filters: {}}));

// Vehicle detail
app.get("/vehicle/:id", (c) => c.json({ vehicle: { id: c.req.param("id"), name: "Sample", type: "van"}}));

// Login
app.post("/login", (c) => c.json({ success: true }));

// Register
app.post("/register", (c) => c.json({ success: true }));

// Owner dashboard
app.get("/dashboard", (c) => c.json({ title: "Owner Dashboard" }));

// My bookings
app.get("/my-bookings", (c) => c.json({ title: "My Bookings" }));

// Profile
app.get("/profile", (c) => c.json({ title: "Profile" }));

// Owner vehicles
app.get("/owner/vehicles", (c) => c.json({ title: "My Vehicles" }));

// Owner bookings
app.get("/owner/bookings", (c) => c.json({ title: "Owner Bookings" }));

// Admin dashboard
app.get("/admin/dashboard", (c) => c.json({ title: "Admin Dashboard" }));

// Admin vehicles
app.get("/admin/vehicles", (c) => c.json({ title: "Admin Vehicles" }));

// Admin bookings
app.get("/admin/bookings", (c) => c.json({ title: "Admin Bookings" }));

// Admin users
app.get("/admin/users", (c) => c.json({ title: "Admin Users" }));

// Admin revenue
app.get("/admin/revenue", (c) => c.json({ title: "Admin Revenue" }));

// API: add vehicle
app.post("/api/vehicles", (c) => c.json({ success: true }));

// API: book vehicle
app.post("/api/bookings", (c) => c.json({ success: true }));

// API: upload image
app.post("/api/upload-image", (c) => c.json({ success: true }));

export default app;
export { app };