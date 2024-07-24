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
  id: z.coerce.number(),
  name: z
    .string()
    .min(3, { message: 'Product Name must be at least 3 characters' }),
  parish_id: z.coerce.number().min(1, { message: 'Must select a Parish' }),
  designation: z
    .string()
    .min(3, { message: 'Product Name must be at least 3 characters' })
});

export type PriestFormValues = z.infer<typeof priestFormSchema>;
