import { useState , useEffect } from "react";
import abi from "../contracts/MarketContract.json";
import { ethers   } from "ethers";
import axios from 'axios';


const Home = () => {
    const [nftdata , setdata]= useState([]);
    const [nftload , setload] = useState(false);
    const contractAddress = "0xFDD8eBd6C370bD398ad4477C585Cf68401A43b52";
    const contractAbi = abi.abi;


    const sellNft = async (tokenId , price) => {
        if(window.ethereum){
            try{
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let contractInst = new ethers.Contract(contractAddress,contractAbi, signer);
            const buyprice = ethers.utils.parseUnits(price, 'ether')
            let txn = await contractInst.executeSale(tokenId ,{ value: ethers.utils.parseEther(price) ,gasLimit: 300000,});
            await txn.wait();
            alert('NFT  Purchase Completed! Congrats..');
            }
            catch(e) {
                alert("Buy  Failed");
                console.log(e);
            }
        }
    }

    const listNft = async()=>{
        if(window.ethereum){
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let contractInst = new ethers.Contract(contractAddress,contractAbi, signer);
            let txn = await contractInst.getAllNFTs();
            const items = await Promise.all(txn.map(async i => {
                
                const tokenURI = await contractInst.tokenURI(i.tokenId);
                if(tokenURI != 'absctest'){
                //https://gateway.pinata.cloud/ipfs/QmbWymokvmS4YotFjpMy4pjwbysY8QuzcQKh24udajzorx
                let tokenURI2 = "https://ipfs.io"+tokenURI.slice(28);
                //console.log(tokenURI2);
                
                let meta = await axios.get(tokenURI2);
                meta = meta.data;
        
                let price1 = ethers.utils.formatUnits(i.price.toString(), 'ether');
                let item = {
                    price:price1,
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    image: "https://ipfs.io"+meta.image.slice(28),
                    name: meta.name,
                    //description: meta.description,
                }

                return item;
            }
            }))
            let i2 =items.shift();
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
                    <div class=' flex justify-center m-4 mt-12 p-6 '>
                    <ul>            
                    {
                nftdata.map((post)=>(
                    
        <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow mt-6 " key={post.tokenId}>
            <div class="">Seller : {post.seller}</div>
            <a href="#">
                <img class="p-8 w-72 h-80 rounded-lg object-contain " src={post.image} alt="NFT image" />
            </a>
            <div class="px-5 pb-5">
                <a href="#">
                    <h5 class="text-xl font-semibold tracking-tight text-gray-900 ">{post.name}</h5>
                </a>
                <div class="">Owner : {post.owner}</div>

                <div class="flex items-center justify-between">
                    <span class="text-3xl font-bold text-gray-900 mt-4 ">{post.price} Eth</span>
                    <button
                    onClick={()=>sellNft(post.tokenId , post.price)}
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Buy</button>
                
                
                </div>
            </div>
        </div>

                ))
            }                        
                          </ul> 
                    </div>
                    </div>}
            </div>
            <button class='text-md font-semibold bg-white text-purple-800 m-4 p-2 ' onClick={()=>window.location.replace("/mint")}>Mint NFT</button>
            <button class='text-md font-semibold bg-white text-purple-800 m-4 p-2 ' onClick={()=>window.location.replace("/nfts")}>Owned NFTs</button>

            
        </div>
        </div>
     );
}
 
export default Home;
