import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import alchemy from "../alchemy";
import { Utils } from "alchemy-sdk";

function BlockTransactions() {
  let { blockHashTag } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function getBlockTrxs() {
      try {
        const arg = Utils.isHexString(blockHashTag)
          ? blockHashTag
          : parseInt(blockHashTag);
        // let response = await alchemy.core.getTransactionReceipts({
        //     blockNumber: arg,
        // });
        let response = await alchemy.core.getBlockWithTransactions(arg);
        setTransactions(response.transactions);
        console.log(response.transactions[response.transactions.length-1]);
      } catch (error) {
        console.log(error.message);
        setMessage(error.message);
      }
    }
    if (blockHashTag) {
      getBlockTrxs();
    }
  }, [blockHashTag]);

  if (message) {
    return <p className="text-red-500 mb-4">{message}</p>;
  }

  return (
    <>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="bg-white shadow col-span-full overflow-x-auto">
          <table className="divide-y divide-gray-200 w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-sm text-left">No.</th>
                <th className="px-6 py-3 text-sm text-left">Block</th>
                <th className="px-6 py-3 text-sm text-left">Txn Hash</th>
                <th className="px-6 py-3 text-sm text-left">From</th>
                <th className="px-6 py-3 text-sm text-left">To</th>
                <th className="px-6 py-3 text-sm text-left">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
             {transactions.map((txn, key) => (
                  <tr key={key}>
                  <td className="px-6 py-4 text-sm">{key+1}.</td>
                  <td className="px-6 py-4 text-sm">
                  <a className="text-blue-500" href={`/block/${txn.blockNumber}`}>{txn.blockNumber}</a>
                  </td>
                    <td className="px-6 py-4 text-sm">
                        <a className="text-blue-500" href={`/transaction/${txn.hash}`}>{txn.hash.substr(0, 15)}...</a>
                    </td>
                    <td className="px-6 py-4 text-sm">{txn.from}</td>
                    <td className="px-6 py-4 text-sm">{txn.to}</td>
                    <td className="px-6 py-4 text-sm">{Utils.formatUnits(txn.value, "ether")} ETH</td>
                  </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default BlockTransactions;
