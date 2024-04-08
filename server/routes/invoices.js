const {Invoice} = require('../models/invoice');
const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
  
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      // Vérifier si un fichier a été téléchargé
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        // Si aucun fichier image n'est téléchargé, continuer la requête sans erreur
        req.noImage = true;
      }
      cb(null, true);
    }
  });


router.get('/', async (req, res) => {

    // if query param archived is true, return archived invoices
    if (req.query.archived === 'true') {
        const invoices = await Invoice.find({archived: true}).populate('type_id').sort('name');
        res.send(invoices);
    }else{
        const invoices = await Invoice.find({archived: false}).populate('type_id').sort('name');
        res.send(invoices);
    }
    
});

router.post("/", upload.single("image"), async (req, res) => {
  try {

    let imageUrl = ""; // Initialisez l'URL de l'image comme une chaîne vide

    // Vérifiez si un fichier a été téléchargé
    if (req.file) {
      // Si un fichier a été téléchargé, créez l'URL de l'image
      imageUrl = req.file.path.replace(/^public[\\/]/, '');
    }    

    // Créer une nouvelle facture avec l'URL de l'image
    const invoice = new Invoice({
      image_url: imageUrl,
      title: req.body.title,
      date: req.body.date,
      total_ttc: req.body.total_ttc,
      archived: req.body.archived ? req.body.archived : false,
      type_id: req.body.type_id,
    });

    // Enregistrer la facture dans la base de données
    await invoice.save();

    res.send(invoice);
  } catch (error) {
    console.error("Erreur lors de la création de la facture :", error);
    res.status(500).send("Une erreur s'est produite lors de la création de la facture.");
  }
});

// archive an invoice

router.get('/archive/:id',async (req, res) => {
    
    const invoice = await Invoice.findByIdAndUpdate(req.params.id,
        {
            archived: true,
        }, { new: true });

    if (!invoice) return res.status(404).send('The invoice with the given ID was not found.');
        
    res.send(invoice);
});

// unarchive an invoice

router.get('/unarchive/:id',async (req, res) => {
        
        const invoice = await Invoice
        .findByIdAndUpdate(req.params.id,
            {
                archived: false,
            }, { new: true });

        if (!invoice) return res.status(404).send('The invoice with the given ID was not found.');

        res.send(invoice);
    }
);

router.put('/:id',async (req, res) => {

    const invoice = await Invoice.findByIdAndUpdate(req.params.id,
        {
            image_url: req.body.image_url,
            title: req.body.title,
            date: req.body.date,
            total_ttc: req.body.total_ttc,
            archived: req.body.archived,
            type_id: req.body.type_id,
        }, { new: true });

    if (!invoice) return res.status(404).send('The invoice with the given ID was not found.');

    res.send(invoice);
});

router.delete('/:id',async (req, res) => {
    const invoice = await Invoice.findByIdAndRemove(req.params.id);

    if (!invoice) return res.status(404).send('The invoice with the given ID was not found.');

    res.send(invoice);
});

router.get('/:id', async (req, res) => {
    const invoice = await Invoice.findById(req.params.id).populate('type_id');

    if (!invoice) return res.status(404).send('The invoice with the given ID was not found.');

    res.send(invoice);
});


module.exports = router;