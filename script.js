const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';
let cryptoData = [];

async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        cryptoData = data;
        renderTable(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function renderTable(data) {
    const tbody = document.getElementById('cryptoTableBody');
    tbody.innerHTML = '';
    data.forEach(crypto => {
        const priceChangeClass = crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${crypto.image}" alt="${crypto.name}" width="30"></td>
            <td>${crypto.name}</td>
            <td>${crypto.symbol.toUpperCase()}</td>
            <td>$${crypto.current_price}</td>
            <td>$${crypto.total_volume}</td>
            <td class="${priceChangeClass}">${crypto.price_change_percentage_24h}%</td>
            <td>Mkt Cap: $${crypto.market_cap}</td>
        `;
        tbody.appendChild(row);
    });
}

document.getElementById('searchInput').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const filteredData = cryptoData.filter(crypto => 
        crypto.name.toLowerCase().includes(query) || 
        crypto.symbol.toLowerCase().includes(query)
    );
    renderTable(filteredData);
});

function sortTable(criteria) {
    let sortedData;
    if (criteria === 'market_cap') {
        sortedData = [...cryptoData].sort((a, b) => b.market_cap - a.market_cap);
    } else if (criteria === 'percentage_change') {
        sortedData = [...cryptoData].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    }
    renderTable(sortedData);
}

// Fetch data on page load
fetchData();
