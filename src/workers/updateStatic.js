const { dequeueMany } = require("../services/queueService");
const fs = require('fs');


async function processItems() {
  console.log('Update static items worker wunning...');
  const itemsToProcess = await dequeueMany('updateStatic', 100);
  console.log('Itens a serem processados:', itemsToProcess);
  let blockedAccounts = JSON.parse(fs.readFileSync('src/static/blockedAccounts.json', 'utf8'));
  let discardedAccounts = JSON.parse(fs.readFileSync('src/static/discardedAccounts.json', 'utf8'));
  blockedAccounts = [...blockedAccounts, ...itemsToProcess.filter(item => item.status === 'blocked').map(item => item.accountId)];
  discardedAccounts = [...discardedAccounts, ...itemsToProcess.filter(item => item.status === 'discarded').map(item => item.accountId)];
  fs.writeFileSync('src/static/blockedAccounts.json', JSON.stringify(blockedAccounts));
  fs.writeFileSync('src/static/discardedAccounts.json', JSON.stringify(discardedAccounts));
  console.log('Itens processados')
  setTimeout(() => {
    processItems()
  }, 10 * 1000 );
}

processItems()