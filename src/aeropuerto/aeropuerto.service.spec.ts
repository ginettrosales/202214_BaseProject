import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { AeropuertoEntity } from './aeropuerto.entity';
import { AeropuertoService } from './aeropuerto.service';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertoList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    aeropuertoList = [];
    for(let i = 0; i < 5; i++){
        const aeropuerto: AeropuertoEntity = await repository.save({
        nombre: faker.lorem.word(2), 
        codigo: faker.database.engine(), 
        pais: faker.address.country(), 
        ciudad: faker.address.city()})
        aeropuertoList.push(aeropuerto);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todos los aeropuertos', async () => {
    const aeropuertos: AeropuertoEntity[] = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(aeropuertoList.length);
  });

  it('findOne debe retornar una aeropuerto por id', async () => {
    const storedAeropuerto: AeropuertoEntity = aeropuertoList[0];
    const aeropuerto: AeropuertoEntity = await service.findOne(storedAeropuerto.id);
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto.nombre).toEqual(storedAeropuerto.nombre)
    expect(aeropuerto.codigo).toEqual(storedAeropuerto.codigo)
    expect(aeropuerto.pais).toEqual(storedAeropuerto.pais)
    expect(aeropuerto.ciudad).toEqual(storedAeropuerto.ciudad)
  });

  it('findOne devuelve una execepcion por aeropuerto invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El aeropuerto con el identificador especificado no existe")
  });

  it('create retorna un nuevo aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: "",
      nombre: faker.lorem.word(2), 
      codigo: faker.database.engine(), 
      pais: faker.address.country(), 
      ciudad: faker.address.city(),
      aerolineas: []
    }

    const newAeropuerto: AeropuertoEntity = await service.create(aeropuerto);
    expect(newAeropuerto).not.toBeNull();

    const storedAeropuerto: AeropuertoEntity = await repository.findOne({where: {id: newAeropuerto.id}})
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(newAeropuerto.nombre)
    expect(storedAeropuerto.codigo).toEqual(newAeropuerto.codigo)
    expect(storedAeropuerto.pais).toEqual(newAeropuerto.pais)
    expect(storedAeropuerto.ciudad).toEqual(newAeropuerto.ciudad)
  });

  it('update actualiza un aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    aeropuerto.nombre = "Nuevo nombre";
    aeropuerto.pais = "Nuevo pais";
  
    const updatedAeropuerto: AeropuertoEntity = await service.update(aeropuerto.id, aeropuerto);
    expect(updatedAeropuerto).not.toBeNull();
  
    const storedAeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(aeropuerto.nombre)
    expect(storedAeropuerto.pais).toEqual(aeropuerto.pais)
  });
 
  it('update devuelve una execepcion por aeropuerto invalido', async () => {
    let aeropuerto: AeropuertoEntity = aeropuertoList[0];
    aeropuerto = {
      ...aeropuerto, nombre: "Nuevo nombre", pais: "Nuevo pais"
    }
    await expect(() => service.update("0", aeropuerto)).rejects.toHaveProperty("message", "El aeropuerto con el identificador especificado no existe")
  });

  it('delete elimina un aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await service.delete(aeropuerto.id);
  
    const deletedAeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
    expect(deletedAeropuerto).toBeNull();
  });

  it('delete devuelve una execepcion por aeropuerto invalido', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await service.delete(aeropuerto.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El aeropuerto con el identificador especificado no existe")
  });
});
