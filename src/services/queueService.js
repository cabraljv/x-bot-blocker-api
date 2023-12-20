const Redis = require('ioredis');
const redis = new Redis({
  port: 6379,
  host: process.env.REDIS_HOST || 'localhost',
});
// Adiciona um item à fila

exports.enqueue = async (queue, item) => {
  return redis.rpush(queue, JSON.stringify(item));
}

exports.dequeueMany = async (queue, count) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    const item = await exports.dequeue(queue);
    if (!item) continue;
    console.log('item', item)
    items.push(item);
  }
  return items;
}

exports.incrementCounter = async (key) => {
  return redis.incr(key);
}

exports.isItemInQueue = async (queue, item) => {
  const items = await redis.lrange(queue, 0, -1); // Pega todos os itens da fila
  return items.includes(JSON.stringify(item)); // Verifica se o item está na fila
}

exports.deleteCounter = async (key) => {
  return redis.del(key);
}

exports.getCounter = async (key) => {
  const value = await redis.get(key);
  return value === null ? 0 : parseInt(value, 10);
}

exports.saveKeyWithExpire = async (key, value, expire) => {
  await redis.set(key, value, 'EX', expire);
}

// Remove e retorna um item da fila
exports.dequeue = async (queue) => {
  return redis.lpop(queue).then(item => item ? JSON.parse(item) : null);
}
exports.getWithoutDequeue = async (queue) => {
  return redis.lindex(queue, 0).then(item => item ? JSON.parse(item) : null);
}

exports.dequeueSpecific = async (queue, item) => {
  const items = await redis.lrange(queue, 0, -1); // Pega todos os itens da fila
  const index = items.findIndex(queueItem => queueItem === JSON.stringify(item)); // Encontra o índice do item na fila
  if (index === -1) return null; // Se o item não estiver na fila, retorna null
  await redis.lset(queue, index, 'DELETED'); // Marca o item como deletado
  await redis.lrem(queue, 1, 'DELETED'); // Remove o item da fila
  return item;
}

exports.getManyWithoutDequeue = async (queue, count) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    const item = await exports.getWithoutDequeue(queue);
    if (!item) break;
    if(items.includes(item)) continue;
    items.push(item);
  }
  return items;
}

// Exemplo de uso: enqueue('unprocessedItems', { reportId: '123', ... });
