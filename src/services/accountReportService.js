const AccountReport = require('../models/accountReport');

const accountReportService = {
  createAccountReport: async (data) => {
    try {
      return await AccountReport.create(data);
    } catch (error) {
      console.error('Erro na criação do accountReport:', error);
    }
  },

  getAccountReportById: async (id) => {
    try {
      return await AccountReport.findByPk(id);
    } catch (error) {
      console.error('Erro ao buscar accountReport:', error);
    }
  },

  // Adicione aqui métodos para update e delete
};

module.exports = accountReportService;
