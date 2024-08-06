'use server';
import { cityFormSchema } from '@/lib/city-validation';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCity(formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  const { name, province_id } = cityFormSchema.parse(values);

  await prisma.city.create({
    data: {
      name: name,
      province_id: Number(province_id)
    }
  });
  revalidatePath('/dashboard/city');
  redirect('/dashboard/city');
}

export async function updateCity(city_id: string, formData: FormData) {
  try {
    //const parishId = parseInt(formData.get('id') as string);

    const name = formData.get('name') as string;
    const province_id = formData.get('province_id') as string;

    await prisma.city.update({
      where: { id: Number(city_id) },
      data: { name: name, province_id: Number(province_id) }
    });
    revalidatePath('/dashboard/city');
  } catch (error) {
    let message = 'Unexpected error';
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }

  redirect('/dashboard/city');
}

export async function deleteCity(city_id: number) {
  try {
    await prisma.city.delete({
      where: { id: city_id }
    });
    revalidatePath('/dashboard/city');
  } catch (error) {
    let message = 'Unexpected error';
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
  redirect('/dashboard/city');
}
