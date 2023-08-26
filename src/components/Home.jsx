import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import alchemy from "../alchemy";

function Home() {
  const [latestBlocks, setLatestBlocks] = useState([]);
  const [latestTrxs, setLatestTrxs] = useState([]);
  const [latestBlockNo, setLatestBlockNo] = useState(null);

  useEffect(() => {
    async function getLatestBlockNo() {
      const _latestBlockNo = await alchemy.core.getBlockNumber();
      setLatestBlockNo(_latestBlockNo);
    }
    getLatestBlockNo();
  }, []);

  useEffect(() => {
    async function getTransactions() {
      const trxs = await alchemy.core.getBlockWithTransactions(latestBlockNo);
      setLatestTrxs(trxs.transactions);
    }
    if (latestBlockNo > 0) {
      getTransactions();
    }
  }, [latestBlockNo]);

  useEffect(() => {
    async function getBlocks() {
      console.log("latestBlockNo 2");
      const startBlock = Math.max(latestBlockNo - 1, 0);
      const numbers = [];

      for (let i = latestBlockNo; i >= startBlock; i--) {
        numbers.push(i);
      }

      const blockPromises = numbers.map((numberReq) =>
        alchemy.core.getBlock(numberReq)
      );
      const blocks = await Promise.all(blockPromises);

      setLatestBlocks(
        blocks.map((block) => {
          console.log(block);
          return {
            timestamp: new Date(block.timestamp * 1000),
            hash: block.hash,
            number: block.number,
            totalTrx: block.transactions.length,
          };
        })
      );
    }
    if (latestBlockNo > 0) {
      getBlocks();
    }
  }, [latestBlockNo]);

  return (
    <>
      <header className="bg-white-300 p-8 text-center min-h-150">
        <h1 className="text-4xl font-bold">Explorer</h1>
        <p className="mt-2 text-lg">Find the trx, block and address</p>
      </header>

      <h3 className="text-xl font-bold mb-10">Latest Blocks</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {latestBlocks.map((block, index) => (
          <div
            key={index}
            className="bg-white p-4 shadow-md rounded-lg border border-gray-300 flex"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDUbrJyK0VY8_DdZl4NEjpjUBiMWVPKCn8cnw3bRAG&s"
              alt="{block.number}"
              className="w-16 h-16 mr-4 rounded-full"
            />
            <div>
              <h2 className="text-md font-semibold mb-2"><Link to={`/block/${block.number}`}>{block.number}</Link></h2>
              <p className="text-sm text-gray-600">
                Total <b>{block.totalTrx}</b> Transactions
              </p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-bold mt-10 mb-10">Latest Transactions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-20">
        {latestTrxs.slice(0, 12).map((trx, index) => (
          <div
            key={index}
            className="bg-white p-4 shadow-md rounded-lg border border-gray-300"
          >
            <h2 className="text-sm mb-2 truncate overflow-hidden">
              <Link className="link" to={`/transaction/${trx.hash}`}>{trx.hash}</Link>
            </h2>
            <p className="text-xs mb-2 flex justify-between">
              <span className="font-semibold">From</span>
              <Link className="link" to={`/address/${trx.from}`}>{trx.from.substr(0, 15)}</Link>
            </p>
            <p className="text-xs mb-2 flex justify-between">
              <span className="font-semibold">To</span>
              <Link className="link" to={`/address/${trx.to}`}>{trx.to.substr(0, 15)}</Link>
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
