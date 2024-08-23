// jest.config.js
module.exports = {
  testEnvironment: 'node',
  verbose: true,

  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Reportes de Pruebas de Usuario',
      outputPath: './reports/test-report.html',
      includeFailureMsg: true,
      includeConsoleLog: true, // Asegúrate de que esta opción esté habilitada
    }]
  ],
};
