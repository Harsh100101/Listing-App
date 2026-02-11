const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Backend is running!");
});

const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Server started on port ${port}...`));
