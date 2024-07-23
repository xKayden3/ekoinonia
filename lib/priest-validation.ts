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
