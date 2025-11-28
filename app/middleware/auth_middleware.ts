import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import jwt from 'jsonwebtoken'
import Env from '#start/env'

export default class AuthMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    const header = request.header('authorization')
    const token = header?.split(' ')[1]

    if (!token) {
      return response.status(401).json({ error: 'Token tidak ditemukan' })
    }

    try {
      const decoded = jwt.verify(token, Env.get('JWT_SECRET')!) as { userId: string }

      if (!decoded.userId) {
        return response.status(401).json({ error: 'Token tidak mengandung userId' })
      }

      ;(request as any).userId = decoded.userId
      await next()
    } catch (error) {
      return response.status(401).json({ error: 'Token tidak valid' })
    }
  }
}
