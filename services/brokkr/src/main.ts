import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

// 🔨 BROKKR: The Master Craftsman
// Named after the legendary dwarf craftsman who forged Mjolnir, Brokkr shapes
// and transforms documents with the skill of a master smith.

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // 🏰 Summoning Brokkr's Forge
  const app = await NestFactory.create(AppModule);
  
  // 🌐 Setting the path for Brokkr's work
  app.setGlobalPrefix('api');
  
  // 🎯 Determining Brokkr's workshop
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  // 📢 Announcing Brokkr's readiness
  logger.log(`Brokkr's forge is now active on port ${port}`);
  logger.log('🔨 Ready to craft and transform your documents');
}

// 🚀 Lighting Brokkr's Forge
bootstrap(); 