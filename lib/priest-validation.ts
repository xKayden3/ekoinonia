import { z } from 'zod';
export type Priest = {
  id: number;
  name: string;
  parish: {
    name: string;
  };
  designation: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface PriestClientProps {
  data: Priest[];
}

// for string
const requiredString = z.coerce.string().min(1, 'Required');

// for numeric
const numericRequiredString = requiredString.regex(/^\d+$/, 'Must be a number');

const ImgSchema = z.object({
  fileName: z.string(),
  name: z.string(),
  fileSize: z.number(),
  size: z.number(),
  fileKey: z.string(),
  key: z.string(),
  fileUrl: z.string(),
  url: z.string()
});
export const IMG_MAX_LIMIT = 3;

export const priestFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Product Name must be at least 3 characters' }),
  parish_id: numericRequiredString,
  designation: z
    .string()
    .min(3, { message: 'Product Name must be at least 3 characters' })
});

export type PriestFormValues = z.infer<typeof priestFormSchema>;
