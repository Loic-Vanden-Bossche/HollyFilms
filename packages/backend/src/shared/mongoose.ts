import { Types } from "mongoose";
import { HttpException, HttpStatus } from "@nestjs/common";

const isObjectId = (id: string) => {
  if (!id) return false;
  return /^[0-9a-fA-F]{24}$/i.test(id);
};

const checkObjectId = (str: string): string => {
  if (!isObjectId(str))
    throw new HttpException("Invalid Object Id", HttpStatus.BAD_REQUEST);
  return str;
};

const getObjectId = (id: string): Types.ObjectId => {
  return new Types.ObjectId(id);
};

export { checkObjectId, getObjectId, isObjectId };
