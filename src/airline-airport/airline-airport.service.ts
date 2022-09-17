import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AirlineAirportService {
    constructor(
        @InjectRepository(AirlineEntity)
        private readonly airlineRepository: Repository<AirlineEntity>,
    
        @InjectRepository(AirportEntity)
        private readonly airportRepository: Repository<AirportEntity>
    ) {}

    async addAirportToAirline(airlineId: string, airportId: string): Promise<AirlineEntity> {
        const airport: AirportEntity = await this.airportRepository.findOne({where: {id: airportId}});
        if (!airport)
          throw new BusinessLogicException("El aeropuerto con el identificador especificado no existe", BusinessError.NOT_FOUND);
       
        const airline: AirlineEntity = await this.airlineRepository.findOne({where: {id: airlineId}, relations: ["airports"]}) 
        if (!airline)
          throw new BusinessLogicException("La aerolínea con el identificador especificado no existe", BusinessError.NOT_FOUND);
     
        airline.airports = [...airline.airports, airport];
        return await this.airlineRepository.save(airline);
    }

    async findAirportsFromAirline(airportId: string): Promise<AirportEntity[]> {
        const airline: AirlineEntity = await this.airlineRepository.findOne({where: {id: airportId}, relations: ["airports"]});
        if (!airline)
          throw new BusinessLogicException("La aerolínea con el identificador especificado no existe", BusinessError.NOT_FOUND)
        
        return airline.airports;
    }

    async findAirportFromAirline(airlineId: string, airportId: string): Promise<AirportEntity> {
        const airport: AirportEntity = await this.airportRepository.findOne({where: {id: airportId}});
        if (!airport)
          throw new BusinessLogicException("El aeropuerto con el identificador especificado no existe", BusinessError.NOT_FOUND)
        
        const airline: AirlineEntity = await this.airlineRepository.findOne({where: {id: airlineId}, relations: ["airports"]}); 
        if (!airline)
          throw new BusinessLogicException("La aerolínea con el identificador especificado no existe", BusinessError.NOT_FOUND)
    
        const airlineAirport: AirportEntity = airline.airports.find(e => e.id === airline.id);
    
        if (!airlineAirport)
          throw new BusinessLogicException("El aeropuerto con el identificador especificado no está asociado a la aerolínea", BusinessError.PRECONDITION_FAILED)
    
        return airlineAirport;
    }

    async updateAirportsFromAirline(airlineId: string, airports: AirportEntity[]): Promise<AirlineEntity> {
        const airline: AirlineEntity = await this.airlineRepository.findOne({where: {id: airlineId}, relations: ["airports"]});
    
        if (!airline)
          throw new BusinessLogicException("La aerolínea con el identificador especificado no existe", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < airports.length; i++) {
          const airport: AirportEntity = await this.airportRepository.findOne({where: {id: airports[i].id}});
          if (!airport)
            throw new BusinessLogicException("El aeropuerto con el identificador especificado no existe", BusinessError.NOT_FOUND)
        }
    
        airline.airports = airports;
        return await this.airlineRepository.save(airline);
    }

    async deleteAirportFromAirline(airlineId: string, airportId: string){
        const airport: AirportEntity = await this.airportRepository.findOne({where: {id: airportId}});
        if (!airport)
          throw new BusinessLogicException("El aeropuerto con el identificador especificado no existe", BusinessError.NOT_FOUND)
    
        const airline: AirlineEntity = await this.airlineRepository.findOne({where: {id: airlineId}, relations: ["airports"]});
        if (!airline)
          throw new BusinessLogicException("La aerolínea con el identificador especificado no existe", BusinessError.NOT_FOUND)
    
        const airlineAirport: AirportEntity = airline.airports.find(e => e.id === airport.id);
    
        if (!airlineAirport)
            throw new BusinessLogicException("El aeropuerto con el identificador especificado no está asociado a la aerolínea", BusinessError.PRECONDITION_FAILED)
 
        airline.airports = airline.airports.filter(e => e.id !== airportId);
        await this.airlineRepository.save(airline);
    } 
}
