const { sequelize } = require('../config/database');
const { Variant, Reservation } = require('../models');
const { Op } = require('sequelize');

class InventoryService {

    /**
     * Attempts to reserve stock for a user.
     * @param {string} variantId - The ID of the item.
     * @param {number} quantity - How many they want.
     * @param {string} userId - The user's ID.
     * @returns {Promise<Object>} - The result of the operation.
     */
    async reserveStock(variantId, quantity, userId) {
        // 1. Start a Transaction
        const t = await sequelize.transaction();

        try {
            // 2. FETCH WITH LOCK
            // This is the most important line. 
            // 'lock: true' tells Postgres to FREEZE this row.
            // No other request can update this variant until we commit or rollback.
            const variant = await Variant.findByPk(variantId, {
                lock: true,
                transaction: t
            });

            if (!variant) {
                throw new Error('Variant not found');
            }

            // 3. Calculate currently reserved stock
            // We sum up all ACTIVE reservations (those that haven't expired)
            const activeReservations = await Reservation.sum('quantity', {
                where: {
                    variantId: variantId,
                    expiresAt: {
                        [Op.gt]: new Date() // "expiresAt" is Greater Than NOW
                    }
                },
                transaction: t
            });

            // Handle null if no reservations exist yet
            const currentReserved = activeReservations || 0;

            // 4. Calculate real availability
            const availableStock = variant.stockQuantity - currentReserved;

            if (availableStock < quantity) {
                // FAIL: Not enough stock
                await t.rollback();
                return { success: false, message: 'Insufficient stock available' };
            }

            // 5. SUCCESS: Create the Reservation
            // Expiry time = NOW + 15 minutes
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 15);

            const reservation = await Reservation.create({
                variantId,
                userId,
                quantity,
                cartId: `cart_${userId}`, // Simplified for demo
                expiresAt
            }, { transaction: t });

            // 6. Commit the transaction (Release the Lock)
            await t.commit();

            return {
                success: true,
                reservationId: reservation.id,
                expiresAt: expiresAt
            };

        } catch (error) {
            // If code crashes, undo everything
            await t.rollback();
            console.error('Reservation failed:', error);
            throw error;
        }
    }
    /**
     * Converts reservations into a permanent sale.
     * @param {string} userId - The user checking out.
     * @returns {Promise<Object>} - The order details.
     */
    async checkout(userId) {
        const t = await sequelize.transaction();

        try {
            // 1. Get all active reservations for this user
            // We must check they haven't expired yet!
            const reservations = await Reservation.findAll({
                where: {
                    userId: userId,
                    expiresAt: { [Op.gt]: new Date() } // Only active ones
                },
                include: [Variant], // Bring the variant data so we know the price
                transaction: t
            });

            if (reservations.length === 0) {
                throw new Error('Cart is empty or reservation expired.');
            }

            let totalAmount = 0;

            // 2. Process each item
            for (const res of reservations) {
                const variant = res.Variant;

                // A. Permanent Stock Deduction
                // We use 'decrement' which is an atomic SQL operation:
                // UPDATE variants SET stockQuantity = stockQuantity - X WHERE id = Y
                await variant.decrement('stockQuantity', {
                    by: res.quantity,
                    transaction: t
                });

                // B. Calculate total (simplified logic)
                // In the real Dynamic Pricing section, we would use the snapshot price here.
                // For now, we use the current variant price.
                totalAmount += (parseFloat(variant.priceAdjustment) * res.quantity);

                // C. Destroy the Reservation (It is now a sale)
                await res.destroy({ transaction: t });
            }

            // 3. (Optional) Create an Order Record
            // This serves as the permanent receipt
            // const order = await Order.create({ userId, total: totalAmount }, { transaction: t });

            // 4. Commit: The point of no return
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