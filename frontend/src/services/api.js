const API_BASE_URL = "http://localhost:5000";

export async function getExpenses() {
    const response = await fetch(`${API_BASE_URL}/expenses`);

    if (!response.ok) {
        throw new Error("Failed to fetch expenses");
    }

    return response.json();
}

export async function addExpense(expense) {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(expense)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to add expense");
    }

    return data;
}

export async function deleteExpense(id) {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        let data;

        try {
            data = await response.json();
        } catch {
            data = {};
        }

        throw new Error(data.error || "Failed to delete expense");
    }
}

export async function convertCurrency(from, to, amount) {
    const params = new URLSearchParams({
        from,
        to,
        amount: amount.toString()
    });

    const response = await fetch(
        `${API_BASE_URL}/convert?${params.toString()}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Currency conversion failed");
    }

    return data;
}