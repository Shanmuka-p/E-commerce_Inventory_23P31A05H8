// test_logic.js
const { sequelize, Product, Variant, Reservation } = require('./models'); // Adjust path if needed
const inventoryService = require('./services/InventoryService');

async function runTest() {
    try {
        console.log('🔄 Connecting to Database...');
        await sequelize.sync({ force: true }); // WARNING: This wipes the DB clean!
        console.log('✅ Database Synced.');

        // --- STEP 1: SETUP DATA ---
        console.log('\n--- 1. Creating Dummy Data ---');
        const product = await Product.create({
            title: 'Test Gaming Laptop',
            basePrice: 1000.00,
            status: 'active'
        });

        const variant = await Variant.create({
            sku: 'LAPT-001',
            stockQuantity: 10, // We have 10 in stock
            priceAdjustment: 0,
            ProductId: product.id
        });

        console.log(`✅ Created Variant: ${variant.sku} with Stock: ${variant.stockQuantity}`);

        // --- STEP 2: TEST RESERVATION (Add to Cart) ---
        console.log('\n--- 2. Testing Reservation (Add to Cart) ---');
        const userId = 101;
        const qtyToBuy = 2;

        const reserveResult = await inventoryService.reserveStock(variant.id, qtyToBuy, userId);

        if (reserveResult.success) {
            console.log(`✅ Reservation Success! Reservation ID: ${reserveResult.reservationId}`);
        } else {
            console.error('❌ Reservation Failed:', reserveResult.message);
            return; // Stop here if failed
        }

        // Verify DB State
        const reservations = await Reservation.findAll();
        console.log(`🔎 DB Check: Found ${reservations.length} reservation(s) in table.`);

        // --- STEP 3: TEST OVERSOLD (Concurrency Check) ---
        // console.log('\n--- 3. Testing Overselling (Should Fail) ---');
        // // We have 10 stock. 2 are reserved. 8 available.
        // // Let's try to buy 9.
        // const failResult = await inventoryService.reserveStock(variant.id, 9, 102);

        // if (!failResult.success) {
        //     console.log('✅ Overselling Prevention Worked! System rejected the order.');
        // } else {
        //     console.error('❌ FATAL: System allowed overselling!');
        // }

        // // --- STEP 4: TEST CHECKOUT ---
        // console.log('\n--- 4. Testing Checkout ---');
        const checkoutResult = await inventoryService.checkout(userId);

        console.log('✅ Checkout Result:', checkoutResult);

        // Verify Final Stock
        const updatedVariant = await Variant.findByPk(variant.id);
        console.log(`\n🎉 Final Stock Check:`);
        console.log(`   Initial Stock: 10`);
        console.log(`   Bought: ${qtyToBuy}`);
        console.log(`   Current Stock: ${updatedVariant.stockQuantity}`);

        if (updatedVariant.stockQuantity === 8) {
            console.log('✅ TEST PASSED: Stock was correctly deducted.');
        } else {
            console.error('❌ TEST FAILED: Stock calculation is wrong.');
        }

    } catch (error) {
        console.error('❌ Test Crashed:', error);
    } finally {
        await sequelize.close();
    }
}

runTest();