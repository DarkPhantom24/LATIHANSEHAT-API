import type { HttpContext } from '@adonisjs/core/http'
import { graphql } from 'graphql'
import { schema } from '../graphql/schema.js'

export default class GraphqlController {
  public async query({ request, response }: HttpContext) {
    try {
      const userId = (request as any).userId
      const { query, variables } = request.body()

      const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: { userId }
      })
      
      return response.json(result)
    } catch (error) {
      return response.status(400).json({ 
        errors: [{ message: error.message }] 
      })
    }
  }
}