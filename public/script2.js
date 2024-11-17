let chart;
let currentCurrency = 'BTC';

function updateChart(currency) {
    const ctx = document.getElementById('btc-chart').getContext('2d');
    const priceElement = document.getElementById('btc-price');
    
    // Update active button
    document.querySelectorAll('.currency-buttons button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${currency.toLowerCase()}-btn`).classList.add('active');

    // API endpoints for different currencies
    const endpoints = {
        'BTC': 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30',
        'ETH': 'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30',
        'SOL': 'https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=30'
    };

    // Fetch current price
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${currency === 'BTC' ? 'bitcoin' : currency === 'ETH' ? 'ethereum' : 'solana'}&vs_currencies=usd`)
        .then(response => response.json())
        .then(data => {
            const price = data[currency === 'BTC' ? 'bitcoin' : currency === 'ETH' ? 'ethereum' : 'solana'].usd;
            priceElement.textContent = `Current ${currency} Price: $${price}`;
        });

    // Fetch historical data
    fetch(endpoints[currency])
        .then(response => response.json())
        .then(data => {
            if (chart) {
                chart.destroy();
            }

            let prices, dates;
            prices = data.prices.map(price => price[1]);
            dates = data.prices.map(price => new Date(price[0]).toLocaleDateString());

            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: `${currency} to USD`,
                        data: prices,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            });
        });
}

document.addEventListener('DOMContentLoaded', function() {
    updateChart('BTC');

    document.getElementById('btc-btn').addEventListener('click', () => updateChart('BTC'));
    document.getElementById('eth-btn').addEventListener('click', () => updateChart('ETH'));
    document.getElementById('sol-btn').addEventListener('click', () => updateChart('SOL'));
});









async function fetchAPOD() {
    const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
    const data = await response.json();
    const apodContainer = document.getElementById('apod-container');
    apodContainer.innerHTML = `
        <div class="box" style="display: flex; align-items: flex-start; width: 68%  ;">
            <img src="${data.url}" alt="${data.title}" style="width: 30%; margin-right: 20px;">
            <div style="width: 70%;">
                <h2 class="subtitle">${data.title}</h2>
                <p>${data.explanation}</p>
            </div>
        </div>
    `;
}
fetchAPOD();