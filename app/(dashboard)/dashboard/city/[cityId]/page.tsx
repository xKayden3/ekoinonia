import { Breadcrumbs } from '@/components/breadcrumbs';
import { CityForm } from '@/components/forms/city-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import prisma from '@/lib/prisma';
import React from 'react';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'City', link: '/dashboard/city' },
  { title: 'Create', link: '/dashboard/city/new' }
];

interface CityProps {
  params: {
    cityId: any;
  };
}

interface Province {
  id: number;
  name: string;
}

export default async function Page(props: CityProps) {
  const results = await prisma.province.findMany({
    select: {
      id: true,
      name: true
    }
  });

  const province: Province[] = results;

  if (props.params.cityId == 'new') {
    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-8">
          <Breadcrumbs items={breadcrumbItems} />
          <CityForm provinces={province} initialData={null} key={null} />
        </div>
      </ScrollArea>
    );
  } else {
    const city_id = parseInt(props.params.cityId);
    const city = await prisma.city.findUnique({
      where: {
        id: city_id
      }
    });
    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-8">
          <Breadcrumbs items={breadcrumbItems} />
          <CityForm provinces={province} initialData={city} key={null} />
        </div>
      </ScrollArea>
    );
  }
}
