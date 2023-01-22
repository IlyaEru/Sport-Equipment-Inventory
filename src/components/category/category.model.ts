import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,

      required: true,
      unique: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
      validator: (str: string) => {
        return /^\d+$/.test(str);
      },
      message: (props: any) => {
        return `${props.value} is not a valid name!`;
      },
    },
  },
  {
    versionKey: false,
  },
);

categorySchema.pre('deleteOne', async function (next) {
  // Get the id of the category being deleted
  const categoryId = this.getQuery()._id;

  // Delete all equipment documents that have a reference to this category
  await mongoose.model('Equipment').deleteMany({ category: categoryId });

  // Continue with the delete operation
  next();
});

export default mongoose.model('Category', categorySchema);
