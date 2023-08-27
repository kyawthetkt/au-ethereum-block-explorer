import React from "react";

const Footer = () => {
    return(
        <footer className="bg-gray-300 p-4 text-center">
            <p>&copy; {new Date().getFullYear()} Explorer. All rights reserved.</p>
        </footer>
    );
};

export default Footer;