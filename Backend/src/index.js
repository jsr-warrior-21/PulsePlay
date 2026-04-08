import "dotenv/config";
import connectDB from './db/db.js';  
import  app  from './app.js';

async function startServer() {
  try {
    await connectDB();
    const PORT = process.env.PORT || 8000;
    app.listen(PORT,"0.0.0.0", () => {
    console.log(`⚙️Server started on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed!!', error);
    process.exit(1);  
  }
}
startServer();