import { Schema, arrayOf } from 'normalizr';

const brand = new Schema('brands');

const _class = new Schema('classes');
_class.define(
  {
    brands: arrayOf(brand),
  }
);

const model = new Schema('models');
model.define(
  {
    classes: arrayOf(_class),
  }
);

const tagsMappingSchema = {
  models: arrayOf(model),
};

export default tagsMappingSchema;
