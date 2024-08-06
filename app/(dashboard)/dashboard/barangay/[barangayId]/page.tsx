import { Breadcrumbs } from '@/components/breadcrumbs';
import { BarangayForm } from '@/components/forms/barangay-form';
import { ParishForm } from '@/components/forms/parish-form';
import { PriestForm } from '@/components/forms/priest-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import prisma from '@/lib/prisma';
import React from 'react';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Barangay', link: '/dashboard/barangay' },
  { title: 'Create', link: '/dashboard/barangay/new' }
];

interface BarangayProps {
  params: {
    barangayId: any;
  };
}

interface Cities {
  id: number;
  name: string;
}

export default async function Page(props: BarangayProps) {
  const results = await prisma.city.findMany({
    select: {
      id: true,
      name: true
    }
  });

  const cities: Cities[] = results;

  if (props.params.barangayId == 'new') {
    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-8">
          <Breadcrumbs items={breadcrumbItems} />
          <BarangayForm cities={cities} initialData={null} key={null} />
        </div>
      </ScrollArea>
    );
  } else {
    const barangayId = parseInt(props.params.barangayId.toString());
    const barangay = await prisma.barangay.findUnique({
      where: {
        id: barangayId
      }
    });
    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-8">
          <Breadcrumbs items={breadcrumbItems} />
          <BarangayForm cities={cities} initialData={barangay} key={null} />
        </div>
      </ScrollArea>
    );
  }
}
