import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { SwapiModule } from './swapi/swapi.module';

@Module({
  imports: [ApiModule, SwapiModule],
  controllers: [],
  providers: [],
})

export class AppModule {}
