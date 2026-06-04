import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [HttpModule.register({ timeout: 5000 })],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
