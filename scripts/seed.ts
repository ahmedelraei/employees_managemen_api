import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { runSeeders } from '../src/database/seeders';

async function runSeed() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const configService = app.get(ConfigService);

    const dataSource = new DataSource({
      type: 'mysql',
      host: configService.get('database.host'),
      port: configService.get('database.port'),
      username: configService.get('database.username'),
      password: configService.get('database.password'),
      database: configService.get('database.database'),
      entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
      synchronize: false,
    });

    await dataSource.initialize();
    console.log('Database connection established');

    await runSeeders(dataSource);

    await dataSource.destroy();
    console.log('Database connection closed');

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('Error running seed:', error);
    process.exit(1);
  }
}

runSeed();
