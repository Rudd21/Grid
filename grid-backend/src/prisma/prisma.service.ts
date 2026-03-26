import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    const pool = new pg.Pool({ 
      connectionString,
      ssl: { rejectUnauthorized: false } // Supabase вимагає SSL
    });

    const adapter = new PrismaPg(pool as any);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}