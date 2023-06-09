import { useState , useEffect } from "react";

import { ethers   } from "ethers";
const Navbar = () => {
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [customerAddress, setCustomerAddress] = useState();
  

  useEffect(() => {
    checkIfWalletIsConnected();
    
  }, [isWalletConnected]);

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
      //  window.alert("MetaMask Login Failed");
        console.log("Metamask FAil");
      }
    } 
    catch (err) {
      console.log(err);
    }
  }
    return ( 
        <div>
            
<nav class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 ">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <a href="https://flowbite.com/" class="flex items-center">
      <img src="https://static.vecteezy.com/system/resources/previews/002/473/294/original/nft-symbol-non-fungible-token-icon-free-vector.jpg" class="h-12 mr-3" alt=" Logo"/>
      <span class="self-center text-3xl   font-extrabold text-purple-700 whitespace-nowrap ">NFT Market Place Demo</span>
  </a>
  <div class="flex md:order-2">
      <button type="button" class="text-white bg-purple-700  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0">Wallet : {customerAddress} </button>
      <button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 " aria-controls="navbar-sticky" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
      </button>
  </div>
  <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
    <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
      <li>
        <a href="/" class="block py-2 pl-3 pr-4 text-white bg-purple-700 rounded md:bg-transparent md:text-purple-700 md:p-0 " aria-current="page">Home</a>
      </li>
      <li>
        <a href="/mint" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-purple-700 md:p-0 ">Mint NFT</a>
      </li>
      <li>
        <a href="/nfts" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-purple-700 md:p-0 ">My NFTs</a>
      </li>
      
    </ul>
  </div>
  </div>
</nav>

        </div>
     );
}
 
export default Navbar;

    
