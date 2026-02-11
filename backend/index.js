const express = require("express");
const path = require("path");
const config = require("config");

const app = express();
const PORT = config.get("port");

// Middleware
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// CORS middleware for React Native development
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization",
	);

	// Handle preflight requests
	if (req.method === "OPTIONS") {
		res.sendStatus(200);
	} else {
		next();
	}
});

// Routes
const listings = require("./routes/listings");
const auth = require("./routes/auth");

app.use("/api/listings", listings);
app.use("/api/auth", auth);

// Basic home route
app.get("/", (req, res) => {
	res.json({
		message: "🚀 React Native Backend API Server",
		version: "1.0.0",
		endpoints: {
			auth: {
				login: "POST /api/auth/login",
				register: "POST /api/auth/register",
				verify: "GET /api/auth/verify",
				users: "GET /api/auth/users",
				logout: "POST /api/auth/logout",
			},
			listings: "GET /api/listings",
		},
		testCredentials: [
			{ email: "demo@example.com", password: "password123" },
			{ email: "user@test.com", password: "test123" },
			{ email: "admin@admin.com", password: "admin123" },
		],
	});
});

app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
	console.log(`📍 API Base URL: http://localhost:${PORT}`);
	console.log(
		`🔐 Auth endpoints available at: http://localhost:${PORT}/api/auth`,
	);
	console.log(`📋 Test credentials:`);
	console.log(`   - demo@example.com / password123`);
	console.log(`   - user@test.com / test123`);
	console.log(`   - admin@admin.com / admin123`);
});
