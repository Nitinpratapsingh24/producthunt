//////CONNECTION WITH MYSQL SERVER//////

const mysql = require("mysql");
const util = require("util");
// const {v4 : uuidv4} = require("uuid");

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'producthunt',
  password: 'password'
});
connection.connect((err) => {
  if (err)
  {
    console.log(err);
    throw err;
  } 
  console.log("Connected to MySQL Server!");
});
const query = util.promisify(connection.query).bind(connection);

// let getProductsFromDB = (callback) => {
//   connection.query("SELECT * FROM product", (err, rows, fields) => {
//     if (err) throw err;
//     callback(rows);
//   });
// };

//////REQUEST METHODS///////

///////All_Queries///////

//get productdetails
const getProductDataQuery = `SELECT * FROM product `;
  
//get commentdetails
const getCommentDataQuery = `SELECT user_id,id,desp FROM comment `;

//get imagesdetails
const getImageDataQuery = `SELECT id,url FROM image `;

//get noOfComments
const getNoOfCommentsQuery = `SELECT COUNT (prod_id) FROM comment `;

//get noOfUpvotes
const getNoOfUpvotesQuery = `SELECT COUNT (prod_id) FROM upvote `;

//get noOfProducts
const getNoOfProductsQuery = `SELECT COUNT (id) FROM product `;

//get tagsdetails
const getAllTagsQuery = `SELECT id,tag FROM product_tag FULL JOIN tag ON tag_id = id `;

////1. GET METHOD//////
let getProductsFromDB = async (id) => {

  //FOR MAIN_PAGE PRODUCTS//////
  if(!id) 
  {
    let products = await query(getProductDataQuery);
    let productIds= products.map((element)=>{
      return element.id;
    })

    let allProducts=[];
    for(let id of productIds)
    {
      let newProduct={};//particular product details

      //calculating results for a particular product of mainpage
      let newProductData = await query(`SELECT id,name,visit_url,icon_url,short_desp,created_on,updated_on FROM product WHERE id = ${id} `);
      let noOfComments = await query(getNoOfCommentsQuery + `WHERE prod_id = ${id}`);
      let noOfUpvotes = await query( getNoOfUpvotesQuery + `WHERE prod_id = ${id} `);
      let allTags= await query(getAllTagsQuery + `WHERE prod_id = ${id}`);
      
      
      //adding results to final object
      newProductData[0]["noOfComments"] = noOfComments[0]["COUNT (prod_id)"];
      newProductData[0]["noOfUpvotes"] = noOfUpvotes[0]["COUNT (prod_id)"];
      newProductData[0]["tags"] = allTags;
      newProduct= newProductData[0];

      allProducts.push(newProduct);//adding particular product to allProducts
    }  
    return allProducts;
  }

  //FOR PRODUCT DETAIL_PAGE /////

  //calculating results for particular product page
  let result = await query(getProductDataQuery + `WHERE id = ${id}` );
  let comments= await query(getCommentDataQuery + `WHERE prod_id = ${id}` );
  let images =  await query(getImageDataQuery + `WHERE prod_id = ${id}` );
  let noOfComments = await query(getNoOfCommentsQuery + `WHERE prod_id = ${id}` );
  let noOfUpvotes = await query(getNoOfUpvotesQuery + `WHERE prod_id = ${id}` );
  let allTags= await query(getAllTagsQuery + `WHERE prod_id = ${id}`);

  
  //adding results to final object
  result[0]["comments"] = comments;
  result[0]["images"] = images;  
  result[0]["noOfComments"] = noOfComments[0]["COUNT (prod_id)"];
  result[0]["noOfUpvotes"] = noOfUpvotes[0]["COUNT (prod_id)"];
  result[0]["tags"]= allTags;

  console.log(result);
  return result;
};

/////2. ADD METHOD//////
let addProductToDB = async (productInput) => {

  //validation for duplicate entry
  // let countOfProductByName = await query(getNoOfProductsQuery + `WHERE name = "${productInput["name"]}" `);
  // if(countOfProductByName) return {err : "Duplicate Entry !(Product with similar name already exists)"};
  // let countOfProductByUrl = await query(getNoOfProductsQuery + `WHERE visit_url = "${productInput["visit_url"]}" `);
  // if(countOfProductByUrl) return {err : "Duplicate Entry !(Product with similar url already exists)"};

  let userId = Date.now(); ///creating own id's using Date.now() method  
  userId = Math.floor(userId/1000);

  let columnQuery="id,";
  let valuesQuery=`${userId},`;
  for(let key in productInput)
  {
    columnQuery += `${key},`;
    let value = productInput[key];
    valuesQuery += `"${value}",`;
  }
  let columnQueryupdated = columnQuery.substring(0,columnQuery.length-1);
  let valuesQueryupdated = valuesQuery.substring(0,valuesQuery.length-1);
  let defaultSqlQuery = "SELECT * FROM product";

  let sqlQuery = `INSERT INTO product (${columnQueryupdated}) VALUES(${valuesQueryupdated}) ` ;
  sqlQuery = productInput ? sqlQuery : defaultSqlQuery;
  let result = await query(sqlQuery);

  result["id"]=userId; // adding generated id's in result
  return result;
};

////3. DELETE METHOD///////

let deleteProductsFromDB = async (id) => {
  let sqlQuery1 = "SELECT * FROM product";
  let sqlQuery = "DELETE FROM product";
  sqlQuery = id ? sqlQuery + ` WHERE id = ${id} `: sqlQuery1;

  let result = await query(sqlQuery);
  // console.log(result);
  return result;
};

////4. ALTER METHOD///////
let changeProductsFromDB = async (id,productInput) => {
  
  let sqlQuery1 =  "SET ";
  for(let key in productInput)
  {
      let value = productInput[key];
      sqlQuery1 += `${key} = "${value}",`;
  }
  let sqlQuery1updated = sqlQuery1.substring(0,sqlQuery1.length-1);
  console.log(sqlQuery1updated);

  let sqlQuery = "UPDATE product "+ sqlQuery1updated + ` WHERE id = ${id}`;
  console.log(sqlQuery);
  let result = await query(sqlQuery);
  console.log(result);
  return result;
};

module.exports = { getProductsFromDB, addProductToDB, deleteProductsFromDB, changeProductsFromDB};