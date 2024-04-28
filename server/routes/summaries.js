const { Summary } = require('../models/summary');
const express = require('express');
const router = express.Router();
const { Invoice } = require('../models/invoice');
const path = require('path');
const { generatePdf } = require('../services/GeneratePdfService');

router.get('/', async (req, res) => {
    const summaries = await Summary.find().sort('name');
    res.send(summaries);
});

router.post('/',async (req, res) => {
    const startDate = new Date(req.body.start_date);
    const endDate = new Date(req.body.end_date);
    const invoices = await Invoice.find({
        date: {
            $gte: req.body.start_date,
            $lte: req.body.end_date,
        },
        archived: false,
    });

    let pdfLink = '';

    const templatePath = path.join(__dirname, '../public', 'template', 'invoice-pdf.html');
    const outputPath = path.join(__dirname, '../public/uploads/' + Date.now() + '.pdf');

    pdfLink = await generatePdf(invoices, templatePath, outputPath, startDate, endDate);

    const summary = new Summary({
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        generated_date: req.body.generated_date,
        pdf_link: pdfLink,
    });
    await summary.save();

    res.send(summary);
});

router.put('/:id',async (req, res) => {

    const summary = await Summary.findByIdAndUpdate(req.params.id,
        {
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            generated_date: req.body.generated_date,
            pdf_link: req.body.pdf_link,
        }, { new: true });

    if (!summary) return res.status(404).send('The summary with the given ID was not found.');

    res.send(summary);
});

router.delete('/:id',async (req, res) => {
    const summary = await Summary.findByIdAndRemove(req.params.id);

    if (!summary) return res.status(404).send('The summary with the given ID was not found.');

    res.send(summary);
});

router.get('/:id', async (req, res) => {
    const summary = await Summary.findById(req.params.id);

    if (!summary) return res.status(404).send('The summary with the given ID was not found.');

    res.send(summary);
});

module.exports = router;