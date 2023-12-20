fila unprocessedItems  // Quando recebemos algum report
fila toVerify // Quando recebemos algum report

worker a cada 5min
  get reports.json
  pull em 100 unprocessedItems
  verifica se existe em blockedAccounts.json ou discartedReports.json
  se sim, remove do unprocessedItems
  se não, report.reportsCount++
  se report.reportsCount > 3, adiciona em toVerify e remove de reports.json
  atualiza reports.json
  remove de unprocessedItems

endpoint GET /verifyReports
  pull 10 em toVerify
  verifica se existe em blockedAccounts.json ou discartedReports.json
  retorna os reports que não existem em blockedAccounts.json ou discartedReports.json
  remove de toVerify

endpoint POST /verifyReports/:id
  adiciona em blockedAccounts.json ou discartedReports.json

