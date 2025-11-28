import mongoose from 'mongoose'
import Env from '#start/env'

const MONGO_URI = Env.get('MONGO_URI')!

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not found')
  process.exit(1)
}

console.log('🔄 Connecting to MongoDB...')
console.log('📍 URI:', MONGO_URI.replace(/\/\/.*@/, '//***:***@'))

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully')
    console.log('📍 Database:', mongoose.connection.name || 'default')
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:')
    console.error('Message:', err.message)
    console.error('Code:', err.code)
    
    if (err.message.includes('ETIMEOUT') || err.message.includes('queryTxt')) {
      console.log('\n🔧 DNS/Network issue detected. Try:')
      console.log('1. Change DNS to 8.8.8.8 or 1.1.1.1')
      console.log('2. Use mobile hotspot')
      console.log('3. Check firewall/antivirus')
    }
  })