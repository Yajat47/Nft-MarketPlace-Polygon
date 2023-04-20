import { useState , useEffect } from "react";
import abi from "../contracts/MarketContract.json";
import { ethers   } from "ethers";
import axios from 'axios';


const Home = () => {
    const [nftdata , setdata]= useState();
    const [nftload , setload] = useState(false);
    const contractAddress = "0xFDD8eBd6C370bD398ad4477C585Cf68401A43b52";
    const contractAbi = abi.abi;
    const listNft = async()=>{
        if(window.ethereum){
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let contractInst = new ethers.Contract(contractAddress,contractAbi, signer);
            let txn = await contractInst.getAllNFTs();
            const items = await Promise.all(txn.map(async i => {
                const tokenURI = await contractInst.tokenURI(i.tokenId);
                //https://gateway.pinata.cloud/ipfs/QmbWymokvmS4YotFjpMy4pjwbysY8QuzcQKh24udajzorx
                let tokenURI2 = "https://ipfs.io"+tokenURI.slice(28);
                console.log(tokenURI2);
                if(tokenURI != 'absctest'){
                let meta = await axios.get(tokenURI2);
                meta = meta.data;
        
                let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
                let item = {
                    price,
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    image: meta.image,
                    name: meta.name,
                    //description: meta.description,
                }

                return item;
            }
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
        <div class='text-lg font-black text-purple-500 bg-black m-6 p-4 '>
        <div >NFT MARKET PLACE</div>
        <div>
            <div>
                <div class='text-lg font-bold m-6 p-2 '>All NFTS </div>
                {nftload && <div>
                    Data Loaded
                    </div>}
            </div>
            <button class='text-md font-semibold bg-white text-purple-800 m-4 p-2 ' onClick={()=>window.location.replace("/mint")}>Mint NFT</button>
        </div>
        </div>
     );
}
 
export default Home;
