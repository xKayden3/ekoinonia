import { Breadcrumbs } from '@/components/breadcrumbs';
import { ParishForm } from '@/components/forms/parish-form';
import { PriestForm } from '@/components/forms/priest-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import prisma from '@/lib/prisma';
import React from 'react';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Priest', link: '/dashboard/priest' },
  { title: 'Create', link: '/dashboard/parish/priest' }
];

interface PriestProps {
  params: {
    priestId: any;
  };
}

interface Parishes {
  id: number;
  name: string;
}

export default async function Page(props: PriestProps) {
  const results = await prisma.parish.findMany({
    select: {
      id: true,
      name: true
    }
  });

  const parishes: Parishes[] = results;

  if (props.params.priestId == 'new') {
    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-8">
          <Breadcrumbs items={breadcrumbItems} />
          <PriestForm parishes={parishes} initialData={null} key={null} />
        </div>
      </ScrollArea>
    );
  } else {
    const priestId = parseInt(props.params.priestId.toString());
    const priest = await prisma.parish.findUnique({
      where: {
        id: priestId
      }
    });
    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-8">
          <Breadcrumbs items={breadcrumbItems} />
          <PriestForm parishes={parishes} initialData={priest} key={null} />
        </div>
      </ScrollArea>
    );
  }
}
