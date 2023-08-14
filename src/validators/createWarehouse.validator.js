
// require const {name, province, city, district, street, number, total_volume, available_volume}
const validateCreateWarehousePayload = (params) => {
    
    // validate presence of params
    if (params.name === null || params.province === null || params.city === null || params.district === null || params.street === null || params.number === null || params.total_volume === null || params.available_volume === null) {
        return false;
    }

    // validate type of params
    if (typeof params.name !== 'string' || typeof params.province !== 'string' || typeof params.city !== 'string' || typeof params.district !== 'string' || typeof params.street !== 'string' || typeof params.number !== 'string' || typeof params.total_volume !== 'number' || typeof params.available_volume !== 'number') {
        return false;
    }

    return true;
}

module.exports = {validateCreateWarehousePayload};
