
const walletButtons = [
  document.getElementById('wallet-header'),
  document.getElementById('wallet-panel')
];

async function connectWallet() {
  if (!window.SatsConnect) {
    alert("Please open this site in a compatible wallet (Xverse, Unisat).");
    return;
  }

  window.SatsConnect.request('getAddresses', {
    payload: {
      purposes: ['ordinals', 'payment'],
      network: { type: 'Mainnet' },
      appInfo: {
        name: 'OWL',
        icon: 'https://owlbtc.art/logo.png'
      }
    },
    onFinish: (res) => {
      const address = res.addresses.find(a => a.purpose === 'ordinals')?.address;
      if (address) {
        localStorage.setItem('taproot_wallet', address);
        walletButtons.forEach(btn => {
          btn.textContent = `${address.slice(0, 6)}...${address.slice(-4)}`;
          btn.disabled = true;
          btn.style.opacity = '0.85';
        });
      }
    },
    onCancel: () => {
      console.warn('Wallet connection cancelled');
    }
  });
}

walletButtons.forEach(btn => {
  btn.addEventListener('click', connectWallet);
});

const saved = localStorage.getItem('taproot_wallet');
if (saved) {
  walletButtons.forEach(b => {
    b.textContent = `${saved.slice(0, 6)}...${saved.slice(-4)}`;
    b.disabled = true;
    b.style.opacity = '0.85';
  });
}

async function loadTop3() {
  try {
    const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSdLAOdM_GrsuOclMYL9ltUVyzC_Y7Z_9Jf7ITs-tYuqj1ekgrsH76KGu14CyZ0li7vnROOSpn6FpnG/pub?gid=1127131432&single=true&output=csv');
    const text = await res.text();
    const rows = text.trim().split('\n').map(r => r.split(','));
    const top3 = rows.slice(1, 4).map(r => {
      if (r[1] && r[3]) {
        return `<li>${r[1].slice(0, 6)}...${r[1].slice(-4)} - ${r[3]}</li>`;
      }
      return '<li>⚠️ Invalid data</li>';
    }).join('');
    document.getElementById('leaderboard-top3').innerHTML = top3;
  } catch (e) {
    document.getElementById('leaderboard-top3').innerHTML = '<li>⚠️ Failed to load leaderboard</li>';
  }
}

if (document.getElementById('leaderboard-top3')) {
  loadTop3();
}
