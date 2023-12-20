const express = require('express');
const router = express.Router();

const fs = require('fs');
const { enqueue, getManyWithoutDequeue, dequeueSpecific, getCounter, saveKeyWithExpire } = require('./services/queueService');

router.post('/report', async (req, res) => {

  // push to queue
  const { accountId } = req.body;

  // get client ip
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if(!accountId) {
    return res.status(400).send();
  }

  const reportsFromIpToAccount = await getCounter(`${ip}-${accountId}`);
  if(reportsFromIpToAccount) {
    return res.status(429).send({
      response: 'Account already reported'
    });
  }

  await saveKeyWithExpire(`${ip}-${accountId}`, 1, 60 * 60 * 24);

  await enqueue('unprocessedItems', { accountId });

  res.status(200).send({
    status: 'ok'
  });
});

// password: 123456

// getItemsToVerify
router.get('/accounts-to-check', async (req, res) => {
  // verify authenticaion
  const { authorization } = req.headers;
  if(!authorization) {
    return res.status(401).send();
  }
  if(authorization!==process.env.ADMIN_PASSWORD) {
    return res.status(401).send();
  }

  // get items from queue
  const itemsFromQueue = await getManyWithoutDequeue('accountsToCheck', 10)

  // add to processingAccounts

  return res.status(200).send(itemsFromQueue);

});

router.post('/accounts-to-check', async (req, res) => {

  // verify authenticaion
  const { authorization } = req.headers;
  if(!authorization) {
    return res.status(401).send();
  }
  if(authorization!==process.env.ADMIN_PASSWORD) {
    return res.status(401).send();
  }

  const { accountId, status } = req.body;

  // remove from processingAccounts
  await dequeueSpecific('accountsToCheck', { accountId });

  // add to blockedAccounts

  if(status==='blocked') {
    await enqueue('updateStatic', {accountId, status: 'blocked'});
  }
  if(status==='discarded') {
    await enqueue('updateStatic', {accountId, status: 'discarded'});
  }

  return res.status(200).send({ status: 'ok'});

})

module.exports = router;
