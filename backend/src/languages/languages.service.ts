import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class LanguagesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.language.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
