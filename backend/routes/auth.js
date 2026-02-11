const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// ⚠️ DEMO ONLY - Replace with real database integration
// These are demo accounts for development/testing purposes
// In production, passwords should be properly hashed and stored securely
const mockUsers = [
	{
		id: 1,
		email: "demo@example.com",
		password: require('crypto').createHash('sha256').update('demo-password-change-me').digest('hex'),
		name: "Demo User",
	},
	{
		id: 2,
		email: "user@test.com", 
		password: require('crypto').createHash('sha256').update('test-password-change-me').digest('hex'),
		name: "Test User",
	},
	{
		id: 3,
		email: "admin@admin.com",
		password: require('crypto').createHash('sha256').update('admin-password-change-me').digest('hex'),
		name: "Admin User",
	},
];

// JWT secret key - MUST use environment variable in production!
// ⚠️ SECURITY CRITICAL: Change this in production and use process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || "insecure-dev-key-change-in-production-" + Date.now();

// Middleware to parse JSON
router.use(express.json());

// POST /api/auth/login - Login endpoint
router.post("/login", async (req, res) => {
	console.log("📧 Login attempt:", req.body);

	const { email, password } = req.body;

	// Validate input
	if (!email || !password) {
		return res.status(400).json({
			success: false,
			error: "Email and password are required",
		});
	}

	// Find user in mock database
	// ⚠️ SECURITY: In production, use bcrypt to compare hashed passwords
	const hashedPassword = require('crypto').createHash('sha256').update(password).digest('hex');
	const user = mockUsers.find(
		(u) =>
			u.email.toLowerCase() === email.toLowerCase() && u.password === hashedPassword,
	);

	if (!user) {
		console.log("❌ Login failed: Invalid credentials");
		return res.status(401).json({
			success: false,
			error: "Invalid email or password",
		});
	}

	// Generate JWT token
	const token = jwt.sign(
		{
			id: user.id,
			email: user.email,
			name: user.name,
		},
		JWT_SECRET,
		{ expiresIn: "24h" },
	);

	console.log("✅ Login successful for:", user.email);
	console.log("🔐 Generated token:", token.substring(0, 50) + "...");

	res.json({
		success: true,
		message: "Login successful",
		data: {
			token,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
		},
	});
});

// POST /api/auth/register - Register endpoint
router.post("/register", async (req, res) => {
	console.log("📝 Registration attempt:", req.body);

	const { email, password, name } = req.body;

	// Validate input
	if (!email || !password) {
		return res.status(400).json({
			success: false,
			error: "Email and password are required",
		});
	}

	// Check if user already exists
	const existingUser = mockUsers.find(
		(u) => u.email.toLowerCase() === email.toLowerCase(),
	);

	if (existingUser) {
		return res.status(409).json({
			success: false,
			error: "User with this email already exists",
		});
	}

	// Create new user
	const newUser = {
		id: mockUsers.length + 1,
		email,
		password,
		name: name || "New User",
	};

	// Add to mock database
	mockUsers.push(newUser);

	console.log("✅ User registered successfully:", newUser.email);

	res.status(201).json({
		success: true,
		message: "Registration successful",
		data: {
			user: {
				id: newUser.id,
				email: newUser.email,
				name: newUser.name,
			},
		},
	});
});

// GET /api/auth/verify - Verify token endpoint
router.get("/verify", (req, res) => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.status(401).json({
			success: false,
			error: "No token provided",
		});
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);

		res.json({
			success: true,
			message: "Token is valid",
			data: {
				user: decoded,
			},
		});
	} catch (error) {
		res.status(401).json({
			success: false,
			error: "Invalid token",
		});
	}
});

// GET /api/auth/users - Get all users (for testing)
router.get("/users", (req, res) => {
	const usersWithoutPasswords = mockUsers.map((user) => ({
		id: user.id,
		email: user.email,
		name: user.name,
	}));

	res.json({
		success: true,
		data: {
			users: usersWithoutPasswords,
		},
	});
});

// POST /api/auth/logout - Logout endpoint (client-side token removal)
router.post("/logout", (req, res) => {
	console.log("👋 Logout request received");

	res.json({
		success: true,
		message: "Logged out successfully",
	});
});

module.exports = router;
