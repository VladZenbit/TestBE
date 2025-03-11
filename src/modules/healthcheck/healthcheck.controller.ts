import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '../auth/decorators/public.decorators';

@Public()
@ApiTags('HealthCheck')
@Controller('health')
export class HealthcheckController {
  @Get('')
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({
    status: 200,
  })
  async getHealth(): Promise<string> {
    return 'OK';
  }
}
