import { z } from "zod";
import { FastifyTypedInstance } from "./types";
import { randomUUID } from "crypto";
interface User {
  id: string,
  name: string,
  email: string
}

const users: User[] = []

export async function routes(app: FastifyTypedInstance) {
  app.get('/users', {
    schema: {
      description: 'List Users',
      tag: ['users'],
      response: {
        200: z.array(z.object({
          id: z.string(),
          name: z.string(),
          email: z.string()
        }))
      }
    }
  }, () => {
    return users
  })

  app.post('/users', {
    schema: {
      description: 'Create a new user',
      tag: ['users'],
      body: z.object({
        name: z.string(),
        email: z.string().email(),
      }),
      response: {
        201: z.null().describe('User created')
      }
    }
  }, async (request, reply) => {
    const { name, email } = request.body

    users.push({
      id: randomUUID(),
      name,
      email,
    })
    return reply.status(201).send()
  })
}