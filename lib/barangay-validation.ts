import { z } from 'zod';
export type Barangay = {
  id: number;
  name: string;
  city: {
    name: string;
    province: {
      name: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
};

export interface BarangayClientProps {
  data: Barangay[];
}

// for string
const requiredString = z.coerce.string().min(1, 'Required');

// for numeric
const numericRequiredString = requiredString.regex(/^\d+$/, 'Must be a number');

export const barangayFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Barangay must be at least 3 characters' }),
  city_id: numericRequiredString
});

export type BarangayFormValues = z.infer<typeof barangayFormSchema>;
