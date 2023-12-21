const { dequeueMany, getCounter, enqueue, deleteCounter, incrementCounter, isItemInQueue } = require("../services/queueService");
const fs = require('fs');

async function processItems() {
  console.log('Unprocessed items worker running...');
  const itemsToProcess = await dequeueMany('unprocessedItems', 100);
  console.log('Itens a serem processados:', itemsToProcess);
  const blockedAccounts = JSON.parse(fs.readFileSync('src/static/blockedAccounts.json', 'utf8'));
  const discardedAccounts = JSON.parse(fs.readFileSync('src/static/discardedAccounts.json', 'utf8'));
  const processedItems = itemsToProcess.filter(item => {
    const blockedAccount = blockedAccounts.find(accountId => item.accountId === accountId);
    const discardedAccount = discardedAccounts.find(accountId => item.accountId === accountId);

    return !blockedAccount && !discardedAccount;
  });
  

  // update reports
  for(const item of processedItems) {
    const existentItem = await getCounter(item.accountId);
    if(existentItem>=0){
      if(!(await isItemInQueue('accountsToCheck', item))) {
        await enqueue('accountsToCheck', item);
      }
      await deleteCounter(item.accountId);
      continue
    }
    await incrementCounter(item.accountId);
  }

  console.log('Itens processados:', processedItems);


  setTimeout(() => {
    processItems()
  },  5 * 1000);
}

processItems()