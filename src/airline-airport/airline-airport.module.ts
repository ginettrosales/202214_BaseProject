import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { AirlineAirportService } from './airline-airport.service';

@Module({
    providers: [AirlineAirportService],
    imports: [TypeOrmModule.forFeature([AirlineEntity, AirportEntity])],
})
export class AirlineAirportModule {}
