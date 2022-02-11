import { UpdateQuery } from "mongoose";
import { FilterQuery, QueryOptions } from "mongoose";
import ProductModel, { ProductDocument, ProductInput } from "../models/product.model";
/*
Pipe (|) is used to separate each type, so for example number | string | boolean 
is the type of a value that can be a number, a string, or a boolean.
*/
export const createProduct = async (
  input: ProductInput
) => {
  return ProductModel.create(input);
};

export const findProduct = async (
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true }
) => {
  return ProductModel.findOne(query, {}, options);
};

export const findAndUpdateProduct = async (
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>,
  options: QueryOptions
) => {
  return ProductModel.findOneAndUpdate(query, update, options);
};

export const deleteProduct = async (query: FilterQuery<ProductDocument>) => {
  return ProductModel.deleteOne(query);
};
