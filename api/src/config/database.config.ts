import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

export default registerAs('database', (): DataSourceOptions => {
  const dbType = process.env.DATABASE_TYPE || 'sqlite';
  
  // Base configuration for both SQLite and PostgreSQL
  const baseConfig = {
    entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
    synchronize: process.env.NODE_ENV !== 'production', // Auto-sync schema in development only
    migrations: [join(__dirname, '../migrations/**/*{.ts,.js}')],
    migrationsRun: true,
  };

  // SQLite configuration (development)
  if (dbType === 'sqlite') {
    return {
      type: 'sqlite',
      database: process.env.DATABASE_NAME || 'pos_dev.sqlite',
      ...baseConfig,
    } as DataSourceOptions;
  }

  // PostgreSQL configuration (production)
  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'pos_prod',
    ...baseConfig,
  } as DataSourceOptions;
});
