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
       <div class=''>
        <RouterProvider router={router}/>
        </div>  
    </div>
  )
}

export default App
