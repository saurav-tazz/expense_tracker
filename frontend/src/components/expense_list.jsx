import { useState } from "react";
import { deleteExpense } from "../services/api";

function ExpenseList({
    expenses,
    convertedAmounts,
    homeCurrency,
    onExpenseDeleted
}) {
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");

    async function handleDelete(id) {
        try {
            setError("");
            setDeletingId(id);

            await deleteExpense(id);

            onExpenseDeleted(id);
        } catch (error) {
            setError(error.message);
        } finally {
            setDeletingId(null);
        }
    }

    if (expenses.length === 0) {
        return (
            <div className="expense-list-empty">
                <h3>No expenses yet</h3>
                <p>
                    Add your first expense using the form above.
                </p>
            </div>
        );
    }

    return (
        <div className="expense-list">
            {error && (
                <p className="expense-list-error">
                    {error}
                </p>
            )}

            {expenses.map((expense) => {
                const convertedAmount =
                    convertedAmounts[expense.id];

                return (
                    <article
                        className="expense-item"
                        key={expense.id}
                    >
                        <div className="expense-item-details">
                            <h3>{expense.title}</h3>

                            <p className="expense-original-amount">
                                {expense.amount.toFixed(2)}{" "}
                                {expense.currency}
                            </p>

                            <p className="converted-amount">
                                {convertedAmount !== undefined
                                    ? `≈ ${convertedAmount.toFixed(
                                          2
                                      )} ${homeCurrency}`
                                    : "Conversion unavailable"}
                            </p>

                            <small>
                                {new Date(
                                    expense.date
                                ).toLocaleString()}
                            </small>
                        </div>

                        <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                                handleDelete(expense.id)
                            }
                            disabled={
                                deletingId === expense.id
                            }
                        >
                            {deletingId === expense.id
                                ? "Deleting..."
                                : "Delete"}
                        </button>
                    </article>
                );
            })}
        </div>
    );
}

export default ExpenseList;