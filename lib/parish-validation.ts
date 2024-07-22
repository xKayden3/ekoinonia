import { number, z } from 'zod';

// import FileUpload from '../file-upload';
// const ImgSchema = z.object({
//   fileName: z.string(),
//   name: z.string(),
//   fileSize: z.number(),
//   size: z.number(),
//   fileKey: z.string(),
//   key: z.string(),
//   fileUrl: z.string(),
//   url: z.string()
// });
export const IMG_MAX_LIMIT = 3;
export const createParishSchema = z.object({
  id: z.coerce.number(),
  name: z
    .string()
    .min(3, { message: 'Parish Name must be at least 3 characters' })
  // imgUrl: z
  //   .array(ImgSchema)
  //   .max(IMG_MAX_LIMIT, { message: 'You can only add up to 3 images' })
  //   .min(1, { message: 'At least one image must be added.' }),
  // description: z
  //   .string()
  //   .min(3, { message: 'Product description must be at least 3 characters' }),
  // price: z.coerce.number(),
  // category: z.string().min(1, { message: 'Please select a category' })
});

export type ParishFormValues = z.infer<typeof createParishSchema>;
