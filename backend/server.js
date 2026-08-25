const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

const expenses = [];
let nextId = 1;

const supportedCurrencies = ["USD", "NPR", "EUR", "INR", "GBP"];

app.use(cors());
app.use(express.json());


// Health check
app.get("/", (req, res) => {
    res.json({ message: "Expense Tracker API is running" });
});


// Get all expenses
app.get("/expenses", (req, res) => {
    res.json(expenses);
});


// Add a new expense
app.post("/expenses", (req, res) => {
    const { title, amount, currency } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    if (amount === undefined || amount === null || amount === "") {
        return res.status(400).json({
            error: "Amount is required"
        });
    }

    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({
            error: "Amount must be a positive number"
        });
    }

    if (!currency || typeof currency !== "string") {
        return res.status(400).json({
            error: "Currency is required"
        });
    }

    const normalizedCurrency = currency.trim().toUpperCase();

    if (!supportedCurrencies.includes(normalizedCurrency)) {
        return res.status(400).json({
            error: `Unsupported currency. Supported currencies are: ${supportedCurrencies.join(", ")}`
        });
    }

    const expense = {
        id: nextId++,
        title: title.trim(),
        amount,
        currency: normalizedCurrency,
        date: new Date().toISOString()
    };

    expenses.push(expense);

    res.status(201).json(expense);
});


// Delete an expense
app.delete("/expenses/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            error: "Invalid expense ID"
        });
    }

    const expenseIndex = expenses.findIndex((expense) => expense.id === id);

    if (expenseIndex === -1) {
        return res.status(404).json({
            error: "Expense not found"
        });
    }

    expenses.splice(expenseIndex, 1);

    res.status(204).send();
});


// Currency conversion
app.get("/convert", async (req, res) => {
    const { from, to, amount } = req.query;

    if (!from || !to || amount === undefined) {
        return res.status(400).json({
            error: "from, to, and amount are required"
        });
    }

    const sourceCurrency = from.trim().toUpperCase();
    const targetCurrency = to.trim().toUpperCase();
    const numericAmount = Number(amount);

    if (!supportedCurrencies.includes(sourceCurrency)) {
        return res.status(400).json({
            error: `Unsupported source currency: ${sourceCurrency}`
        });
    }

    if (!supportedCurrencies.includes(targetCurrency)) {
        return res.status(400).json({
            error: `Unsupported target currency: ${targetCurrency}`
        });
    }

    if (!Number.isFinite(numericAmount) || numericAmount < 0) {
        return res.status(400).json({
            error: "Amount must be a valid non-negative number"
        });
    }

    if (sourceCurrency === targetCurrency) {
        return res.json({
            from: sourceCurrency,
            to: targetCurrency,
            amount: numericAmount,
            convertedAmount: numericAmount
        });
    }

    try {
        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, 5000);

        const url = `https://api.frankfurter.dev/v2/rate/${sourceCurrency}/${targetCurrency}`;

        const response = await fetch(url, {
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            return res.status(502).json({
                error: "Currency conversion service is unavailable"
            });
        }

        const data = await response.json();

        if (typeof data.rate !== "number") {
            return res.status(502).json({
                error: "Currency conversion service returned an unexpected response"
            });
        }

        const convertedAmount = numericAmount * data.rate;

        res.json({
            from: sourceCurrency,
            to: targetCurrency,
            amount: numericAmount,
            convertedAmount: Number(convertedAmount.toFixed(2))
        });

    } catch (error) {
        if (error.name === "AbortError") {
            return res.status(504).json({
                error: "Currency conversion service timed out"
            });
        }

        console.error("Currency conversion error:", error);

        return res.status(502).json({
            error: "Unable to convert currency at this time"
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
