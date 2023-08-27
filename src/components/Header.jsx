import { useState } from "react";
import { useLocation } from "react-router-dom";
import { checkEthereumFormat } from "../helpers";

const Header = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sk = searchParams.get("sk") ?? '';
  const [searchInput, setSearchInput] = useState(sk?? '');

  function handleSearch() {
    if (searchInput) {
      let link = "";
      const formatGiven = checkEthereumFormat(searchInput);
      if (formatGiven === "Block") {
        link =  `/block/${searchInput}?sk=${searchInput}`
      } else if (formatGiven === "Transaction") {
        link =  `/transaction/${searchInput}?sk=${searchInput}`
      } else if (formatGiven === "Address") {
        link = `/address/${searchInput}?sk=${searchInput}`
      }
      if ( link ) {
        window.location.href = link;
      }
    }
    alert("Please enter a valid search term")
    return;
  }

  return (
    <nav className="bg-gray-500 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="text-white font-bold text-lg">
          Explorer
        </a>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Txn, address or block number"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="py-2 px-6 w-64 md:w-96 rounded-full bg-gray-200 focus:outline-none focus:bg-white"
            />
            <button
              className="absolute right-0 top-0 h-full bg-blue-600 text-white px-4 rounded-full"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
