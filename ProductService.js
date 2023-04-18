const ProductDAO = require("./ProductDAO");
const ProductUtility=require("./ProductUtility");
// let products = [
//   { id: 1, name: "Product 1", price: 100 },
//   { id: 2, name: "Product 2", price: 200 },
//   { id: 3, name: "Product 3", price: 300 },
//   { id: 4, name: "Product 4", price: 400 },
// ];

let getProducts = async () => {
  return await ProductDAO.getProductsFromDB();
};

let getComments = async ()=> {
  return await ProductDAO.getCommentsFromDB();
}

let getProductById = async (id) => {
  console.log("id: " + id);
  return await ProductDAO.getProductsFromDB(id);
};

let addProduct = async (productInput) => {
  //validations///
  const error = ProductUtility.isValidInputProduct(productInput);
  if(error) return error
  return await ProductDAO.addProductToDB(productInput);
};

let deleteProductById = async(id) => {
  console.log("id: " + id);
  return await ProductDAO.deleteProductsFromDB(id);
} 

let changeProductById = async(id,productInput) => {
  console.log("id: " + id);
  return await ProductDAO.changeProductsFromDB(id,productInput);
} 

module.exports = { getProducts, getProductById, addProduct, deleteProductById, changeProductById, getComments};