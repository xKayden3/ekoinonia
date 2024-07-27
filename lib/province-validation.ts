import { z } from 'zod';
export type Province = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface ProvinceClientProps {
  data: Province[];
}

// for string
const requiredString = z.coerce.string().min(1, 'Required');

// for numeric
const numericRequiredString = requiredString.regex(/^\d+$/, 'Must be a number');

export const provinceFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Product Name must be at least 3 characters' })
});

export type ProvinceFormValues = z.infer<typeof provinceFormSchema>;
