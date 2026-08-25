const currencies = ["USD", "NPR", "EUR", "INR", "GBP"];

function CurrencySelector({ value, onChange }) {
    return (
        <div className="currency-selector">
            <label htmlFor="home-currency">
                Home Currency
            </label>

            <select
                id="home-currency"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            >
                {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                        {currency}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default CurrencySelector;