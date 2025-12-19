const { sequelize } = require('../config/database');
const { Variant, Reservation } = require('../models');
const { Op } = require('sequelize');
const pricingService = require('./PricingService');

class InventoryService {

    async reserveStock(variantId, quantity, userId) {
        const t = await sequelize.transaction();

        try {
            const variant = await Variant.findByPk(variantId, {
                lock: true,
                transaction: t
            });

            if (!variant) {
                throw new Error('Variant not found');
            }

            const activeReservations = await Reservation.sum('quantity', {
                where: {
                    variantId: variantId,
                    expiresAt: {
                        [Op.gt]: new Date()
                    }
                },
                transaction: t
            });

            const currentReserved = activeReservations || 0;

            const availableStock = variant.stockQuantity - currentReserved;

            if (availableStock < quantity) {
                await t.rollback();
                return { success: false, message: 'Insufficient stock available' };
            }

            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 15);

            const priceData = await pricingService.calculatePrice(variantId, quantity, {});
            const price = priceData.finalTotal;


            const reservation = await Reservation.create({
                variantId,
                userId,
                quantity,
                price,
                cartId: `cart_${userId}`,
                expiresAt
            }, { transaction: t });

            await t.commit();

            return {
                success: true,
                reservationId: reservation.id,
                expiresAt: expiresAt
            };

        } catch (error) {
            await t.rollback();
            console.error('Reservation failed:', error);
            throw error;
        }
    }
    
    async checkout(userId) {
        const t = await sequelize.transaction();

        try {
            const reservations = await Reservation.findAll({
                where: {
                    userId: userId,
                    expiresAt: { [Op.gt]: new Date() }
                },
                include: [Variant],
                transaction: t
            });

            if (reservations.length === 0) {
                throw new Error('Cart is empty or reservation expired.');
            }

            let totalAmount = 0;

            for (const res of reservations) {
                const variant = res.Variant;

                await variant.decrement('stockQuantity', {
                    by: res.quantity,
                    transaction: t
                });

                totalAmount += res.price;

                await res.destroy({ transaction: t });
            }

            await t.commit();

            return {
                success: true,
                message: 'Checkout successful',
                itemsSold: reservations.length,
                totalAmount
            };

        } catch (error) {
            await t.rollback();
            console.error('Checkout failed:', error);
            throw error;
        }
    }
}

module.exports = new InventoryService();