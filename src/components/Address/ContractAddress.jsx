import { useEffect, useState } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import alchemy from "../../alchemy";
import defaultNftImg from "../../assets/nft-default.jpg";
import Loader from "../Loader";
import { Link } from "react-router-dom/cjs/react-router-dom";

function ContractAddress() {
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);

  let { address } = useParams();
  const [nfts, setNfts] = useState([]);
  const [owners, setOwners] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [transers, setTransers] = useState([]);
  const [tokenType, setTokenType] = useState(null);

  // Extract the 'username' query parameter
  const activeTab = parseInt(searchParams.get("tab") ?? 1);

  const handleTabClick = (activeTab) => {
    searchParams.set("tab", activeTab);
    history.push({ search: searchParams.toString() });
  };

  useEffect(() => {
    async function getNfts() {
      try {
        setLoading(true);
        const response = await alchemy.nft.getNftsForContract(address);
        setNfts(response.nfts);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    }
    async function getTransfers() {
      try {
        let tokenTypes = ["erc20"];
        if (tokenType === "ERC721") {
          tokenTypes = ["erc721"];
        } else if (tokenType === "ERC1155") {
          tokenTypes = ["erc1155"];
        }
        setLoading(true);
        const response = await alchemy.core.getAssetTransfers({
          excludeZeroValue: true,
          contractAddresses: [address],
          category: tokenTypes,
        });
        setTransers(response.transfers);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    }

    async function getOwners() {
      try {
        setLoading(true);
        const response = await alchemy.nft.getOwnersForContract(address);
        setOwners(response.owners);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    }
    if (activeTab === 2) {
      getNfts();
    }
    if (activeTab === 1) {
      getTransfers();
    }
    if (activeTab === 3) {
      getOwners();
    }
  }, [address, activeTab, tokenType]);

  useEffect(() => {
    async function getMetadata() {
      try {
        const response = await alchemy.nft.getContractMetadata(address);
        setMetadata(response);
        setTokenType(response.tokenType);
      } catch (error) {
        console.log(error.message);
      }
    }

    getMetadata();
  }, [address]);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-20">
        {metadata ? (
          <>
            <div>
              <h6 className="text-xs mb-2">
                {metadata?.tokenType === "NO_SUPPORTED_NFT_STANDARD"
                  ? "ERC20"
                  : metadata?.tokenType}{" "}
                Contract
              </h6>
              <p className="text-xs mb-2 truncate">{address}</p>
              <h1 className="text-md mb-2">
                {metadata?.name}(SYMBOL: {metadata?.symbol})
              </h1>
              <p className="text-gray-600 text-sm">
                Total Supply: {metadata?.totalSupply}
              </p>
            </div>
            <div>
              <img
                src={metadata?.openSea?.imageUrl}
                alt={metadata?.symbol}
                className="h-24 w-24 rounded-full border border-gray-300 shadow"
              />
            </div>
          </>
        ) : (
          <Loader />
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="col-span-1">
          <button
            className={`w-full py-2 px-4 text-center border border-gray-300 ${
              activeTab === 1 ? "bg-blue-300" : "bg-gray-100"
            }`}
            onClick={() => handleTabClick(1)}
          >
            Transfer History
          </button>
        </div>
        {(tokenType === "ERC721" || tokenType === "ERC1155") && (
          <>
            <div className="col-span-1">
              <button
                className={`w-full py-2 px-4 text-center border border-gray-300 ${
                  activeTab === 2 ? "bg-blue-300" : "bg-gray-100"
                }`}
                onClick={() => handleTabClick(2)}
              >
                NFTs
              </button>
            </div>
            <div className="col-span-1">
              <button
                className={`w-full py-2 px-4 text-center border border-gray-300 ${
                  activeTab === 3 ? "bg-blue-300" : "bg-gray-100"
                }`}
                onClick={() => handleTabClick(3)}
              >
                Holders {owners?.length > 0 ? `(${owners.length})` : ""}
              </button>
            </div>
          </>
        )}

        <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-6 p-4">
          <div className={activeTab === 1 ? "" : "hidden"}>
            <div className="bg-white shadow col-span-full overflow-x-auto">
              <table className="divide-y divide-gray-200 w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-sm text-left">Txn Hash</th>
                    <th className="px-6 py-3 text-sm text-left">Block</th>
                    <th className="px-6 py-3 text-sm text-left">Amount</th>
                    <th className="px-6 py-3 text-sm text-left">Token Type</th>
                    <th className="px-6 py-3 text-sm text-left">From</th>
                    <th className="px-6 py-3 text-sm text-left">To</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading && (
                    <tr>
                      <td colSpan={5}>
                        <Loader msg="Fetching Transfers..." />
                      </td>
                    </tr>
                  )}
                  {transers.map((transer, key) => (
                    <tr key={key}>
                      <td className="px-6 py-4 text-sm">
                        <a
                          className="text-blue-500"
                          href={`/transaction/${transer.hash}`}
                        >
                          {transer.hash.substr(0, 15)}...
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <a
                          className="text-blue-500"
                          href={`/block/${parseInt(transer.blockNum, 16)}`}
                        >
                          {parseInt(transer.blockNum, 16)}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {transer.category === "erc20" &&
                          parseInt(transer.rawContract.value) /
                            10 ** parseInt(transer.rawContract.decimal)}
                        {transer.category === "erc721" && (
                          <a
                            className="text-blue-500"
                            href={`/nft/${
                              transer.rawContract.address
                            }/${parseInt(transer.tokenId, 16)}`}
                          >
                            {/* {JSON.stringify(transer, 2, null)} */}
                            {parseInt(transer.tokenId, 16)}
                          </a>
                        )}

                        {transer.category === "erc1155" &&
                          transer.erc1155Metadata.map((meta, key) => (
                            <div key={key}>
                              <p>
                                {parseInt(meta.value, 16)} of Token ID{" "}
                                <a
                                  className="text-blue-500"
                                  href={`/nft/${
                                    transer.rawContract.address
                                  }/${parseInt(transer.tokenId, 16)}`}
                                >
                                  [{parseInt(meta.tokenId, 16)}]
                                </a>
                              </p>
                              {/* Other metadata properties */}
                            </div>
                          ))}

                        <a
                          className="text-blue-500 ml-3"
                          href={`/address/${transer.rawContract.address}`}
                        >
                          {transer.asset}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {transer.category.toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <a
                          className="text-blue-500"
                          href={`/address/${transer.from}`}
                        >
                          {transer.from}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <a
                          className="text-blue-500"
                          href={`/address/${transer.to}`}
                        >
                          {transer.to}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {(tokenType === "ERC721" || tokenType === "ERC1155") && (
            <>
              <div className={activeTab === 2 ? "" : "hidden"}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {isLoading && <Loader msg="Fetching NFT..." />}
                  {nfts?.map((nft, index) => (
                    <div key={index} className="bg-white p-2 rounded shadow-md">
                      <img
                        src={
                          nft?.media[0]?.thumbnail
                            ? nft?.media[0]?.thumbnail
                            : defaultNftImg
                        }
                        alt={nft.title}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <h1 className="text-xs mb-1">{nft.title}</h1>
                      <h1 className="text-sm mb-1">
                        <Link
                          className="text-blue-500"
                          to={`/token/${nft.contract.address}/${nft.tokenId}`}
                        >
                          {nft.contract.name}
                        </Link>
                      </h1>
                      <p className="text-gray-500 text-xs truncate">
                        {nft.contract.tokenType}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className={activeTab === 3 ? "" : "hidden"}>
                <div className="bg-white shadow col-span-full overflow-x-auto">
                  <table className="divide-y divide-gray-200 w-full">
                    <tbody className="divide-y divide-gray-200">
                      {isLoading && (
                        <tr>
                          <td>
                            <Loader msg="Fetching Owners..." />
                          </td>
                        </tr>
                      )}

                      {owners.map((owner, key) => (
                        <tr key={key}>
                          <td className="px-6 py-4 text-sm">
                            <a
                              className="text-blue-500"
                              href={`/address/${owner}`}
                            >
                              {owner}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContractAddress;
