import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { AerolineaEntity } from './aerolinea.entity';
import { AerolineaService } from './aerolinea.service';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineasList: AerolineaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    aerolineasList = [];
    for(let i = 0; i < 5; i++){
        const aerolinea: AerolineaEntity = await repository.save({
        nombre: faker.lorem.word(2), 
        descripcion: faker.lorem.sentence(), 
        fundacion: faker.lorem.text(), 
        website: faker.internet.domainName()})
        aerolineasList.push(aerolinea);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todas las aerolineas', async () => {
    const aerolineas: AerolineaEntity[] = await service.findAll();
    expect(aerolineas).not.toBeNull();
    expect(aerolineas).toHaveLength(aerolineasList.length);
  });

  it('findOne debe retornar una aerolinea por id', async () => {
    const storedAerolinea: AerolineaEntity = aerolineasList[0];
    const aerolinea: AerolineaEntity = await service.findOne(storedAerolinea.id);
    expect(aerolinea).not.toBeNull();
    expect(aerolinea.nombre).toEqual(storedAerolinea.nombre)
    expect(aerolinea.descripcion).toEqual(storedAerolinea.descripcion)
    expect(aerolinea.fundacion).toEqual(storedAerolinea.fundacion)
    expect(aerolinea.website).toEqual(storedAerolinea.website)
  });

  it('findOne devuelve una execepcion por aerolinea invalida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La aerolínea con el identificador especificado no existe")
  });

  it('create retorna una nueva aerolinea', async () => {
    const aerolinea: AerolineaEntity = {
      id: "",
      nombre: faker.lorem.word(2), 
      descripcion: faker.lorem.sentence(), 
      fundacion: faker.lorem.text(), 
      website: faker.internet.domainName(),
      aeropuertos: []
    }
 
    const newAerolinea: AerolineaEntity = await service.create(aerolinea);
    expect(newAerolinea).not.toBeNull();
 
    const storedAerolinea: AerolineaEntity = await repository.findOne({where: {id: newAerolinea.id}})
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(newAerolinea.nombre)
    expect(storedAerolinea.descripcion).toEqual(newAerolinea.descripcion)
    expect(storedAerolinea.fundacion).toEqual(newAerolinea.fundacion)
    expect(storedAerolinea.website).toEqual(newAerolinea.website)
  });

  it('update modifica una aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    aerolinea.nombre = "Prueba actualizar nombre";
    aerolinea.descripcion = "Prueba actualizar descripcion";
    const updateAerolinea: AerolineaEntity = await service.update(aerolinea.id, aerolinea);
    expect(updateAerolinea).not.toBeNull();
    const storedAerolinea: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(aerolinea.nombre)
    expect(storedAerolinea.descripcion).toEqual(aerolinea.descripcion)
  });

  it('update retorna una excepcion por una aerolinea invalida', async () => {
    let aerolinea: AerolineaEntity = aerolineasList[0];
    aerolinea = {
      ...aerolinea, nombre: "Nuevo nombre", descripcion: "Nueva descripcion"
    }
    await expect(() => service.update("0", aerolinea)).rejects.toHaveProperty("message", "La aerolínea con el identificador especificado no existe")
  });

  it('delete debe eliminar una aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    await service.delete(aerolinea.id);
     const deletedAerolinea: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(deletedAerolinea).toBeNull();
  });

  it('delete retorna una excepcion por una aerolinea invalida', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    await service.delete(aerolinea.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La aerolínea con el identificador especificado no existe")
  });
});
