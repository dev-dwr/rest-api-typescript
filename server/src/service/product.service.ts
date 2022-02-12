import { UpdateQuery } from "mongoose";
import { FilterQuery, QueryOptions } from "mongoose";
import ProductModel, {
  ProductDocument,
  ProductInput,
} from "../models/product.model";
import { databaseResponseTimeHistogram } from "../utils/metrics";
import log from "../utils/logger";
/*
Pipe (|) is used to separate each type, so for example number | string | boolean 
is the type of a value that can be a number, a string, or a boolean.
*/
export const createProduct = async (input: ProductInput) => {
  const metricsLabels = {
    operation: "createProduct",
  };
  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await ProductModel.create(input);
    timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (er: any) {
    log.error(er, "Error during creating a product in product.service");
    timer({ ...metricsLabels, success: "false" });
    throw er;
  }
};

export const findProduct = async (
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true }
) => {
  const metricsLabels = {
    operation: "findProduct",
  };
  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await ProductModel.findOne(query, {}, options);
    timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (er: any) {
    log.error(er, "Error during finding a product in product.service");
    timer({ ...metricsLabels, success: "false" });
    throw er;
  }
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
