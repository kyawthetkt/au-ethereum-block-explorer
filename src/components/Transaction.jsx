import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import alchemy from "../alchemy";

function Transaction() {
  let { transactionHash } = useParams();
  const [transaction, setTransaction] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function getBlockTrxs() {
      try {
        let response = await alchemy.core.getTransactionReceipt(
          transactionHash
        );
        setTransaction(response);
        console.log("response", response);
      } catch (error) {
        console.log(error.message);
        setMessage(error.message);
      }
    }
    if (transactionHash) {
      getBlockTrxs();
    }
  }, [transactionHash]);

  if (message || !transaction) {
    return <p className="text-red-500 mb-4">{message}</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="bg-white shadow col-span-full overflow-x-auto">
          <table className="divide-y divide-gray-200 w-full">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Transaction Hash</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {transaction.transactionHash}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Block</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {transaction.blockNumber} - {transaction.confirmations}
                    {" Confirmations"}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Status</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {transaction.status === 1 ? "Success" : "Failed"}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">From</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    <Link className="link" to={`/address/${transaction.from}`}>{transaction.from}</Link>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">To</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    <Link className="link" to={`/address/${transaction.to}`}>{transaction.to}</Link>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Txn Fee</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {parseInt(transaction.gasUsed, 16)}<br/>
                    {parseInt(transaction.cumulativeGasUsed, 16)}<br/>
                    {parseInt(transaction.effectiveGasPrice, 16)}<br/>
                    {/* {Utils.formatUnits(transaction.cumulativeGasUsed, "ether")}{" "} */}
                    ETH
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">byzantium</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {transaction.byzantium ? "true" : "false"}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Transaction;
