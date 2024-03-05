const express = require("express");
require("dotenv").config();
const invoices = require("./routes/invoices");
const types = require("./routes/types");
const summaries = require("./routes/summaries");
const analyze = require("./routes/analyze");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

mongoose
	.connect(
		"mongodb+srv://valentin:upjv@budgeteye.tymhruh.mongodb.net?retryWrites=true&w=majority&appName=BudgetEye/budgeteye"
	)
	.then(() => console.log("Connected to MongoDB..."))
	.catch((err) => console.error("Could not connect to MongoDB..."));

app.use(express.json());

app.use(cors());
app.use(express.static("public"));

app.use("/api/invoices", invoices);
app.use("/api/types", types);
app.use("/api/summaries", summaries);
app.use("/api/analyze", analyze);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
	console.log(`serveur lance sur le port : ${PORT}`);
});
