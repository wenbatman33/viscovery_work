import { Schema, arrayOf } from 'normalizr';

const modelSchema = new Schema('models');
const classSchema = new Schema('classes');
const brandSchema = new Schema('brands');

modelSchema.define({
  classes: arrayOf(classSchema),
});

classSchema.define({
  brands: arrayOf(brandSchema),
});

const modelListSchema = {
  models: arrayOf(modelSchema),
};

export default modelListSchema;
