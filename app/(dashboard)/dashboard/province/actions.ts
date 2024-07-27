'use server';
import prisma from '@/lib/prisma';
import { provinceFormSchema } from '@/lib/province-validation';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProvince(formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  const { name } = provinceFormSchema.parse(values);

  await prisma.province.create({
    data: {
      name: name
    }
  });
  revalidatePath('/dashboard/province');
  redirect('/dashboard/province');
}

export async function updateProvince(province_id: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;

    await prisma.province.update({
      where: { id: Number(province_id) },
      data: {
        name: name
      }
    });
    revalidatePath('/dashboard/province');
  } catch (error) {
    let message = 'Unexpected error';
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }

  redirect('/dashboard/province');
}

export async function deleteProvince(priest_id: number) {
  try {
    await prisma.province.delete({
      where: { id: priest_id }
    });
    revalidatePath('/dashboard/province');
  } catch (error) {
    let message = 'Unexpected error';
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }

  redirect('/dashboard/province');
}
