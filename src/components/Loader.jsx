import React from "react";

const Loader = ({ msg }) => <p className="text-center py-5">{msg ? msg : "Loading..."}</p>;

export default Loader;
