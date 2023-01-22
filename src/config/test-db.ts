import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: any = undefined;
mongoose.Schema.Types.String.cast(false);

const setUp = async () => {
  mongo = await MongoMemoryServer.create();
  const url = mongo.getUri();

  mongoose.set('strictQuery', false);

  await mongoose.connect(url);
};

const dropDatabase = async () => {
  if (mongo) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  }
};

const dropCollections = async () => {
  if (mongo) {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
};

export default {
  setUp,
  dropDatabase,
  dropCollections,
};
