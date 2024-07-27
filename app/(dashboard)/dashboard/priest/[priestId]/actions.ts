'use server';
import { priestFormSchema } from '@/lib/priest-validation';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPriest(formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  const { name, parish_id, designation } = priestFormSchema.parse(values);

  await prisma.priest.create({
    data: {
      name: name,
      parish_id: Number(parish_id),
      designation: designation
    }
  });

  revalidatePath('/dashboard/priest');
  redirect('/dashboard/priest');
}

export async function updatePriest(priest_id: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const parish_id = formData.get('parish_id') as string;
    const designation = formData.get('designation') as string;

    await prisma.priest.update({
      where: { id: Number(priest_id) },
      data: {
        name: name,
        parish_id: Number(parish_id),
        designation: designation
      }
    });
    revalidatePath('/dashboard/priest');
  } catch (error) {
    let message = 'Unexpected error';
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }

  redirect('/dashboard/priest');
}

export async function deletePriest(priest_id: number) {
  try {
    await prisma.priest.delete({
      where: { id: priest_id }
    });
    revalidatePath('/dashboard/priest');
  } catch (error) {
    let message = 'Unexpected error';
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
  redirect('/dashboard/priest');
}
