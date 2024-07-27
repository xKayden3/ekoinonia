import { Breadcrumbs } from '@/components/breadcrumbs';
import { ProvinceClient } from '@/components/tables/province-tables/client';
import prisma from '@/lib/prisma';
import { Province } from '@/lib/province-validation';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Province', link: '/dashboard/province' }
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

  const results = await prisma.province.findMany({
    select: {
      id: true,
      name: true,
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
  const province: Province[] = results;
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

        <ProvinceClient data={province} />
      </div>
    </>
  );
}
