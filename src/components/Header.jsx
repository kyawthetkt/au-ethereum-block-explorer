import React from "react";

const Header = () => {
    return(
        <nav className="bg-gray-500 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <a href="/" className="text-white font-bold text-lg">Explorer</a>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input type="text" placeholder="Search" className="py-2 px-6 w-64 md:w-96 rounded-full bg-gray-200 focus:outline-none focus:bg-white" />
              <button className="absolute right-0 top-0 h-full bg-blue-600 text-white px-4 rounded-full">
                Search
              </button>
            </div>
          </div>
        </div>
      </nav>
      
    );
};

export default Header;