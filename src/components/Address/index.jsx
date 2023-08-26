import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import alchemy from "../../alchemy";
import EoaAddress from "./EoaAddress";
import ContractAddress from "./ContractAddress";

function Address() {
  let { address } = useParams();
  const [isContract, setIsContract] = useState(null);

  useEffect(() => {
    async function checkContract() {
      try {
        const response = await alchemy.core.isContractAddress(address);
        setIsContract(response ? "yes" : "no");
      } catch (error) {
        console.log(error.message);
      }
    }

    checkContract();
  }, [address]);

  if (isContract === "yes") {
    return <ContractAddress address={address} />;
  }
  if (isContract === "no") {
    return <EoaAddress address={address} />;
  }

  return null;
}

export default Address;
