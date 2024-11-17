window.walletAddress;
async function connectWallet() {
    const connectButton = document.getElementById('connect-wallet-btn');
    if (window.ethereum && window.ethereum.isMetaMask) {
        web3 = new Web3(window.ethereum);
        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            console.log('Connected account:', userAccount);
            window.walletAddress = userAccount;
            // document.getElementById('wallet-address').innerText = `Connected Wallet: ${userAccount}`;
            
            // Update button classes
            connectButton.classList.remove('is-danger', 'is-inverted', 'is-outlined');
            connectButton.classList.add('is-success', 'is-inverted', 'is-outlined');
            document.getElementById('connect-wallet-btn').innerText = 'Connected';
            if (document.getElementsByClassName('redirect_if')[0].innerText === 'Connected') {
                //console.log('Redirecting to home page...');
                const maskedAddress = `${userAccount.slice(0, 2)}...${userAccount.slice(-4)}`;
                document.getElementById('wllt_addr').innerText = `Connected Wallet: ${maskedAddress}`;
                setTimeout(() => {
                    window.location.href = '/mod?username=' + localStorage.getItem('username');
                }, 1500);
            }

        } catch (error) {
            console.error('User denied account access', error);
        }
    } else {
        console.error('MetaMask is not installed');
        
        // Update button classes
        connectButton.classList.remove('is-success', 'is-inverted', 'is-outlined');
        connectButton.classList.add('is-danger', 'is-inverted', 'is-outlined');
    }
}
document.getElementById('connect-wallet-btn').addEventListener('click', connectWallet);