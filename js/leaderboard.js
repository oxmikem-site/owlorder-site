
let allEntries = [];

async function loadLeaderboard() {
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSdLAOdM_GrsuOclMYL9ltUVyzC_Y7Z_9Jf7ITs-tYuqj1ekgrsH76KGu14CyZ0li7vnROOSpn6FpnG/pub?gid=1127131432&single=true&output=csv';
  const response = await fetch(url);
  const text = await response.text();

  const rows = text.trim().split('\n').map(row => {
    const match = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
    return match.map(cell => cell.replace(/^"|"$/g, ''));
  });

  allEntries = rows.slice(1).map(row => {
    const [rank, address, , pointsRaw] = row;
    const cleanPoints = pointsRaw.replace(/,/g, '');
    return { rank, address, points: cleanPoints };
  });

  renderEntries(allEntries);
}

function renderEntries(entries) {
  const container = document.getElementById('leaderboard-list');
  container.innerHTML = '';
  entries.forEach(({ rank, address, points }) => {
    const shortAddr = address.slice(0, 6) + '...' + address.slice(-4);
    const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`;
    const entry = document.createElement('div');
    entry.className = 'leaderboard-entry';
    entry.innerHTML = `
      <div class="rank">${rank}</div>
      <div class="wallet">
        <img src="${avatarUrl}" alt="Avatar" width="36" height="36" />
        <span>${shortAddr}</span>
      </div>
      <div class="points">${points}</div>
    `;
    container.appendChild(entry);
  });
}

document.getElementById('search').addEventListener('input', (e) => {
  const value = e.target.value.toLowerCase();
  const filtered = allEntries.filter(entry => entry.address.toLowerCase().includes(value));
  renderEntries(filtered);
});

loadLeaderboard();
