const express = require('express');
const Moralis = require('moralis').default;
const dotenv = require('dotenv');
const Address = require('../models/Address');
const middleware = require('../middleware/middleware')
const { trackTransactions } = require('../function/socketAlert');


dotenv.config({ path: './config/config.env' })

const router = express.Router();
router.get('/transaction', middleware, async (req, res) => {

    try {

        const response = await Moralis.EvmApi.transaction.getWalletTransactionsVerbose({
            "chain": "0x1",
            "address": "0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326"
        });

        
        return res.status(200).json({data: response.result})
    } catch (e) {
        console.error(e);
    }
});



router.get("/address", middleware, async (req, res) => {
    try {
      const { query } = req;
      const chain = "0x1";
  
      const response =
        await Moralis.EvmApi.transaction.getWalletTransactionsVerbose({
          address: query.address,
          chain,
        });
  
      return res.status(200).json(response);
    } catch (e) {
      console.log(`Something went wrong ${e}`);
      return res.status(400).json();
    }
  });


router.post('/setalert', middleware, async (req, res) => {
    try {
        const address = req.query.address; 
        const user = req.user.id

        const foundAddress = await Address.findOne({ from: address, user:user });

        if (!foundAddress) {
            return res.status(404).json({ error: 'Address not found' });
        }

        foundAddress.alert = true;

        await foundAddress.save();

        return res.status(200).json({ success: true, message: 'Alert set successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/tracktransaction', middleware ,async (req, res) => {
  try {

    const userid = req.user.id
    const targetAddresses = await Address.find({user: userid});

    if (targetAddresses.length === 0) {
      return res.status(404).json({ error: 'No addresses found for tracking' });
    }

    for (const targetAddressDocument of targetAddresses) {
      const targetAddress = targetAddressDocument.from;

      await trackTransactions(targetAddress);
    }

    return res.status(200).json({ success: true, message: 'Transaction tracking initiated for all addresses' });
  } catch (error) {
    console.error(`Error in /tracktransaction route: ${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
