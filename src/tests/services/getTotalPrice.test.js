const { getTotalPrice } = require('../../services/getTotalPrice.service');
describe('getTotalPrice', () => {
    it('calculates total price correctly', () => {
        const productList = [
            { order_quantity: 5, price: '1499.99' },
            { order_quantity: 2, price: '49.95' }
        ];

        const totalPrice = getTotalPrice(productList);

        // Expected total price = (5 * 1499.99) + (2 * 49.95) = 7499.95 + 99.90 = 7599.85
        expect(totalPrice).toBeCloseTo(7599.85, 2); // Using toBeCloseTo for floating-point precision
    });

    it('returns 0 for empty product list', () => {
        const totalPrice = getTotalPrice([]);

        expect(totalPrice).toBe(0);
    });
});