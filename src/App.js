import React, {useState} from 'react';
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

// const wallets = localStorage.getItem('wallets');

const localStorageSim = [
  {
    nickname: 'wallet 1' || '',
    type: 'wallet' || 'group',
    id: 12345 || '',
  },
  {
    nickname: 'wallet nickname 2' || '',
    type: 'wallet' || 'group',
    id: 67890 || '',
  },
];


function App() {
  // const [wallet, setWallet] = useState(wallets ? wallets[0] : null);
  const [wallet, setWallet] = useState(localStorageSim[0]);
  const classes = useStyles();

  const handleWalletSelect = (id) => {
    const w = localStorageSim.find(w => id === w.id)
    setWallet(w);
  }


  return (
    <Box style={{minHeight: '100%'}}>
      <Grid container>
        <Grid className={classes.leftColumn} item xs={3}>
          {localStorageSim.map((w)=> {
            return <div className={classes.sidebar} onClick={()=>handleWalletSelect(w.id)} name={w.id.toString()} key={w.id}>
              <AccountBalanceWalletIcon/>
              <span>{w.nickname}</span>
            </div>
          })}
        </Grid>
        <Grid item xs={9} className={classes.rightColumn}>
          <div className={classes.walletContainer}>
            <h2>{wallet.nickname}</h2>
            <i>address: {wallet.id}</i>
            <table className={classes.transactions}>
              <thead>
                <td>Date</td>
                <td>Amount</td>
                <td>USD Value</td>
              </thead>
              <tbody>
                <tr>
                  <td>4-22-2022</td>
                  <td>12358392 SATS</td>
                  <td>$200.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}


export default App;
