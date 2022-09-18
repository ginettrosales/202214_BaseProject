import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AirportDto } from './airport.dto';
import { AirportEntity } from './airport.entity';
import { AirportService } from './airport.service';

@Controller('airports')
export class AirportController {
    constructor(private readonly airportService: AirportService) {}

    @Get()
    async findAll() {
        return await this.airportService.findAll();
    }
    
    @Get(':airportId')
    async findOne(@Param('airportId') airportId: string) {
        return await this.airportService.findOne(airportId);
    }
    
    @Post()
    async create(@Body() arilineDto: AirportDto) {
        const airport: AirportEntity = plainToInstance(AirportEntity, arilineDto);
        return await this.airportService.create(airport);
    }
    
    @Put(':airportId')
    async update(@Param('airportId') airportId: string, @Body() arilineDto: AirportDto) {
        const airport: AirportEntity = plainToInstance(AirportEntity, arilineDto);
        return await this.airportService.update(airportId, airport);
    }
    
    @Delete(':airportId')
    @HttpCode(204)
    async delete(@Param('airportId') airportId: string) {
        return await this.airportService.delete(airportId);
    }
}
