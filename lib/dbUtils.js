import mongoose from 'mongoose';

// Utility to clear all cached models (useful for development)
export const clearModels = () => {
  Object.keys(mongoose.models).forEach(modelName => {
    delete mongoose.models[modelName];
  });
};

// Utility to drop and recreate a collection (use with caution)
export const recreateCollection = async (modelName) => {
  try {
    const model = mongoose.models[modelName];
    if (model) {
      await model.collection.drop();
      console.log(`Collection ${modelName} dropped successfully`);
    }
  } catch (error) {
    if (error.code === 26) {
      // Collection doesn't exist, which is fine
      console.log(`Collection ${modelName} doesn't exist, skipping drop`);
    } else {
      console.error(`Error dropping collection ${modelName}:`, error);
    }
  }
};

// Utility to validate document against schema
export const validateDocument = async (model, data) => {
  try {
    const doc = new model(data);
    await doc.validate();
    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      errors: error.errors,
      message: error.message 
    };
  }
};