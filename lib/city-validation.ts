import { z } from 'zod';
export type City = {
  id: number;
  name: string;
  province: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

export interface CityClientProps {
  data: City[];
}

// for string
const requiredString = z.coerce.string().min(1, 'Required');

// for numeric
const numericRequiredString = requiredString.regex(/^\d+$/, 'Must be a number');

export const cityFormSchema = z.object({
  name: z.string().min(3, { message: 'City must be at least 3 characters' }),
  province_id: numericRequiredString
});

export type CityFormValues = z.infer<typeof cityFormSchema>;
