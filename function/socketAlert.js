const trackTransactions = async (address) => {
    try {
      const response = await Moralis.EvmApi.transaction.getWalletTransactions({
        address,
        chain: '0x1',
      });
  
      if (response.result && response.result.length > 0) {
        io.emit('transaction', {
          address,
          transactions: response.result,
        });
      }
    } catch (error) {
      console.error(`Error tracking transactions for address ${address}: ${error}`);
    }
  };
  

module.exports = trackTransactions