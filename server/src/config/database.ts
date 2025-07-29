import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lucky-paws';
    
    await mongoose.connect(mongoUri);
    
    logger.info('MongoDB connected successfully');
    
    // 불필요한 인덱스 제거 시도
    try {
      const db = mongoose.connection.db;
      if (db) {
        const collections = await db.listCollections().toArray();
        const usersCollection = collections.find(col => col.name === 'users');
        
        if (usersCollection) {
          const indexes = await db.collection('users').indexes();
          
          // nickname 인덱스 제거
          const nicknameIndex = indexes.find(index => 
            index.key && index.key.nickname === 1
          );
          if (nicknameIndex) {
            await db.collection('users').dropIndex('nickname_1');
            logger.info('Removed nickname index successfully');
          }
          
          // student_id 인덱스 제거
          const studentIdIndex = indexes.find(index => 
            index.key && index.key.student_id === 1
          );
          if (studentIdIndex) {
            await db.collection('users').dropIndex('student_id_1');
            logger.info('Removed student_id index successfully');
          }
        }
      }
    } catch (indexError) {
      logger.warn('Could not remove indexes:', indexError);
    }
    
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
    
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};