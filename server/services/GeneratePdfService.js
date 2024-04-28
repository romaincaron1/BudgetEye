const fs = require('fs');
const puppeteer = require('puppeteer');

const generatePdf = async (invoices, templatePath, outputPath, startDate, endDate) => {
    let template = fs.readFileSync(templatePath, 'utf8');

    const invoiceRows = invoices.map(invoice => {
        return `
            <tr>
                <td>${invoice.title}</td>
                <td>${new Date(invoice.date).toLocaleDateString()}</td>
                <td>${invoice.total_ttc.toFixed(2)} €</td>
            </tr>
        `;
    }).join('');

    const invoiceImages = invoices.map(invoice => {
        if (invoice.image_url) {
            return `
            <div style="margin-top: 2rem;">
                <h3>${invoice.title}</h3>
                <img style="max-height: 700px" src="${'http://localhost:3333/' + invoice.image_url}" alt="${invoice.image_url}" />
            </div>
            `;
        }
    }).join('');

    const title = 'Bilan du ' + startDate.toLocaleDateString() + ' au ' + endDate.toLocaleDateString();

    const data = {
        title: title,
        invoiceImages: invoiceImages,
        invoices: invoiceRows,
    };

    template = replacePlaceholders(template, data);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(template);

    await page.pdf({ path: outputPath, format: 'A4' });

    // get url
    const pdfLink = "http://localhost:3333/uploads/" + outputPath.split('/').pop();

    await browser.close();

    return pdfLink;
}

const replacePlaceholders = (template, data) => {
    for (const [key, value] of Object.entries(data)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        template = template.replace(regex, value);
    }
    return template;
};

exports.generatePdf = generatePdf;