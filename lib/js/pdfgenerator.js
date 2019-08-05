'use strict';

const createPdf = async() => {
    module.paths.push(process.argv[4]);
    const puppeteer = require('puppeteer');
    const qr = require('qr-image');
    let browser;
    try {
        browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        const page = await browser.newPage();
        await page.goto(process.argv[2], {timeout: 10000, waitUntil: 'networkidle2'});
        await page.waitFor(250);
        let qrcodes = await generateQR(qr, process.argv[5]);
        await page.evaluate((qrcodes) => {
          let imgs_bars = document.querySelectorAll('.qrcode-img');
          for (i = 0; i < imgs_bars.length; i++) {
            imgs_bars[i].src = qrcodes[i];
          }
        },qrcodes);
        await page.pdf({
            path: process.argv[3],
            printBackground: true
        });
    } catch (err) {
        console.log(err.message);
    } finally {
        if (browser) {
            browser.close();
        }
        process.exit();
    }
};
createPdf();

async function generateQR(qr, numbers) {
 let arrayQR = [];
 let ticketsNumber = numbers.split(',');
 for(let number of ticketsNumber) {
   try {
       let qr_svg = qr.imageSync(number,{ ec_level: 'L', type: 'svg' });
       arrayQR.push("data:image/svg+xml;charset=utf-8," + qr_svg);
     } catch (error) {
   }
 }
 return arrayQR;
}
