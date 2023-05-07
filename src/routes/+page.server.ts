
import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async () => {

//     const response = await getTestMessage()
//     let data = response.data
//     let error = response.error

//   return {
//     props: {
//       data,
//       error,
//     },
//   }

    try {
  
      const response = await prisma.test.findFirst()
      if (response) {
        return { test: response.message }
      } else {
          return { 
              error: { 
                  statusCode: 500,
                  name: 'test message not found',
                  message: 'Failed to fetch data',
              } 
          }
      }
  
    } catch (error) {
      return { 
          error: { 
              statusCode: 500,
              name: 'test message server error',
              message: String(error),
          } 
      }
    } finally {
      await prisma.$disconnect()
    }
}