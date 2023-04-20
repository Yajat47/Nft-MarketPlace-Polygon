import { useState , useEffect } from "react";
import abi from "./contracts/MarketContract.json";
import { ethers  } from "ethers";
import { BrowserRouter, Routes, Route , Outlet,createBrowserRouter,RouterProvider} from "react-router-dom";
import Mint from './components/Mint.jsx';
import Test from "./components/Test.jsx";
import Home from "./components/Home.jsx";
import Collection from "./components/Collection.jsx";
import './App.css'

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [customerAddress, setCustomerAddress] = useState("");
  const contractAddress = "0xFDD8eBd6C370bD398ad4477C585Cf68401A43b52";
  const contractAbi = abi.abi;

  // useEffect(() => {
  //   checkIfWalletIsConnected();
    
  // }, [isWalletConnected]);

  const checkIfWalletIsConnected = async ()=> {
    try {
      if(window.ethereum) {
        const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
        const account = accounts[0];
        setIsWalletConnected(true);
        setCustomerAddress(account);
        console.log("Account Connected ");
      }
      else {
        window.alert("MetaMask Login Failed");
        console.log("Metamask FAil");
      }
    } 
    catch (err) {
      console.log(err);
    }
  }
  const router = createBrowserRouter([
    {
      path:"/mint",
      element:<Mint/>
    },
    {
      path:"/test",
      element:<Test/>
    },
    {
      path:"/nfts",
      element:<Collection/>
    },
    {
      path:"/",
      element:<Home/>
    },
    
  ]);


  
    
  

  return (
    <div className="App">
       <div>
        <RouterProvider router={router}/>
        </div>  
    </div>
  )
}

export default App
