const mongoose = require('mongoose')
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Conectado a la base de datos: ${conn.connection.host}`)
  } catch(err) {
    console.log('Error al intentar conectar con la base de datos')
  }
}

module.exports = connectDB;