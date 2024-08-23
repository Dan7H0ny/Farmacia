const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function example() {
    // Iniciar un navegador
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Navegar a tu página
        await driver.get('http://localhost:3000'); // Cambia la URL a la de tu aplicación React

        // Encontrar un elemento y realizar una acción
        let element = await driver.findElement(By.name('elementName')); // Cambia 'elementName' al selector adecuado
        await element.sendKeys('Texto de prueba'); // Ejemplo de acción

        // Esperar hasta que un elemento esté presente
        await driver.wait(until.elementLocated(By.id('elementId')), 10000); // Cambia 'elementId' al ID adecuado

        // Más acciones aquí
    } finally {
        // Cerrar el navegador
        await driver.quit();
    }
})();
