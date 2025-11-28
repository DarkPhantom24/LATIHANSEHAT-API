import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import jwt from 'jsonwebtoken'
import User from '#models/user'
import Env from '#start/env'

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    try {
      const { name, email, password } = request.only(['name', 'email', 'password'])

      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return response.status(400).json({ error: 'Email already exists' })
      }

      const hashedPassword = await hash.make(password)
      const user = await User.create({ name, email, password: hashedPassword })

      const token = jwt.sign({ userId: user._id }, Env.get('JWT_SECRET')!, { expiresIn: '7d' })

      return response.status(201).json({
        message: 'User registered successfully',
        user: { id: user._id, name: user.name, email: user.email },
        token,
      })
    } catch (error) {
      return response.status(500).json({ error: 'Registration failed' })
    }
  }

  public async login({ request, response }: HttpContext) {
    try {
      const data = request.only(['email', 'password'])

      const isUserExist = await User.findOne({ email: data.email })
      if (!isUserExist) {
        return response.status(401).json({ error: 'Password atau Email salah' })
      }

      const isValidPassword = await hash.verify(isUserExist.password || '', data.password)
      if (!isValidPassword) {
        return response.status(401).json({ error: 'Password atau Email salah' })
      }

      const token = jwt.sign(
        { userId: isUserExist._id, email: isUserExist.email },
        Env.get('JWT_SECRET') || '',
        {
          expiresIn: '7d',
        }
      )

      return response.json({
        message: 'Login successful',
        user: { id: isUserExist._id, name: isUserExist.name, email: isUserExist.email },
        token,
      })
    } catch (error) {
      return response.status(500).json({ error: 'Login failed' })
    }
  }

  public async logout({ response }: HttpContext) {
    return response.json({
      message: 'Logout successful',
    })
  }
}
