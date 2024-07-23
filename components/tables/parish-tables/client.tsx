'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { User } from '@/constants/data';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';

type Parish = {
  id: number;
  name: string;
};

interface ParishClientProps {
  data: Parish[];
}

export const ParishClient: React.FC<ParishClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Parish (${data.length})`}
          description="Manage parishes"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/parish/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
