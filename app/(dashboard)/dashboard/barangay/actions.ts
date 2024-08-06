'use server';
import { barangayFormSchema } from '@/lib/barangay-validation';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createBarangay(formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  const { name, city_id } = barangayFormSchema.parse(values);

  await prisma.barangay.create({
    data: {
      name: name,
      city_id: Number(city_id)
    }
  });

  revalidatePath('/dashboard/barangay');
  redirect('/dashboard/barangay');
}

export async function updateBarangay(barangay_id: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const city_id = formData.get('city_id') as string;

    await prisma.barangay.update({
      where: { id: Number(barangay_id) },
      data: {
        name: name,
        city_id: Number(city_id)
      }
    });
    revalidatePath('/dashboard/barangay');
  } catch (error) {
    let message = 'Unexpected error';
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }

  redirect('/dashboard/barangay');
}

export async function deleteBarangay(barangay_id: number) {
  try {
    await prisma.priest.delete({
      where: { id: barangay_id }
    });
    revalidatePath('/dashboard/barangay');
  } catch (error) {
    let message = 'Unexpected error';
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
  redirect('/dashboard/barangay');
}
