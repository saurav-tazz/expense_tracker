import { useEffect, useState } from "react";
import "./App.css";
import ExpenseForm from "./components/expense_form";
import ExpenseList from "./components/expense_list";
import CurrencySelector from "./components/currency_selector";
import {
    getExpenses,
    convertCurrency
} from "./services/api";

function App() {
    const [expenses, setExpenses] = useState([]);
    const [homeCurrency, setHomeCurrency] = useState("NPR");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [convertedAmounts, setConvertedAmounts] = useState({});
    const [conversionLoading, setConversionLoading] = useState(false);
    const [conversionError, setConversionError] = useState("");

    useEffect(() => {
        async function loadExpenses() {
            try {
                setLoading(true);
                setError("");

                const data = await getExpenses();

                setExpenses(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadExpenses();
    }, []);

    useEffect(() => {
        async function convertExpenses() {
            if (expenses.length === 0) {
                setConvertedAmounts({});
                setConversionError("");
                return;
            }

            try {
                setConversionLoading(true);
                setConversionError("");

                const results = await Promise.all(
                    expenses.map(async (expense) => {
                        try {
                            const result = await convertCurrency(
                                expense.currency,
                                homeCurrency,
                                expense.amount
                            );

                            return {
                                id: expense.id,
                                convertedAmount: result.convertedAmount,
                                error: null
                            };
                        } catch (error) {
                            return {
                                id: expense.id,
                                convertedAmount: null,
                                error: error.message
                            };
                        }
                    })
                );

                const amounts = {};
                const failedConversions = [];

                results.forEach((result) => {
                    if (result.error) {
                        failedConversions.push(result.error);
                    } else {
                        amounts[result.id] = result.convertedAmount;
                    }
                });

                setConvertedAmounts(amounts);

                if (failedConversions.length > 0) {
                    setConversionError(
                        "Some expenses could not be converted."
                    );
                }
            } finally {
                setConversionLoading(false);
            }
        }

        convertExpenses();
    }, [expenses, homeCurrency]);

    function handleExpenseAdded(expense) {
        setExpenses((currentExpenses) => [
            ...currentExpenses,
            expense
        ]);
    }

    function handleExpenseDeleted(id) {
        setExpenses((currentExpenses) =>
            currentExpenses.filter((expense) => expense.id !== id)
        );
    }

    const total = Object.values(convertedAmounts).reduce(
        (sum, amount) => sum + amount,
        0
    );

    return (
        <div className="app">
            <header className="app-header">
                <div className="app-header-left">
                    <div className="app-header-title">
                        <h1>Expense Tracker</h1>
                    </div>
                </div>
            </header>

            <main className="app-main">
                <p className="disclaimer-note" style={{fontSize: '0.8em', color: '#666', marginBottom: '1rem'}}>
                    Note: This tool is for demonstration purposes only. Please do not use this for personal expense management.
                </p>
                <section className="expense-form-section">
                    <h2>Add Expense</h2>

                    <ExpenseForm
                        onExpenseAdded={handleExpenseAdded}
                    />
                </section>

                <section className="expense-list-section">
                    <div className="running-total-card">
                        <div className="running-total-header">
                            <span className="running-total-label">Running Total</span>
                            <CurrencySelector
                                value={homeCurrency}
                                onChange={setHomeCurrency}
                            />
                        </div>

                        <p className="running-total-amount">
                            {conversionLoading
                                ? "Calculating..."
                                : `${homeCurrency} ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </p>

                        <p className="running-total-subtitle">
                            {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
                        </p>
                    </div>

                    {loading && <p className="loading-text">Loading expenses...</p>}

                    {error && <p className="expense-list-error">{error}</p>}

                    {!loading && !error && (
                        <>
                            {conversionError && (
                                <p className="conversion-error">
                                    {conversionError}
                                </p>
                            )}

                            <ExpenseList
                                expenses={expenses}
                                convertedAmounts={convertedAmounts}
                                homeCurrency={homeCurrency}
                                onExpenseDeleted={handleExpenseDeleted}
                            />
                        </>
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;