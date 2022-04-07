const { ObjectId } = require('mongodb');

const { Database } = require('../database/index');
const { ProductsUtils } = require('./utils');

const COLLECTION = 'products';

const getAll = async () => {
    const collection = await Database(COLLECTION);
    return await collection.find({}).toArray();
};

const getById = async (id) => {
    const collection = await Database(COLLECTION);
    return collection.findOne({ _id: ObjectId(id) });
};

const create = async (product) => {
    const collection = await Database(COLLECTION);
    let result = await collection.insertOne(product);
    return result.insertedId;
};

//update
const update = async (id, product) => {
    const collection = await Database(COLLECTION);
    let result = await collection.updateOne({_id: {$eq: ObjectId(id)}},{$set:{name: product.name, precio: product.precio, cantidad: product.cantidad}});
    return result._id;
};

// delete

const dlt = async (id) =>{
    const collection = await Database(COLLECTION);
    const query = {_id: ObjectId(id)}
    const result = await collection.deleteOne(query);
    if (result.deletedCount === 1) {
        return result
    } else{
        return 0
    }
}

const generateReport = async (name, res) => {
    let products = await getAll();
    ProductsUtils.excelGenerator(products, name, res)
}

module.exports.ProductsService = {
    getAll,
    getById,
    create,
    generateReport,
    update,
    dlt,
}