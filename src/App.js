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
    padding: '10rem 2rem',
  },
  rightColumn: {
    minHeight: '100vh', 
    padding: '10rem 5rem',
  },
  walletContainer: {
    borderRadius: '4px',
    backgroundColor: '#cfcfcf',
    padding: '2.5rem'
  },
  sidebar: {
    fontSize: '1rem',
    margin: '1rem',
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

const localStorageSim = [
  {
    nickname: 'wallet 1' || '',
    type: 'wallet' || 'group',
    address: 12345 || '',
  },
  {
    nickname: 'wallet nickname 2' || '',
    type: 'wallet' || 'group',
    address: 67890 || '',
  },
];


function App() {
  // const [wallet, setWallet] = useState(wallets ? wallets[0] : null);
  const [wallet, setWallet] = useState( [0]);
  const [storedAddys, setStoredAddys] = useState(localStorageSim);
  const [newAddy, setNewAddy] = useState({nickname: '', address: null});
  const [balance, setBalance] = useState('');
  const classes = useStyles();

  const handleWalletSelect = async (address) => {
    const w = storedAddys.find(w => address === w.address)
    const info = await getAddressInfo(address)
    setWallet(w);
    setBalance(info.balance);
  }

  const getAddressInfo = async (address) => {
    const info = await fetch(apiUrl + address,{
      headers:{
        'Content-Type': 'application/json'
      },
    });
    return await info.json();
  }

  const getSavedAddys = async () => {
    const addys = await localStorage.getItem('addresses');
    const parsedAddys = await JSON.parse(addys);
    setStoredAddys(parsedAddys);
  }

  useEffect(()=>{
    getSavedAddys();
  },[])

  const handleAddWallet = (e) => {
    e.preventDefault();
    console.log('current')
    const current = localStorage.getItem('addresses')
    const updated = current ? [...current, newAddy] : [newAddy];
    console.log(updated)
    localStorage.setItem('addresses', JSON.stringify(updated));
  }

  const updateAddress = (field, value) => {
    setNewAddy({...newAddy, [field]: value});
  }


  return (
    <Box style={{minHeight: '100%'}}>
      <Grid container>
        <Grid className={classes.leftColumn} item xs={3}>
          {storedAddys?.map((w)=> {
            return <div className={classes.sidebar} onClick={()=>handleWalletSelect(w.address)} name={w.address.toString()} key={w.address}>
              <AccountBalanceWalletIcon/>
              <span>{w.nickname}</span>
            </div>
          })}
        </Grid>
        <Grid item xs={9} className={classes.rightColumn}>
          <div className={classes.walletContainer}>
            <h2>{wallet.nickname}</h2>
            <i>address: {wallet.address}</i>
            <table className={classes.transactions}>
              <thead>
                {/* <td>Date</td> */}
                <td>Amount</td>
                <td>USD Value</td>
              </thead>
              <tbody>
                <tr>
                  {/* <td>4-22-2022</td> */}
                  <td>{balance} (SATS)</td>
                  <td>$FAKE DATA (USD)</td>
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
