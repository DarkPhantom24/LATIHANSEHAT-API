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

  public async getCalories({ request, response }: HttpContext) {
    console.log('=== GET CALORIES DIPANGGIL ===')
    try {
      const userId = (request as any).userId
      const latihan = await Latihan.find({ userId, status: 'terlaksana' })
      console.log('Latihan terlaksana:', latihan.length)
      
      let totalCalories = 0
      
      // Mapping aktivitas ke nama yang dikenali API
      const activityMap: { [key: string]: string } = {
        'lari': 'running',
        'jogging': 'running', 
        'jalan': 'walking',
        'sepeda': 'cycling',
        'renang': 'swimming',
        'push up': 'push ups',
        'sit up': 'sit ups',
        'squat': 'squats',
        'yoga': 'yoga',
        'gym': 'weight lifting'
      }
      
      for (const workout of latihan) {
        console.log(`Processing: ${workout.name}, duration: ${workout.duration}`)
        
        // Coba dengan nama asli dulu
        let activityName = workout.name.toLowerCase()
        let calories = 0
        
        try {
          let apiUrl = `https://api.api-ninjas.com/v1/caloriesburned?activity=${encodeURIComponent(activityName)}&duration=${workout.duration}`
          
          let apiResponse = await fetch(apiUrl, {
            headers: {
              'X-Api-Key': 'AUGFsLOng2SbDKpxBls/Pg==ksceTCUCmU6UYWEC'
            }
          })
          
          if (apiResponse.ok) {
            let caloriesData = await apiResponse.json() as any[]
            console.log('API response for', activityName, ':', caloriesData)
            
            if (caloriesData.length > 0) {
              calories = caloriesData[0].total_calories
            } else {
              // Coba dengan mapping jika tidak ada hasil
              const mappedActivity = activityMap[activityName]
              if (mappedActivity) {
                console.log('Trying mapped activity:', mappedActivity)
                apiUrl = `https://api.api-ninjas.com/v1/caloriesburned?activity=${encodeURIComponent(mappedActivity)}&duration=${workout.duration}`
                
                apiResponse = await fetch(apiUrl, {
                  headers: {
                    'X-Api-Key': 'AUGFsLOng2SbDKpxBls/Pg==ksceTCUCmU6UYWEC'
                  }
                })
                
                if (apiResponse.ok) {
                  caloriesData = await apiResponse.json() as any[]
                  console.log('Mapped API response:', caloriesData)
                  if (caloriesData.length > 0) {
                    calories = caloriesData[0].total_calories
                  }
                }
              }
              
              // Fallback: estimasi kalori berdasarkan durasi
              if (calories === 0) {
                calories = Math.round(workout.duration * 5) // 5 kalori per menit sebagai estimasi
                console.log('Using fallback calories:', calories)
              }
            }
          }
        } catch (error) {
          console.log('Error fetching calories:', error)
          // Fallback jika error
          calories = Math.round(workout.duration * 5)
        }
        
        totalCalories += calories
        console.log(`Added ${calories} calories, total now: ${totalCalories}`)
      }
      
      console.log('Final total calories:', totalCalories)
      return response.json({
        totalCalories
      })
    } catch (error) {
      console.log('Controller getCalories error:', error)
      return response.status(500).json({ error: 'Gagal menghitung kalori' })
    }
  }
}
