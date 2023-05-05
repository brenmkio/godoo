import prisma from '$lib/prisma';
import type { test } from '@prisma/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  let message: test['message'] = ''

  try {
    const response = await prisma.test.findFirst()
    if (response) {
      message = response.message
    } else {
      console.error('Failed to fetch data')
    }
  } finally {
    await prisma.$disconnect()
  }

  return {
    props: {
      message: message,
    },
  }

}