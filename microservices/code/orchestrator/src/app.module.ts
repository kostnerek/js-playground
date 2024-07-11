import { Module } from '@nestjs/common';
import { OrchestratorModule } from './orchestrator/orchestrator.module';

@Module({
  imports: [OrchestratorModule],
})
export class AppModule {}
