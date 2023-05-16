
import prisma from '$lib/prisma'
import type { Event, Group, Prisma, Profile, User } from '@prisma/client';
import type { DBReturn, DBError } from './types';



async function queryDB<T>({ queryFunc, name, err_msg, value }: { 
    queryFunc: (value: string) => Promise<T | null>, 
    name: string, 
    err_msg: string,
    value: string

}): Promise<DBReturn<T>> {
    try {
        const result = await queryFunc(value)
        if (!result) {
            return {
                db_data: null,
                db_error: {
                    statusCode: 500,
                    name: name,
                    message: err_msg,
                }
            }
        }
        return { db_data: result, db_error: null }
    } catch (error) {
        return {
            db_data: null,
            db_error: {
                statusCode: 500,
                name: name,
                message: `${name} error: ${error}`
            }
        }
    } finally {
        await prisma.$disconnect()
    }
}





// GET


export async function DB_getUserByUsername(username: string): Promise<DBReturn<User>> {
    return queryDB({
        queryFunc: (username) => prisma.user.findFirst({
            where: { username }
        }),
        name: 'user from username',
        err_msg: `No user ${username} was found`,
        value: username
    })
}

export async function DB_getUserByEmail(email: string): Promise<DBReturn<User>> {
    return queryDB({
        queryFunc: (email) => prisma.user.findFirst({
            where: { email }
        }),
        name: 'user from email',
        err_msg: `No user ${email} was found`,
        value: email
    })
}

export async function DB_getProfileByHandle(handle: string): Promise<DBReturn<Profile>> {
    return queryDB({
        queryFunc: (handle) => prisma.profile.findFirst({
            where: { handle }
        }),
        name: 'profile from handle',
        err_msg: `No profile ${handle} was found`,
        value: handle
    })
}

export async function DB_getProfileByID(profileId: number): Promise<DBReturn<Profile>> {
    return queryDB({
        queryFunc: (id) => prisma.profile.findFirst({
            where: { id: profileId }
        }),
        name: 'profile from id',
        err_msg: `No profile ${profileId} was found`,
        value: profileId.toString()
    })
}
  

export async function DB_getProfilesByUserId(
    userId: number
  ): Promise<DBReturn<Profile[]>> {
    try {
      const profiles = await prisma.profile.findMany({
        where: { parent_id: userId }
      })
  
      return { db_data: profiles, db_error: null }
    } catch (error) {
      return {
        db_data: null,
        db_error: {
          statusCode: 500,
          name: `get profiles error`,
          message: `There was a problem getting profiles: ${String(error)}`,
        },
      }
    }
}   
  

export async function DB_getAllProfiles(): Promise<DBReturn<Profile[]>> {
    try {
      const profiles = await prisma.profile.findMany({
        // where: { parent_id: userId }
      })
  
      return { db_data: profiles, db_error: null }
    } catch (error) {
      return {
        db_data: null,
        db_error: {
          statusCode: 500,
          name: `get profiles error`,
          message: `There was a problem getting all profiles: ${String(error)}`,
        },
      }
    }
}   

export async function DB_getAllProfilesForUserId(userId: number): Promise<DBReturn<Profile[]>> {
    try {
      const profiles = await prisma.profile.findMany({
        where: { parent_id: userId }
      })
  
      return { db_data: profiles, db_error: null }
    } catch (error) {
      return {
        db_data: null,
        db_error: {
          statusCode: 500,
          name: `get profiles error`,
          message: `There was a problem getting all user's profiles: ${String(error)}`,
        },
      }
    }
}   

export async function DB_getEventBySlug(slug: string): Promise<DBReturn<Event>> {
    return queryDB({
        queryFunc: (id) => prisma.event.findFirst({
            where: { slug: slug }
        }),
        name: 'event from slug',
        err_msg: `No event ${slug} was found`,
        value: slug
    })
}
 
export async function DB_getGroupBySlug(slug: string): Promise<DBReturn<Group>> {
  return queryDB({
      queryFunc: (id) => prisma.group.findFirst({
          where: { slug: slug }
      }),
      name: 'group from slug',
      err_msg: `No group ${slug} was found`,
      value: slug
  })
}  

export async function DB_getEventById(eventId: number): Promise<DBReturn<Event>> {
    return queryDB({
        queryFunc: (id) => prisma.event.findFirst({
            where: { id: eventId }
        }),
        name: 'event from eventId',
        err_msg: `No event ${eventId} was found`,
        value: eventId.toString()
    })
}
 
export async function DB_getGroupById(groupId: number): Promise<DBReturn<Group>> {
  return queryDB({
      queryFunc: (id) => prisma.group.findFirst({
          where: { id: groupId }
      }),
      name: 'group from groupId',
      err_msg: `No group ${groupId} was found`,
      value: groupId.toString()
  })
}

