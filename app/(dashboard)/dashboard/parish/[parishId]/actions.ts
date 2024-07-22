'use server';
import { createParishSchema } from '@/lib/parish-validation';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createParish(formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  const { id, name } = createParishSchema.parse(values);

  await prisma.parish.create({
    data: {
      name: name
    }
  });
  // redirect('/dashboard/parish');
}

export async function updateParish(formData: FormData) {
  try {
    const parishId = parseInt(formData.get('id') as string);
    const name = formData.get('name') as string;

    await prisma.parish.update({
      where: { id: parishId },
      data: { name: name }
    });
  } catch (error) {
    let message = 'Unexpected error';
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
}
