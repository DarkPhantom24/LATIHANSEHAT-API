import type { HttpContext } from '@adonisjs/core/http'
import Latihan from '#models/latihan'

export default class LatihanController {
  public async store({ request, response }: HttpContext) {
    console.log('=== CONTROLLER STORE DIPANGGIL ===')
    try {
      const userId = (request as any).userId
      console.log('Controller store: userId dari middleware:', userId)

      const data = request.only(['name', 'type', 'duration', 'date'])
      console.log('Controller store: data request:', data)

      const latihan = await Latihan.create({
        userId,
        name: data.name,
        type: data.type,
        duration: data.duration,
        date: new Date(data.date),
      })

      console.log('Controller store: latihan created:', latihan)
      return response.status(201).json({
        message: 'Latihan berhasil ditambahkan',
        latihan,
      })
    } catch (error) {
      console.log('Controller store error:', error)
      return response.status(500).json({ error: 'Gagal menambahkan latihan' })
    }
  }

  public async index({ request, response }: HttpContext) {
    console.log('=== CONTROLLER INDEX DIPANGGIL ===')
    try {
      const userId = (request as any).userId
      console.log('Controller index: userId dari middleware:', userId)

      const latihan = await Latihan.find({ userId }).sort({ date: 1 })
      console.log('Controller index: latihan found:', latihan)

      return response.json({
        message: 'Data latihan berhasil diambil',
        latihan,
      })
    } catch (error) {
      console.log('Controller index error:', error)
      return response.status(500).json({ error: 'Gagal mengambil data latihan' })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const { id } = params
      const userId = (request as any).userId
      const data = request.only(['name', 'type', 'duration', 'date', 'status'])
      
      const updateData: any = {}
      if (data.name !== undefined) updateData.name = data.name
      if (data.type !== undefined) updateData.type = data.type
      if (data.duration !== undefined) updateData.duration = data.duration
      if (data.date !== undefined) updateData.date = new Date(data.date)
      if (data.status !== undefined) updateData.status = data.status

      const latihan = await Latihan.findOneAndUpdate(
        { _id: id, userId },
        updateData,
        { new: true }
      )

      if (!latihan) {
        return response.status(404).json({ error: 'Latihan tidak ditemukan' })
      }

      return response.json({
        message: 'Latihan berhasil diupdate',
        latihan,
      })
    } catch (error) {
      return response.status(500).json({ error: 'Gagal mengupdate latihan' })
    }
  }

  public async destroy({ params, request, response }: HttpContext) {
    try {
      const { id } = params
      const userId = (request as any).userId

      const latihan = await Latihan.findOneAndDelete({ _id: id, userId })

      if (!latihan) {
        return response.status(404).json({ error: 'Latihan tidak ditemukan' })
      }

      return response.json({
        message: 'Latihan berhasil dihapus',
      })
    } catch (error) {
      return response.status(500).json({ error: 'Gagal menghapus latihan' })
    }
  }
}
