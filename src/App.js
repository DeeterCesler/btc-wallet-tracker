import React, {useState, useEffect} from 'react';
import './App.css';
// import ReactDOM from 'react-dom';
import {Box, Grid} from '@mui/material';
import {makeStyles} from '@mui/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const useStyles = makeStyles({
  leftColumn: {
    backgroundColor: '#cfcfcf',
    minHeight: '100vh', 
    padding: '6rem 2rem',
  },
  rightColumn: {
    minHeight: '100vh', 
    padding: '5rem 5rem',
  },
  walletContainer: {
    borderRadius: '4px',
    backgroundColor: '#cfcfcf',
    padding: '2rem'
  },
  sidebar: {
    fontSize: '1rem',
    alignItems: 'vertical',
    '& svg': {
      height: '1rem'
    }
  },
  transactions: {
    "td":{
      margin: '0.5rem'
    }
  }
});

const apiUrl = "https://api.blockcypher.com/v1/btc/main/addrs/";


function App() {
  // const [wallet, setWallet] = useState(wallets ? wallets[0] : null);
  const [wallet, setWallet] = useState({
    nickname: 'No Wallet selected',
    type: 'wallet',
    address: 'none'
  });
  const [storedAddys, setStoredAddys] = useState([wallet]);
  const [newAddy, setNewAddy] = useState({nickname: '', address: null});
  const [balance, setBalance] = useState(0);
  const classes = useStyles();

  const handleWalletSelect = async (address) => {
    const w = storedAddys?.find(w => address === w.address)
    const info = await getAddressInfo(address)
    setWallet(w);
    setBalance(info.balance);
  }

  const getAddressInfo = async (address) => {
    console.log('before')
    if (address.toString().length > 6) {
      console.log('then')
      const info = await fetch(apiUrl + address);
      console.log('here?')
      return await info.json();
    } 
    else return wallet;
  }

  const getSavedAddys = async () => {
    const addys = await localStorage.getItem('addresses');
    const parsedAddys = await JSON.parse(addys);
    await setStoredAddys(parsedAddys);
    await handleWalletSelect(storedAddys[storedAddys.length - 1].address);
  }

  useEffect(()=>{
    getSavedAddys();
  },[])

  const handleAddWallet = (e) => {
    e.preventDefault();
    const JSONaddys = localStorage.getItem('addresses');
    const parsedAddys = JSON.parse(JSONaddys);
    const updated = parsedAddys ? [...parsedAddys, newAddy] : [newAddy];
    localStorage.setItem('addresses', JSON.stringify(updated));
    getSavedAddys();
  }

  const updateAddress = (field, value) => {
    setNewAddy({...newAddy, [field]: value});
  }


  return (
    <Box style={{minHeight: '100%'}}>
      <Grid container>
        <Grid className={classes.leftColumn} item xs={3}>
          <h2>Saved Addresses</h2>
          {storedAddys?.map((w)=> {
            return <div className={classes.sidebar} onClick={()=>handleWalletSelect(w.address)} name={w?.address?.toString()} key={w.address}>
              <AccountBalanceWalletIcon/>
              <span>{w.nickname}</span>
            </div>
          })}
        </Grid>
        <Grid item xs={9} className={classes.rightColumn}>
          <h1>BTC Address Checker</h1>
          <div className={classes.walletContainer}>
            <h3>{wallet.nickname}</h3>
            <i>address: {wallet.address}</i>
            <br/>
            <br/>
            <table className={classes.transactions}>
              <thead>
                <tr>
                  {/* <td>Date</td> */}
                  <th>Amount</th>
                  <th>USD Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* <td>4-22-2022</td> */}
                  <td>{balance} (SATS)</td>
                  <td>{balance} (USD)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <form onSubmit={handleAddWallet}>
            <h5>Track a new address</h5>
            <input name="nickname" placeholder='nickname' onChange={(e)=>updateAddress('nickname',e.target.value)} />
            <br/>
            <input name="address" placeholder='address' onChange={(e)=>updateAddress('address',e.target.value)} />
            <br/>
            <button type="submit" >add address</button>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
}


export default App;
