// Load environment variables first
require("dotenv").config();

const express = require("express");
const path = require("path");
const config = require("config");

const app = express();
const PORT = process.env.PORT || config.get("port") || 3000;

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
		// ⚠️ DEMO ONLY - Remove these test credentials in production!
		testCredentials: [
			{ email: "demo@example.com", password: "demo-password-change-me" },
			{ email: "user@test.com", password: "test-password-change-me" },
			{ email: "admin@admin.com", password: "admin-password-change-me" },
		],
	});
});

app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
	console.log(`📍 API Base URL: http://localhost:${PORT}`);
	console.log(
		`🔐 Auth endpoints available at: http://localhost:${PORT}/api/auth`,
	);
	console.log(`📋 Demo credentials (for testing only):`);
	console.log(`   ⚠️  demo@example.com / demo-password-change-me`);
	console.log(`   ⚠️  user@test.com / test-password-change-me`);
	console.log(`   ⚠️  admin@admin.com / admin-password-change-me`);
	console.log(`   📖 See DEMO_ACCOUNTS.md for details`);
});
