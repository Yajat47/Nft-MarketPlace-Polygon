import { useState , useEffect } from "react";
import abi from "../contracts/MarketContract.json";
import { ethers   } from "ethers";
import axios from 'axios';
import Navbar from "./Navbar.jsx";

const Mint = ({Wadd}) => {
const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [customerAddress, setCustomerAddress] = useState();
  const [imguri, seturi] = useState(null);
  const contractAddress = "0x57522B08aAFA24DeE021DE65087b5a4f629f9EcD";
  const contractAbi = abi.abi;

  const [nftdet, setdet] = useState(
    {
        name: "",
        price: "",
        uri:""
    }
        );
    const [selectedImage, setSelectedImage] = useState(null);     

    const handleChange = (e) => {
        setdet(prev => ({ ...prev, [e.target.name]: e.target.value }));
        //console.log(details);

    }

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
        setError("MetaMask Connection Failed");
        console.log("Metamask FAil");
      }
    } 
    catch (err) {
      console.log(err);
    }
  }

  const imgupload = async()=>{
    if (selectedImage) {
        try {
            const formData = new FormData();
            formData.append("file", selectedImage);

            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                    'pinata_api_key': "13656a493e7b4f907be2",
                    'pinata_secret_api_key': "a8ddbd3c21c3144e74a2b1126897474fe99550d9ee7228dd59a35bc3270f7230",
                    "Content-Type": "multipart/form-data"
                },
            });


           // console.log(resFile.data.IpfsHash);
            //const ImgHash = `https://ipfs.io/ipfs/${resFile.data.IpfsHash}`;
           // console.log(ImgHash);
            return  ("https://gateway.pinata.cloud/ipfs/" + resFile.data.IpfsHash );
            



            //Take a look at your Pinata Pinned section, you will see a new file added to you list.   



        } catch (error) {
            console.log("Error sending File to IPFS: ")
            console.log(error)
        }
    }
  }

  const uploadipfs = async ()=>{
        let imgurl = await imgupload();
        if(imgurl){
        const nftJSON = {
            name:nftdet.name, price:nftdet.price, image: imgurl
        };
            try {
                const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
                axios .post(url, nftJSON, {
                        headers: {
                            'pinata_api_key': "13656a493e7b4f907be2",
                            'pinata_secret_api_key': "a8ddbd3c21c3144e74a2b1126897474fe99550d9ee7228dd59a35bc3270f7230",
                        }
                    })
                    .then(function (response) {
                   // seturi("https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash); 
                    MintNft("https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash);   
                    return (true);
                    })
                
            } catch (error) {
               console.log("ERROR WITH IMAGE",error); 
            }

        }

  }

  const MintNft = async(img)=>{
   
    if(window.ethereum)
    {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //console.log('META HASH',imguri);
    let contractInst = new ethers.Contract(contractAddress,contractAbi, signer);

    //massage the params to be sent to the create NFT request
    const price = ethers.utils.parseUnits(nftdet.price, 'ether')
    let listingPrice = await contractInst.getListPrice();
    listingPrice = listingPrice.toString();
    const ethValue = ethers.utils.formatEther(listingPrice);
    console.log(" Current Token ID",ethValue);
    let transaction = await contractInst.createToken(img, nftdet.price, { value: ethers.utils.parseEther(ethValue) ,gasLimit: 3000000, })
    await transaction.wait();
    console.log(transaction.hash);
    alert("Successfully listed your NFT!");
    }
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if (window.ethereum && selectedImage) {
        try {
            
            uploadipfs();


        } catch (error) {
            console.log("ERROR IN SUBMIT",error);
        }
    }
  }


    return ( 
        <div class='bg-black w-screen h-screen'>
            <Navbar/>
            <div class='flex justify-center text-2xl font-extrabold text-white mt-20 p-4  '>MINT NFT</div>
            <div class='m-6 p-4 bg-white  rounded-xl mt-20 ml-36 mr-36 h-fit  '>
            
            <div class='flex justify-center text-2xl font-semibold text-purple-700 m-4 p-2'>NFT Details</div>
            <form className="formren" class='mt-8 p-6 text-lg '>
                <div class='flex justify-center '>
                <label class='text-lg font-medium ' for="name">Name :</label>
                <input class='ml-6 border-2 border-purple-700 rounded-lg' type="text" name="name" id="name" onChange={handleChange}  placeholder=" Ntf Name"></input>
                </div>
                <div class='mt-8 flex justify-center '>
                <label class='text-lg font-medium ' for="price">Price (in Wei) :</label>
                <input class='ml-6 border-2 border-purple-700 rounded-lg' type="text" name="price" id="price" onChange={handleChange} placeholder=" Price"></input>
                </div>
                <div class='mt-12 flex justify-center '>
                <label class='text-lg font-medium ' for="img"> NFT Image</label>
                <input
                    type="file"
                    name="imgurl"
                    class='ml-6  '
                    onChange={(event) => {
                        // console.log(event.target.files[0]);
                          setSelectedImage(event.target.files[0]);
                       // sendFileToIPFS(event, event.target.files[0]);
                    }}
                />
                {selectedImage && (
                    <div class='mt-8 mb-4 flex justify-center border-2 border-purple-700  '>
                        <img alt="not fount" width={"250px"} src={URL.createObjectURL(selectedImage)} />
                    </div>
                )}
                </div>
                <br />

                <br />
               
                <div class='flex justify-center '>
                <button class='bg-purple-700 m-6 p-2  w-36 text-lg font-semibold text-white rounded-lg' onClick={(e)=>handleSubmit(e)} >Mint NFT </button>
                </div>
            </form>
            </div>
        </div>
     );
}
 
export default Mint;