export async function DB_getAllEvents(): Promise<DBReturn<Event[]>> {
  try {
    const events = await prisma.event.findMany({
      // where: { parent_id: userId }
    })

    return { db_data: events, db_error: null }
  } catch (error) {
    return {
      db_data: null,
      db_error: {
        statusCode: 500,
        name: `get events error`,
        message: `There was a problem getting all events: ${String(error)}`,
      },
    }
  }
}   

export async function DB_getAllGroups(): Promise<DBReturn<Group[]>> {
  try {
    const groups = await prisma.group.findMany({
      // where: { parent_id: userId }
    })

    return { db_data: groups, db_error: null }
  } catch (error) {
    return {
      db_data: null,
      db_error: {
        statusCode: 500,
        name: `get groups error`,
        message: `There was a problem getting all groups: ${String(error)}`,
      },
    }
  }
}   










// ADD


export async function DB_addUser(data: Prisma.UserCreateInput): Promise<DBReturn<User>> {
    try {
      const newUser = await prisma.user.create({ data });
  
      return { db_data: newUser, db_error: null };
    } catch (error) {
      return { 
        db_data: null,
        db_error: { 
          statusCode: 500,
          name: `add user error`,
          message: `add user error: ${String(error)}`,
        } 
      }
    }
}

export async function DB_updateUser(
    id: number,
    data: Prisma.UserUpdateInput
  ): Promise<DBReturn<User>> {
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data,
      })
  
      return { db_data: updatedUser, db_error: null }
    } catch (error) {
      return {
        db_data: null,
        db_error: {
          statusCode: 500,
          name: `update user error`,
          message: `update user error: ${String(error)}`,
        },
      }
    }
  }

  export async function DB_addProfile(data: Prisma.ProfileCreateInput): Promise<DBReturn<Profile>> {
    try {
      const newProfile = await prisma.profile.create({ data });
  
      return { db_data: newProfile, db_error: null };
    } catch (error) {
      return { 
        db_data: null,
        db_error: { 
          statusCode: 500,
          name: `add profile error`,
          message: `add profile error: ${String(error)}`,
        } 
      }
    }
  }

  export async function DB_updateProfile(
      id: number,
      data: Prisma.ProfileUpdateInput
    ): Promise<DBReturn<Profile>> {
      try {
        const updatedProfile = await prisma.profile.update({
          where: { id },
          data,
        })
    
        return { db_data: updatedProfile, db_error: null }
      } catch (error) {
        return {
          db_data: null,
          db_error: {
            statusCode: 500,
            name: `update profile error`,
            message: `update profile error: ${String(error)}`,
          },
        }
      }
    } 



  export async function DB_addEvent(data: Prisma.EventCreateInput): Promise<DBReturn<Event>> {
    try {
      const newEvent = await prisma.event.create({ data });
  
      return { db_data: newEvent, db_error: null };
    } catch (error) {
      return { 
        db_data: null,
        db_error: { 
          statusCode: 500,
          name: `add event error`,
          message: `add event error: ${String(error)}`,
        } 
      }
    }
  }

  export async function DB_updateEvent(
      id: number,
      data: Prisma.EventUpdateInput
    ): Promise<DBReturn<Event>> {
      try {
        const updatedEvent = await prisma.event.update({
          where: { id },
          data,
        })
    
        return { db_data: updatedEvent, db_error: null }
      } catch (error) {
        return {
          db_data: null,
          db_error: {
            statusCode: 500,
            name: `update event error`,
            message: `update event error: ${String(error)}`,
          },
        }
      }
    } 



  export async function DB_addGroup(data: Prisma.GroupCreateInput): Promise<DBReturn<Group>> {
    try {
      const newGroup = await prisma.group.create({ data });
  
      return { db_data: newGroup, db_error: null };
    } catch (error) {
      return { 
        db_data: null,
        db_error: { 
          statusCode: 500,
          name: `add group error`,
          message: `add group error: ${String(error)}`,
        } 
      }
    }
  }

  export async function DB_updateGroup(
      id: number,
      data: Prisma.GroupUpdateInput
    ): Promise<DBReturn<Group>> {
      try {
        const updatedGroup = await prisma.group.update({
          where: { id },
          data,
        })
    
        return { db_data: updatedGroup, db_error: null }
      } catch (error) {
        return {
          db_data: null,
          db_error: {
            statusCode: 500,
            name: `update group error`,
            message: `update group error: ${String(error)}`,
          },
        }
      }
    } 










// export async function DB_getUserByUsername(username: string): Promise<DBReturn<User>> {
//     try {
//         const user = await prisma.user.findFirst({
//             where: {
//                 username: username,
//             },
//         })

