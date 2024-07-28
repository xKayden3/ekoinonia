import { Breadcrumbs } from '@/components/breadcrumbs';
import { ParishForm } from '@/components/forms/parish-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import prisma from '@/lib/prisma';
import React from 'react';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Parish', link: '/dashboard/parish' },
  { title: 'Create', link: '/dashboard/parish/new' }
];

interface ParishProps {
  params: {
    parishId: any;
  };
}

export default async function Page(props: ParishProps) {
  if (props.params.parishId == 'new') {
    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-8">
          <Breadcrumbs items={breadcrumbItems} />
          <ParishForm
            // categories={[
            //   { _id: 'shirts', name: 'shirts' },
            //   { _id: 'pants', name: 'pants' }
            // ]}

            initialData={null}
            key={null}
          />
        </div>
      </ScrollArea>
    );
  } else {
    const parishId = parseInt(props.params.parishId.toString());
    const parish = await prisma.parish.findUnique({
      where: {
        id: parishId
      }
    });
    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-8">
          <Breadcrumbs items={breadcrumbItems} />
          <ParishForm
            // categories={[
            //   { _id: 'shirts', name: 'shirts' },
            //   { _id: 'pants', name: 'pants' }
            // ]}

            initialData={parish}
            key={null}
          />
        </div>
      </ScrollArea>
    );
  }
}
