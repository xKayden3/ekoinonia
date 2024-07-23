import { Breadcrumbs } from '@/components/breadcrumbs';
import { columns } from '@/components/tables/parish-tables/columns';
import { PriestClient } from '@/components/tables/priest-tables/client';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Priest } from '@/lib/priest-validation';
import prisma from '@/lib/prisma';
import { cn } from '@/lib/utils';
import { count } from 'console';
import { Plus } from 'lucide-react';
import Link from 'next/link';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Priest', link: '/dashboard/priest' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const name = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  const results = await prisma.priest.findMany({
    select: {
      id: true,
      name: true,
      parish: {
        select: {
          name: true
        }
      },
      designation: true,
      createdAt: true,
      updatedAt: true
    },
    skip: offset,
    take: pageLimit
    // where: {
    //   name: {
    //     search: `${name}`
    //   }
    // }
  });
  //console.log(results);
  // const res = await fetch(
  //   `https://api.slingacademy.com/v1/sample-data/users?offset=${offset}&limit=${pageLimit}` +
  //     (country ? `&search=${country}` : '')
  // );
  // const employeeRes = await res.json();
  const totalUsers = results.length; //1000
  const pageCount = Math.ceil(totalUsers / pageLimit);
  const priest: Priest[] = results;
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

        <PriestClient data={priest} />
      </div>
    </>
  );
}