//         if (!user) {
//             return { 
//                 db_data: null,
//                 db_error: { 
//                     statusCode: 500,
//                     name: 'get user from username',
//                     message: `No user ${username} was found`,
//                 } 
//             }
//         } 

//         return { db_data: user, db_error: null };
//     } catch (error) {
//         return { 
//             db_data: null,
//             db_error: { 
//                 statusCode: 500,
//                 name: 'get user from username',
//                 message: `get user from username error: ${String(error)}`,
//             } 
//         }
//     } finally {
//         await prisma.$disconnect()
//     }
// }

// export async function DB_getUserByEmail(email: string): Promise<DBReturn<User>> {
//     try {
//         const user = await prisma.user.findFirst({
//             where: {
//                 email: email,
//             },
//         })

//         if (!user) {
//             return { 
//                 db_data: null,
//                 db_error: { 
//                     statusCode: 500,
//                     name: 'get user from email',
//                     message: `No user ${email} was found`,
//                 } 
//             }
//         } 

//         return { db_data: user, db_error: null }
//     } catch (error) {
//         return { 
//             db_data: null,
//             db_error: { 
//                 statusCode: 500,
//                 name: 'get user from email',
//                 message: `get user from email error: ${String(error)}`,
//             } 
//         }
//     } finally {
//         await prisma.$disconnect()
//     }
// }

// export async function DB_getProfileByHandle(handle: string) {
//     try {
//         const profile = await prisma.profile.findFirst({
//             where: {
//                 handle: handle,
//             },
//         })

//         if (!profile) {
//             return { 
//                 error: { 
//                     statusCode: 500,
//                     name: 'get profile from handle',
//                     message: `No profile ${handle} was found`,
//                 } 
//             }
//         } 

//         return { profile };
//     } catch (error) {
//         return { 
//             error: { 
//                 statusCode: 500,
//                 name: 'get profile from handle',
//                 message: `get profile from handle error: ${String(error)}`,
//             } 
//         }
//     } finally {
//         await prisma.$disconnect()
//     }
// }

// export async function DB_getProfileByID(id: number): Promise<DBReturn<Profile>> {
//     const ret: DBReturn<Profile> = {
//         db_data: null,
//         db_error: null
//     }
//     try {
//         const profile = await prisma.profile.findFirst({
//             where: {
//                 id: id,
//             },
//         })

//         if (!profile) {
//             ret.db_error = { 
//                 statusCode: 500,
//                 name: 'get profile from id',
//                 message: `No profile ${id} was found`,
//             } 
//             return ret
//         } 
//         ret.db_data = profile
//         return ret
//     } catch (error) {
//         ret.db_error = { 
//             statusCode: 500,
//             name: 'get profile from id',
//             message: `get profile from id error: ${String(error)}`,
//         } 
//         return ret
//     } finally {
//         await prisma.$disconnect()
//     }
// }


export async function DB_checkHandle(testHandle: string) {
    try {
        const handle = await prisma.profile.findFirst({
            where: {
                handle: testHandle,
            },
        })

        if (!handle) {
            return { exists: false }
        } 

        return { exists: true }
    } catch (error) {
        return { 
            error: { 
                statusCode: 500,
                name: 'checking handle',
                message: `checking handle error: ${String(error)}`,
            } 
        }
    } finally {
        await prisma.$disconnect()
    }
}

export async function DB_checkUsername(testUsername: string) {
  try {
      const username = await prisma.user.findFirst({
          where: {
              username: testUsername,
          },
      })

      if (!username) {
          return { exists: false }
      } 

      return { exists: true }
  } catch (error) {
      return { 
          error: { 
              statusCode: 500,
              name: 'checking username',
              message: `checking username error: ${String(error)}`,
          } 
      }
  } finally {
      await prisma.$disconnect()
  }
}

export async function DB_checkEventSlug(testSlug: string) {
  try {
      const slug = await prisma.event.findFirst({
          where: {
              slug: testSlug,
          },
      })

      if (!slug) {
          return { exists: false }
      } 

      return { exists: true }
  } catch (error) {
      return { 
          error: { 
              statusCode: 500,
              name: 'checking slug',
              message: `checking slug error: ${String(error)}`,
          } 
      }
  } finally {
      await prisma.$disconnect()
  }
}

export async function DB_checkGroupSlug(testSlug: string) {
  try {
      const slug = await prisma.group.findFirst({
          where: {
              slug: testSlug,
          },
      })

      if (!slug) {
          return { exists: false }
      } 

      return { exists: true }
  } catch (error) {
      return { 
          error: { 
              statusCode: 500,
              name: 'checking slug',
              message: `checking slug error: ${String(error)}`,
          } 
      }
  } finally {
      await prisma.$disconnect()
  }
}