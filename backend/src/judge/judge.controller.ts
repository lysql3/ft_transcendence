import { Body, Controller, Get, Post } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { JudgeService } from './judge.service.js';
import { TestExecuteDto } from './dto/test-execute.dto.js';

// temporary controller to check the connection remove it once submissions use JudgeService.
@Controller('judge')
export class JudgeController {
	constructor(private readonly judge: JudgeService) {}

	@AllowAnonymous() // test only
	@Get('languages')
	languages() {
		return this.judge.languages();
	}

	@AllowAnonymous() // test only
	@Post('test')
	test(@Body() dto: TestExecuteDto) {
		return this.judge.execute({
			sourceCode: dto.sourceCode,
			languageId: dto.languageId,
			stdin: dto.stdin,
		});
	}
}
