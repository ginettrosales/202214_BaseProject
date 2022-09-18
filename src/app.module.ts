import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirlineModule } from './airline/airline.module';
import { AirportModule } from './airport/airport.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from './airline/airline.entity';
import { AirportEntity } from './airport/airport.entity';
import { AirlineAirportService } from './airline-airport/airline-airport.service';
import { AirlineAirportModule } from './airline-airport/airline-airport.module';

@Module({
  imports: [AirlineModule, AirportModule, AirlineAirportModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [AirlineEntity, AirportEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    AirlineAirportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
