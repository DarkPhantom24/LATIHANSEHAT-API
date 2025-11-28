import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  public async index({ response }: HttpContext) {
    try {
      const users = await User.find({}, { password: 0 })

      return response.json({
        message: 'Data users berhasil diambil',
        users,
      })
    } catch (error) {
      return response.status(500).json({ error: 'Gagal mengambil data users' })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const { id } = params
      
      const user = await User.findByIdAndDelete(id)
      
      if (!user) {
        return response.status(404).json({ error: 'User tidak ditemukan' })
      }
      
      return response.json({
        message: 'User berhasil dihapus'
      })
    } catch (error) {
      return response.status(500).json({ error: 'Gagal menghapus user' })
    }
  }
}
