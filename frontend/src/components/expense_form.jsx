import { useState } from "react";
import { addExpense } from "../services/api";

const currencies = ["USD", "NPR", "EUR", "INR", "GBP"];

function ExpenseForm({ onExpenseAdded }) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("NPR");

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        const trimmedTitle = title.trim();
        const numericAmount = Number(amount);

        if (!trimmedTitle) {
            setError("Please enter an expense title.");
            return;
        }

        if (
            amount === "" ||
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {
            setError("Please enter a valid positive amount.");
            return;
        }

        try {
            setSubmitting(true);

            const expense = await addExpense({
                title: trimmedTitle,
                amount: numericAmount,
                currency
            });

            onExpenseAdded(expense);

            setTitle("");
            setAmount("");
            setCurrency("NPR");
        } catch (error) {
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form className="expense-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="expense-title">
                    Title
                </label>

                <input
                    id="expense-title"
                    type="text"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                    placeholder="e.g. Lunch"
                    disabled={submitting}
                />
            </div>

            <div className="form-group">
                <label htmlFor="expense-amount">
                    Amount
                </label>

                <input
                    id="expense-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(event) =>
                        setAmount(event.target.value)
                    }
                    placeholder="e.g. 500"
                    disabled={submitting}
                />
            </div>

            <div className="form-group">
                <label htmlFor="expense-currency">
                    Currency
                </label>

                <select
                    id="expense-currency"
                    value={currency}
                    onChange={(event) =>
                        setCurrency(event.target.value)
                    }
                    disabled={submitting}
                >
                    {currencies.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            {error && (
                <p className="form-error">
                    {error}
                </p>
            )}

            <button type="submit" disabled={submitting}>
                {submitting ? "Adding..." : "Add Expense"}
            </button>
        </form>
    );
}

export default ExpenseForm;