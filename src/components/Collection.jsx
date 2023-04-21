import { useState , useEffect } from "react";
import abi from "../contracts/MarketContract.json";
import { ethers   } from "ethers";
import axios from 'axios';
import Navbar from "./Navbar.jsx";

const Collection = () => {
    const [nftdata , setdata]= useState([]);
    const [nftload , setload] = useState(false);
    const contractAddress = "0x57522B08aAFA24DeE021DE65087b5a4f629f9EcD";
    const contractAbi = abi.abi;
    const listNft = async()=>{
        if(window.ethereum){
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let contractInst = new ethers.Contract(contractAddress,contractAbi, signer);
            let txn = await contractInst.getMyNFTs();
            const items = await Promise.all(txn.map(async i => {
                
                const tokenURI = await contractInst.tokenURI(i.tokenId);
               
                //https://gateway.pinata.cloud/ipfs/QmbWymokvmS4YotFjpMy4pjwbysY8QuzcQKh24udajzorx
                let tokenURI2 = "https://ipfs.io"+tokenURI.slice(28);
                //console.log(tokenURI2);
                
                let meta = await axios.get(tokenURI2);
                meta = meta.data;
        
                let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
                let item = {
                    price,
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    image: "https://ipfs.io"+meta.image.slice(28),
                    name: meta.name,
                    //description: meta.description,
                }

                return item;
            
            }))
           
            setdata(items);
            setload(true);
            console.log(items);
        }
    }

    useEffect(()=>{
        if(!nftload){
            listNft();
        }
    },[nftload]);
    return (
        <div class='bg-black w-screen h-screen'>
        <Navbar /> 
        <div class='text-lg font-black text-purple-500 bg-black m-6 p-4 mt-12 '>
       
        <div>
            <div>
                <div class='text-2xl flex justify-center font-bold m-6 p-2 '>My NFTs  </div>
                {nftload && <div>
                    <div class=' flex justify-center m-4 mt-12 p-6 '>
                    <ul>            
                    {
                nftdata.map((post)=>(
                    
        <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow mt-6 " key={post.tokenId}>

            <a href="#">
                <img class="p-8 w-72 h-80 rounded-lg object-contain " src={post.image} alt="NFT image" />
            </a>
            <div class="px-5 pb-5">
                <a href="#">
                    <h5 class="text-xl font-semibold tracking-tight text-gray-900 ">{post.name}</h5>
                </a>
                <div class="flex items-center justify-between">
                    <span class="text-3xl font-bold text-gray-900 mt-4 text-blue-700 ">{post.price}  Eth</span>
                </div>

            </div>
        </div>

                ))
            }                        
                          </ul> 
                    </div>
                    </div>}
            </div>
          
            
        </div>
        </div>
        </div>
     );
}
 
export default Collection;
