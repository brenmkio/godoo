
import type { PageServerLoad } from './$types';
import type { DBError } from '$lib/types';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async ({ params }) => {

    try {

        const user = await prisma.user.findFirst({
          where: {
            username: params.slug,
          },
        })
    
        if (!user) {
            return { 
                error: { 
                    statusCode: 500,
                    name: 'get user from username',
                    message: `No user named ${params.slug} was found`,
                } 
            }
        } 

        return { user };
  
      } catch (error) {
          return { 
              error: { 
                  statusCode: 500,
                  name: 'get user from username',
                  message: `get user error: ${String(error)}`,
              } 
          }
      } finally {
        await prisma.$disconnect()
      }

}