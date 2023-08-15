const checkWarehouseCapacityService = require('../../services/checkWarehouseCapacity.service');


describe('checkWarehouseCapacityService', () => {
    it('should return true if the warehouse has enough capacity',  () => {
        const params = {
            toWarehouseCapacity: '1000.0',
            toWarehouseInventory: {
                quantity: '1',
                height: '10.0',
                width: '10.0',
                length: '10.0'
            }
        };

        const result = checkWarehouseCapacityService(params);
        expect(result).toBe(true);
    });

    it('should return false if the warehouse does not have enough capacity',  () => {
        const params = {
            toWarehouseCapacity: '100.0', // Lower capacity than needed
            toWarehouseInventory: {
                quantity: '5',
                height: '10.0',
                width: '10.0',
                length: '10.0'
            }
        };

        const result = checkWarehouseCapacityService(params);
        expect(result).toBe(false);
    });

    it('should throw an error if there is an invalid input',  () => {
        const params = {
            toWarehouseCapacity: '1000.0',
            toWarehouseInventory: {
                quantity: 'invalid', // Invalid input
                height: '10.0',
                width: '10.0',
                length: '10.0'
            }
        };

        expect(() => checkWarehouseCapacityService(params)).toThrowError('Invalid input.');
    });
});
