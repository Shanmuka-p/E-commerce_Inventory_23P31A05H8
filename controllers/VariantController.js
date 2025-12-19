const { Variant } = require('../models');

exports.createVariant = async (req, res) => {
    try {
        const variant = await Variant.create(req.body);
        res.status(201).json(variant);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllVariants = async (req, res) => {
    try {
        const variants = await Variant.findAll();
        res.json(variants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getVariantById = async (req, res) => {
    try {
        const variant = await Variant.findByPk(req.params.id);
        if (variant) {
            res.json(variant);
        } else {
            res.status(404).json({ error: 'Variant not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateVariant = async (req, res) => {
    try {
        const [updated] = await Variant.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedVariant = await Variant.findByPk(req.params.id);
            res.json(updatedVariant);
        } else {
            res.status(404).json({ error: 'Variant not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteVariant = async (req, res) => {
    try {
        const deleted = await Variant.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Variant not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
