/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Document,
  FilterQuery as MongooseFilterQuery,
  Model,
  Types,
  QueryWithHelpers,
  HydratedDocument,
} from 'mongoose';
import { BadRequestException } from '@nestjs/common';

class BaseRepository<T extends Document> {
  readonly Model: Model<T>;

  constructor(model: Model<T>) {
    this.Model = model;
  }

  async insert(data: FilterQuery<T>): Promise<T> {
    try {
      const newObject = new this.Model(data);
      await newObject.validate();

      return await newObject.save();
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async deleteOnyBy(condition: FilterQuery<T>): Promise<boolean> {
    try {
      return (await this.Model.deleteOne(condition)).deletedCount > 0;
    } catch {
      return false;
    }
  }

  async updateOneBy(
    condition: FilterQuery<T>,
    set: DataType,
  ): Promise<boolean> {
    try {
      const { _id, ...data } = set;
      const update = await this.Model.updateOne(condition, {
        // @ts-ignore
        $set: data,
        $inc: { __v: 1 },
      });
      return update.modifiedCount > 0;
    } catch {
      return false;
    }
  }

  async findOneById(
    _id: string,
    params: AdditionalParams = {},
  ): Promise<T | null> {
    return this.findOneBy({ _id }, params);
  }

  async findOneBy(
    condition: FilterQuery<T>,
    params: AdditionalParams = {},
  ): Promise<T | null> {
    try {
      return this.selectAndPopulate<T>(this.Model.findOne(condition), params);
    } catch (e) {
      return null;
    }
  }

  async findManyBy(
    condition: FilterQuery<T>,
    params: AdditionalParams = {},
  ): Promise<T[]> {
    try {
      return this.selectAndPopulate<T[]>(this.Model.find(condition), params);
    } catch {
      return [];
    }
  }

  async findAll(params: AdditionalParams = {}): Promise<T[]> {
    return this.findManyBy({}, params);
  }

  private async selectAndPopulate<D>(
    query: QueryWithHelpers<
      HydratedDocument<T, any, any> | null,
      HydratedDocument<T, any, any>,
      any,
      T
    >,
    params: AdditionalParams,
  ): Promise<D> {
    return query
      .select(
        (params?.hiddenPropertiesToSelect || [])
          .map((property) => `+${property}`)
          .join(' '),
      )
      .populate((params?.populate || []).join(' '));
  }
}

export type AdditionalParams = {
  hiddenPropertiesToSelect?: string[];
  populate?: string[] | string[][];
};
export type FilterQuery<T> = MongooseFilterQuery<T>;
export type DataType = Record<
  string,
  number | string | boolean | null | Types.ObjectId | any[]
>;

export default BaseRepository;
