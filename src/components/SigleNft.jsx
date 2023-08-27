import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import alchemy from "../alchemy";

function SigleNft() {
  let { nftAddress: address, tokenId } = useParams();
  const [contractDetail, setContractDetail] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [owners, setOwners] = useState([]);

  console.log(address, tokenId);

  useEffect(() => {
    async function getNfts() {
      try {
        let response = await alchemy.nft.getNftMetadata(address, tokenId);
        console.log("setContractDetail", response);
        setContractDetail(response);
      } catch (error) {
        console.log(error.message);
      }
    }

    getNfts();
  }, [address, tokenId]);

  useEffect(() => {
    async function getFloorPrice() {
      try {
        let response = await alchemy.nft.getFloorPrice(address);
        setMarkets(response);
        console.log("setMarkets", response);
      } catch (error) {
        console.log(error.message);
      }
    }

    getFloorPrice();
  }, [address]);

  useEffect(() => {
    async function getOwner() {
      try {
        let response = await alchemy.nft.getOwnersForNft(address, tokenId);
        setOwners(response.owners);
      } catch (error) {
        console.log(error.message);
      }
    }

    getOwner();
  }, [address, tokenId]);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-md mb-2 truncate">{contractDetail?.title}</h1>
          <p className="flex items-center justify-between text-gray-800 font-semibold text-xs">
            <img
              className="nft-contract-img mr-2"
              src={contractDetail?.rawMetadata?.image}
              alt={contractDetail?.contract?.name}
            />
            <Link to={`/address/${contractDetail?.contract?.address}`} className="flex-grow">{contractDetail?.contract?.name}</Link>
          </p>
          <div className="mt-2 text-gray-800 font-normal text-xs mt-5">
            <b>Description:</b>
            <br />
            {contractDetail?.description}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-10">
        <div className="grid gap-1 mt-2 text-gray-800 font-normal text-xs">
          <div className="grid grid-cols-2  mt-2">
            <p>Owner:</p>
            <p>
              {owners.map((owner) => (
                <a
                  className="mr-3 text-blue-500"
                  target="_blank" 
                  rel="noreferrer"
                  href={`/address/${owner}`}
                  key={owner}
                >
                  {owner}
                </a>
              ))}
            </p>
          </div>
          <div className="grid grid-cols-2  mt-2">
            <p>Contract Address:</p>
            <p>{address}</p>
          </div>
          <div className="grid grid-cols-2  mt-2">
            <p>Creator:</p>
            <p>{contractDetail?.contract?.contractDeployer}</p>
          </div>
          <div className="grid grid-cols-2  mt-2">
            <p>Token ID:</p>
            <p>{contractDetail?.tokenId}</p>
          </div>
          <div className="grid grid-cols-2  mt-2">
            <p>Token Standard:</p>
            <p>{contractDetail?.tokenType}</p>
          </div>
          <div className="grid grid-cols-2 mt-2">
            <p>Marketplaces:</p>
            <p>
              {" "}
              {Object.keys(markets).map((marketplaceKey) => (
                <a
                  className="mr-3 text-blue-500"
                  target="_blank" rel="noreferrer"
                  href={markets[marketplaceKey]["collectionUrl"]}
                  key={marketplaceKey}
                >
                  {marketplaceKey.toUpperCase()}
                </a>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SigleNft;
