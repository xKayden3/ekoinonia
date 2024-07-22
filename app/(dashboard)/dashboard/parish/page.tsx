import { Breadcrumbs } from '@/components/breadcrumbs';
import { columns } from '@/components/tables/parish-tables/columns';
import { ParishClient } from '@/components/tables/parish-tables/parish-table';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import prisma from '@/lib/prisma';
import { cn } from '@/lib/utils';
import { count } from 'console';
import { Plus } from 'lucide-react';
import Link from 'next/link';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Parish', link: '/dashboard/parish' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

type Parish = {
  id: number;
  name: string;
};

export default async function page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const name = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  const results = await prisma.parish.findMany({
    skip: offset,
    take: pageLimit
    // where: {
    //   name: {
    //     search: `${name}`
    //   }
    // }
  });

  // const res = await fetch(
  //   `https://api.slingacademy.com/v1/sample-data/users?offset=${offset}&limit=${pageLimit}` +
  //     (country ? `&search=${country}` : '')
  // );
  // const employeeRes = await res.json();
  const totalUsers = results.length; //1000
  const pageCount = Math.ceil(totalUsers / pageLimit);
  const parish: Parish[] = results;
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        {/* <div className="flex items-start justify-between">
          <Heading
            title={`Parish (${totalUsers})`}
            description="Manage parishes (Server side table functionalities.)"
          />

          <Link
            href={'/dashboard/parish/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div> */}
        {/* <Separator /> */}

        <ParishClient data={parish} />
      </div>
    </>
  );
}
