import React, { useState, useEffect } from 'react'
import './App.css'
// import ReactDOM from 'react-dom';
import { Box, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'

// Pallete URL - https://coolors.co/palette/ffbe0b-fb5607-ff006e-8338ec-3a86ff

const useStyles = makeStyles({
  leftColumn: {
    backgroundColor: '#98A6D4',
    minHeight: '100vh',
    padding: '3.5rem 2rem',
  },
  rightColumn: {
    minHeight: '100vh',
    padding: '3rem 5rem',
  },
  walletContainer: {
    borderRadius: '4px',
    backgroundColor: '#ffc29d',
    padding: '1rem',
    '& h3': {
      transform: 'translateY(-50%)',
    },
    position: 'relative',
  },
  sidebar: {
    fontSize: '1rem',
    alignItems: 'vertical',
    '& svg': {
      height: '1rem',
    },
  },
  transactions: {
    textAlign: 'left',
    borderSpacing: '30px 5px',
    marginLeft: '-30px',
  },
})

const apiUrl = 'https://blockchain.info/rawaddr/'
const backupUrl = 'https://api.blockcypher.com/v1/btc/main/addrs/'
const priceApiUrl =
  'https://api.coinstats.app/public/v1/coins/bitcoin?currency=usd'

function App() {
  // const [wallet, setWallet] = useState(wallets ? wallets[0] : null);
  const [wallet, setWallet] = useState({
    nickname: 'No Wallet selected',
    type: 'wallet',
    address: 'none',
  })
  const [storedAddys, setStoredAddys] = useState([wallet])
  const [newAddy, setNewAddy] = useState({ nickname: '', address: null })
  const [balance, setBalance] = useState(0)
  const [price, setPrice] = useState()
  const [message, setMessage] = useState('')
  const classes = useStyles()

  const deleteWallet = (address) => {
    const wallets = storedAddys.filter((w) => address !== w.address)
    setStoredAddys(wallets)
    localStorage.setItem('addresses', JSON.stringify(wallets))
    if (storedAddys.length) {
      handleWalletSelect(storedAddys[storedAddys.length - 1].address)
    }
  }

  const handleWalletSelect = async (address) => {
    const w = storedAddys?.find((w) => address === w.address)
    // const info = await getAddressInfo(address)
    setWallet(w)
    // setBalance(info.final_balance || info.balance); // the OR is for the catch
  }

  // const getAddressInfo = async (address) => {
  //   if (address.toString().length > 6) {
  //     try {
  //       const info = await fetch(apiUrl + address);
  //       return await info.json();
  //     } catch (err) {
  //       const info = await fetch(backupUrl + address);
  //       return await info.json();
  //     }
  //   }
  //   else return wallet;
  // }

  const getSavedAddys = async () => {
    const addys = await localStorage.getItem('addresses')
    const parsedAddys = await JSON.parse(addys)
    await setStoredAddys(parsedAddys)
    await handleWalletSelect(storedAddys[storedAddys.length - 1].address)
  }

  const getPrice = async () => {
    const rate = await fetch(priceApiUrl)
    const parsed = await rate.json()
    setPrice(parsed.coin.price)
  }

  useEffect(() => {
    getSavedAddys()
    getPrice()
  }, [])

  const handleAddWallet = (e) => {
    e.preventDefault()
    const JSONaddys = localStorage.getItem('addresses')
    const parsedAddys = JSON.parse(JSONaddys)
    // check to make sure it's not already stored
    // console.log('parse')
    // console.log(parsedAddys)
    // const uhh = parsedAddys.find(newAddy)
    // console.log('uhh')
    // console.log(uhh)
    console.log('newAddy')
    console.log(newAddy)
    if (parsedAddys.find((a) => a.address === newAddy.address))
      setMessage('Address has already been added.')
    else {
      const updated = parsedAddys ? [...parsedAddys, newAddy] : [newAddy]
      localStorage.setItem('addresses', JSON.stringify(updated))
      getSavedAddys()
    }
  }

  const updateAddress = (field, value) => {
    setMessage('')
    setNewAddy({ ...newAddy, [field]: value })
  }

  return (
    <Box style={{ minHeight: '100%' }}>
      <Grid container>
        <Grid
          className={classes.leftColumn}
          item
          xs={12}
          md={3}
          justifyContent="space-around"
        >
          <h2>Saved Addresses</h2>
          {storedAddys?.map((w) => {
            return (
              <div
                className={classes.sidebar}
                onClick={() => handleWalletSelect(w.address)}
                name={w?.address?.toString()}
                key={w.address}
              >
                <AccountBalanceWalletIcon />
                <span>{w.nickname}</span>
              </div>
            )
          })}
        </Grid>
        <Grid container item md={9} xs={12} className={classes.rightColumn}>
          <Grid item xs={12}>
            <h1>BTC Address Checker</h1>
            <div className={classes.walletContainer}>
              <h3>{wallet.nickname}</h3>
              <i>address: {wallet.address}</i>
              <br />
              <br />
              <table className={classes.transactions}>
                <thead>
                  <tr>
                    {/* <td>Date</td> */}
                    <th>Amount (SATS)</th>
                    <th>BTC</th>
                    <th>USD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {/* <td>4-22-2022</td> */}
                    <td>{balance}</td>
                    <td>{balance / 100000000}</td>
                    <td>${((balance / 100000000) * price).toFixed(2)} (USD)</td>
                  </tr>
                </tbody>
              </table>
              <button
                style={{
                  position: 'absolute',
                  float: 'right',
                  top: '20px',
                  right: '20px',
                }}
                onClick={() => deleteWallet(wallet.address)}
              >
                Delete
              </button>
            </div>
          </Grid>
          <Grid item xs={12} style={{ marginTop: '3rem' }}>
            <div className={classes.walletContainer}>
              <form onSubmit={handleAddWallet}>
                <h3>Track a new address</h3>
                <p className="error">
                  <i>{message || ' '}</i>
                </p>
                <input
                  name="nickname"
                  placeholder="nickname"
                  onChange={(e) => updateAddress('nickname', e.target.value)}
                />
                <br />
                <input
                  name="address"
                  placeholder="address"
                  onChange={(e) => updateAddress('address', e.target.value)}
                />
                <br />
                <button type="submit">add address</button>
              </form>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default App
