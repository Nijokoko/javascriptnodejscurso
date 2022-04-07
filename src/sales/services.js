const {ObjectId} = require('mongodb');
const {Database} = require('../database/index');
const COLLECTION = 'sales';
const {ProductsService} = require('../products/services'); //para llamar a las bases de datos de product
const {UsersService} = require('../users/services');

const getAll = async () =>{
    const collection = await Database(COLLECTION);
    return await collection.find({}).toArray();
}

const getById = async (id) => {
    const collection = await Database(COLLECTION);
    return collection.findOne({_id: ObjectId(id)});
}

const create = async (sale) => {
    const collection = await Database(COLLECTION);
    let product = await ProductsService.getById(sale.id_producto);
    let client = await UsersService.getById(sale.id_cliente);
    //ver si el cliente existe
    if (client) {
    
    //calcular y descontar productos a la venta del inventario
    //comprobar que hay stock 
    //validar si hay dinero suficiente
    let divicion = Math.trunc(sale.dinero / product.precio);
    console.log("Stock disponible->",product.cantidad >= divicion);
    console.log("cantidad mayor a uno->",divicion >= 1);
    console.log("producto->",product);
    if (product.cantidad >= divicion && divicion >= 1) {
        console.log("resultado venta / (precio producto) ->",divicion);
        let total = Math.trunc(product.cantidad - divicion);
        console.log("nuevo stock->", total);
        product = {name: product.name, precio: product.precio, cantidad: total};
        console.log("nuevo producto->",product);
        ProductsService.update(sale.id_producto, product);
        //meter la venta
        let venta = {cantidad: divicion, dinero: sale.dinero, id_producto: sale.id_producto, id_cliente: sale.id_cliente};
        let result = await collection.insertOne(venta);
        return result;
    }
    }else{
        return null;
    }
    
}
//update
const update = async (id,sale) =>{
    const collection = await Database(COLLECTION);
    //validar que dato exista
    let result = await collection.updateOne({_id: {$eq: ObjectId(id)}},{$set:{cantidad: sale.cantidad, dinero: sale.dinero, id_producto: sale.id_producto, id_cliente: sale.id_cliente}});
    return result._id
}
//delete
const dlt = async(id)=>{
    const collection = await Database(COLLECTION);
    let encontrado = collection.findOne({_id: ObjectId(id)});
    await collection.deleteOne({_id: ObjectId(id)});
    return encontrado
}

module.exports.SalesService = {
    getAll,
    getById,
    create,
    update,
    dlt,

}