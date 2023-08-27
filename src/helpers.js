export function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function checkEthereumFormat(input) {
    const blockNumberPattern = /^\d+$/;
    const transactionHashPattern = /^0x[0-9a-fA-F]{64}$/;
    const addressPattern = /^0x[0-9a-fA-F]{40}$/;

    if (blockNumberPattern.test(input)) {
      return "Block";
    } else if (transactionHashPattern.test(input)) {
      return "Transaction";
    } else if (addressPattern.test(input)) {
      return "Address";
    } else {
      return "Unknown";
    }
  }