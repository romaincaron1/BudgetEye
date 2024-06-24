const {Type} = require('../models/type');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    console.log("get types")
    const types = await Type.find().sort('name');
    console.log("types",types);
    res.send(types);
});

router.post('/',async (req, res) => {


    const type = new Type({
        name: req.body.name,
        color: req.body.color,
        treshold: req.body.treshold,
    });
    await type.save();

    res.send(type);
});

router.put('/:id',async (req, res) => {

    const type = await Type.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            color: req.body.color,
            treshold: req.body.treshold,
        }, { new: true });

    if (!type) return res.status(404).send('The type with the given ID was not found.');

    res.send(type);
});

router.delete('/:id',async (req, res) => {
    const type = await Type.findByIdAndRemove(req.params.id);

    if (!type) return res.status(404).send('The type with the given ID was not found.');

    res.send(type);
});

router.get('/:id', async (req, res) => {
    const type = await Type.findById(req.params.id);

    if (!type) return res.status(404).send('The type with the given ID was not found.');

    res.send(type);
});

module.exports = router;