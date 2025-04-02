import { Controller, Get } from '@nestjs/common';
import { PrometheusController } from '@willsoto/nestjs-prometheus';

@Controller('v1/metrics')
export class MetricsController extends PrometheusController {} 