import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { LanguageService } from './language.service.js';
import { CreateLanguageDto } from './dto/create-language.dto.js';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @AllowAnonymous()
  @Get()
  findAll() {
    return this.languageService.findAll();
  }

  @AllowAnonymous() // test only admin later
  @Post()
  create(@Body() dto: CreateLanguageDto) {
    return this.languageService.create(dto);
  }

  @AllowAnonymous() // test only admin later
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.languageService.remove(id);
  }
}
