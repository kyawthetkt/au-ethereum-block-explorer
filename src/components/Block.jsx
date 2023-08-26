import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Utils } from "alchemy-sdk";

import alchemy from "../alchemy";
import { capitalizeFirstLetter } from "../helpers";

function Block() {
  let { blockHashTag } = useParams();
  const [block, setBlock] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function getBlock() {
      try {
        const arg = Utils.isHexString(blockHashTag)
          ? blockHashTag
          : parseInt(blockHashTag);
        let response = await alchemy.core.getBlock(arg);
        setBlock(response);
        console.log(response);
      } catch (error) {
        console.log(error.message);
        setMessage(error.message);
      }
    }
    if (blockHashTag) {
      getBlock();
    }
  }, [blockHashTag]);

  const displayObjValue = (key, obj) => {
    if (typeof obj[key] === "object") {
      if (["gasLimit", "gasUsed", "_difficulty"].includes(key)) {
        return obj[key].toString();
      }
      if (key === "baseFeePerGas") {
        const baseFeePerGas = obj[key].toString();
        return `${Utils.formatUnits(
          baseFeePerGas,
          "ether"
        )} ETH (${Utils.formatUnits(baseFeePerGas, "gwei")} GWEI)`;
      }
      if (key === "transactions") {
        return (
          <Link className="link text-blue-500" to={`/blockTransactions/${obj.hash}`}>Total {obj[key].length} Transaction</Link>
        );
      }
    } else {
      return obj[key];
    }
  };

  if (message) {
    return <p className="text-red-500 mb-4">{message}</p>;
  }

  return (
    <>
      <h3 className="text-md font-bold mb-10">
        Block #{block ? block.number : ""}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="bg-white shadow col-span-full overflow-x-auto">
          <table className="divide-y divide-gray-200 w-full">
            <tbody className="divide-y divide-gray-200">
              {block && (
                <tr>
                  <td colSpan="2">
                    <div className="flex justify-between mt-4 p-3">
                      <a
                        className="bg-gray-400 hover:bg-gray-500 text-white text-sm font-semibold py-1 px-2 rounded"
                        href={`/block/${block.number - 1}`}
                      >
                        Previous Block
                      </a>
                      <a
                        className="bg-gray-400 hover:bg-gray-500 text-white text-sm font-semibold py-1 px-2 rounded"
                        href={`/block/${block.number + 1}`}
                      >
                        Next Block
                      </a>
                    </div>
                  </td>
                </tr>
              )}

              {block &&
                Object.keys(block).map((key) => (
                  <tr key={key}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {capitalizeFirstLetter(key)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {displayObjValue(key, block)}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Block;
