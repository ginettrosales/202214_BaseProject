import { AeropuertoEntity } from "../aeropuerto/aeropuerto.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AerolineaEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
 
    @Column()
    nombre: string;
 
    @Column()
    descripcion: string;
 
    @Column()
    fundacion: string;
 
    @Column()
    website: string;

    @ManyToMany(() => AeropuertoEntity, aeropuerto => aeropuerto.aerolineas)
    aeropuertos: AeropuertoEntity[];
}
