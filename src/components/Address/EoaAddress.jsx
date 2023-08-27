import { useEffect, useState } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { Utils } from "alchemy-sdk";

import alchemy from "../../alchemy";
import defaultNftImg from "../../assets/nft-default.jpg";
import Loader from "../Loader";

function ContractAddress() {
  let { address } = useParams();
  const [nfts, setNfts] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [transers, setTransers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);

  // Extract the 'username' query parameter
  const activeTab = parseInt(searchParams.get("tab") ?? 1);

  const handleTabClick = (activeTab) => {
    searchParams.set("tab", activeTab);
    history.push({ search: searchParams.toString() });
  };

  useEffect(() => {
    async function getErc20Tokens() {
      try {
        setLoading(true);
        const response = await alchemy.core.getTokensForOwner(address);
        setTokens(response.tokens);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    }

    async function getNfts() {
      try {
        setLoading(true);
        const response = await alchemy.nft.getNftsForOwner(address);
        setNfts(response.ownedNfts);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    }

    async function getAssetTransfers() {
      try {
        setLoading(true);
        const response = await alchemy.core.getAssetTransfers({
          excludeZeroValue: true,
          fromAddress: address,
          // withMetadata: true,
          category: ["erc721", "erc1155", "erc20"],
        });
        setTransers(response.transfers);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    }

    if (activeTab === 1) {
      getErc20Tokens();
    }
    if (activeTab === 2) {
      getNfts();
    }
    if (activeTab === 3) {
      getAssetTransfers();
    }
  }, [address, activeTab]);

  useEffect(() => {
    async function getAccBalance() {
      try {
        let response = await alchemy.core.getBalance(address, "latest");
        setBalance(response);
      } catch (error) {
        console.log(error.message);
      }
    }

    getAccBalance();
  }, [address]);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-20">
        <div>
          <h6 className="text-xs">Externall Owned Account</h6>
          <h1 className="text-md font-bold mb-2 truncate">{address}</h1>
          <p className="text-gray-800 text-sm">
            ETH Balance: {Utils.formatEther(balance.toString())}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="col-span-1">
          <button
            className={`w-full py-2 px-4 text-center border border-gray-300 ${
              activeTab === 1 ? "bg-blue-300" : "bg-gray-100"
            }`}
            onClick={() => handleTabClick(1)}
          >
            ERC20
          </button>
        </div>
        <div className="col-span-1">
          <button
            className={`w-full py-2 px-4 text-center border border-gray-300 ${
              activeTab === 2 ? "bg-blue-300" : "bg-gray-100"
            }`}
            onClick={() => handleTabClick(2)}
          >
            NFT
          </button>
        </div>
        <div className="col-span-1">
          <button
            className={`w-full py-2 px-4 text-center border border-gray-300 ${
              activeTab === 3 ? "bg-blue-300" : "bg-gray-100"
            }`}
            onClick={() => handleTabClick(3)}
          >
            Asset Transfers
          </button>
        </div>

        <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-6 p-4">
          <div className={activeTab === 1 ? "" : "hidden"}>
            <div className="bg-white shadow col-span-full overflow-x-auto">
              <table className="divide-y divide-gray-200 w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-sm text-left">
                      Contract Address
                    </th>
                    <th className="px-6 py-3 text-sm text-left">
                      Name(Symbol)
                    </th>
                    <th className="px-6 py-3 text-sm text-left">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading && (
                    <tr>
                      <td cols="4">
                        <Loader msg="Fetching Token..." />
                      </td>
                    </tr>
                  )}
                  {tokens.map((token, key) => (
                    <tr key={key}>
                      <td className="px-6 py-4 text-sm">
                        <a
                          className="text-blue-500"
                          href={`/address/${token.contractAddress}`}
                        >
                          {token.contractAddress}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <img
                          src={token?.logo ? token?.logo : defaultNftImg}
                          alt={token.name}
                          className="erc20-logo-size rounded"
                        />
                        {token.name}({token.symbol})
                        <br />
                        <span className="text-xs">
                          {token.decimals} decimals
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{token.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className={activeTab === 2 ? "" : "hidden"}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {isLoading&& <Loader msg="Fetchin NFT..." />}
              {nfts?.map((nft, index) => (
                <div key={index} className="bg-white p-2 rounded shadow-md">
                  <img
                    src={
                      nft?.rawMetadata?.image
                        ? nft?.rawMetadata?.image
                        : defaultNftImg
                    }
                    alt={nft.title}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <p className="text-gray-500 text-xs truncate">
                    {nft.contract.tokenType}
                  </p>
                  <h1 className="text-xs mb-1">{nft.title}</h1>
                  <h1 className="text-sm mb-1">
                    <a
                      className="text-blue-500"
                      href={`/nft/${nft.contract.address}/${nft.tokenId}`}
                    >
                      {nft.contract.name}
                    </a>
                  </h1>
                </div>
              ))}
            </div>
          </div>
          <div className={activeTab === 3 ? "" : "hidden"}>
            <div className="bg-white shadow col-span-full overflow-x-auto">
              <table className="divide-y divide-gray-200 w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-sm text-left">Txn Hash</th>
                    <th className="px-6 py-3 text-sm text-left">Block</th>
                    <th className="px-6 py-3 text-sm text-left">Amount</th>
                    <th className="px-6 py-3 text-sm text-left">Token Type</th>
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
                            href={`/address/${transer.rawContract.address}/${parseInt(transer.tokenId, 16)}`}
                          >
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
                                  href={`/nft/${transer.rawContract.address}/${parseInt(meta.tokenId, 16)}`}
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
        </div>
      </div>
    </div>
  );
}

export default ContractAddress;
