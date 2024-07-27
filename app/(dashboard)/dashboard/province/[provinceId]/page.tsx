import { Breadcrumbs } from '@/components/breadcrumbs';
import { ParishForm } from '@/components/forms/parish-form';
import { PriestForm } from '@/components/forms/priest-form';
import { ProvinceForm } from '@/components/forms/province-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import prisma from '@/lib/prisma';
import React from 'react';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Province', link: '/dashboard/province' },
  { title: 'Create', link: '/dashboard/parish/province' }
];

interface ProvinceProps {
  params: {
    provinceId: any;
  };
}

interface Provinces {
  id: number;
  name: string;
}

export default async function Page(props: ProvinceProps) {
  if (props.params.provinceId == 'new') {
    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-8">
          <Breadcrumbs items={breadcrumbItems} />
          <ProvinceForm initialData={null} key={null} />
        </div>
      </ScrollArea>
    );
  } else {
    const provinceId = parseInt(props.params.provinceId.toString());
    const province = await prisma.province.findUnique({
      where: {
        id: provinceId
      }
    });
    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-8">
          <Breadcrumbs items={breadcrumbItems} />
          <ProvinceForm initialData={province} key={null} />
        </div>
      </ScrollArea>
    );
  }
}
