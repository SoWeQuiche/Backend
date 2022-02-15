/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Document,
  FilterQuery as MongooseFilterQuery,
  Model,
  Types,
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

  async findOneBy(
    condition: FilterQuery<T>,
    params?: AdditionalParams,
  ): Promise<T | null> {
    try {
      const finedObject = await this.Model.findOne(condition)
        .select(
          (params?.hiddenPropertiesToSelect || [])
            .map((property) => `+${property}`)
            .join(' '),
        )
        .populate((params?.populate || []).join(' '));

      // @ts-ignore
      return finedObject || null;
    } catch (e) {
      return null;
    }
  }

  async findOneById(_id: string, params?: AdditionalParams): Promise<T | null> {
    // @ts-ignore
    return this.findOneBy({ _id }, params);
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  async findManyBy(
    condition: FilterQuery<T>,
    params?: AdditionalParams,
  ): Promise<T[]> {
    try {
      return this.Model.find(condition)
        .select(
          (params?.hiddenPropertiesToSelect || [])
            .map((property) => `+${property}`)
            .join(' '),
        )
        .populate((params?.populate || []).join(' '));
    } catch {
      return [];
    }
  }

  async findAll(params?: AdditionalParams): Promise<T[]> {
    return this.findManyBy({}, params);
  }

  async pushArray(condition: FilterQuery<T>, data: DataType): Promise<boolean> {
    try {
      // @ts-ignore
      const update = await this.Model.updateOne(condition, {
        $push: data,
        $inc: { __v: 1 },
      });
      return update.modifiedCount > 0;
    } catch {
      return false;
    }
  }

  async pullArray(condition: FilterQuery<T>, data: DataType): Promise<boolean> {
    try {
      // @ts-ignore
      const update = await this.Model.updateOne(condition, {
        $pull: data,
        $inc: { __v: 1 },
      });
      return update.modifiedCount > 0;
    } catch {
      return false;
    }
  }
}

export type AdditionalParams = {
  hiddenPropertiesToSelect?: string[];
  populate?: string[];
};
export type FilterQuery<T> = MongooseFilterQuery<T>;
export type DataType = Record<
  string,
  number | string | boolean | null | Types.ObjectId | any[]
>;

export default BaseRepository;
