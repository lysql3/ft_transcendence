// src/problem/problem.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { cp, readdir, readFile, rm } from 'fs/promises';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service.js';

const DATA_DIR = join(process.cwd(), 'data');

@Injectable()
export class ProblemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(sourcePath: string) {
    let meta: any;
    let files: string[];
    try {
      meta = JSON.parse(await readFile(join(sourcePath, 'problem.json'), 'utf-8'));
      await readFile(join(sourcePath, 'description.md'));
      files = await readdir(join(sourcePath, 'tests'));
    } catch (e) {
        throw new BadRequestException(`Invalid Folder : ${(e as Error).message}`);
    }
    if (!meta.title || !meta.difficulty || !meta.slug) {
      throw new BadRequestException('invalid problem.json, should contain title, difficulty and slug');
    }

    const ids = files
      .filter((f) => f.endsWith('.in'))
      .map((f) => f.slice(0, -3))
      .sort((a, b) => Number(a) - Number(b));

    if (ids.length === 0) throw new BadRequestException('tests/ is empty');

    for (const id of ids) {
      if (!files.includes(`${id}.out`)) {
        throw new BadRequestException(`need ${id}.out`);
      }
    }

    const visible: string[] = meta.visibleTests ?? [];
    const existing = await this.prisma.problem.findUnique({ where: { slug: meta.slug } });
    if (existing) {
      throw new BadRequestException(`slud "${meta.slug}" alerady exist`);
    }
    const folder = `problems/${randomUUID()}`;
    await cp(sourcePath, join(DATA_DIR, folder), { recursive: true });

    try {
      return await this.prisma.problem.create({
        data: {
          title: meta.title,
          slug: meta.slug,
          tags: meta.tags ?? [],
          difficulty: meta.difficulty,
          descriptionPath: `${folder}/description.md`,
          testCases: {
            create: ids.map((id) => ({
              inputPath: `${folder}/tests/${id}.in`,
              outputPath: `${folder}/tests/${id}.out`,
              isHidden: !visible.includes(id),
            })),
          },
        },
        include: { testCases: true },
      });

    } catch (e) {
      await rm(join(DATA_DIR, folder), { recursive: true, force: true });
      throw e;
    }
  }
}
