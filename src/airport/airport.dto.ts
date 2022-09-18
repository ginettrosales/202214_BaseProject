import {IsDate, IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class AirportDto {
@IsString()
 @IsNotEmpty()
 readonly name: string;
 
 @IsString()
 @IsNotEmpty()
 readonly code: string;
 
 @IsDate()
 @IsNotEmpty()
 readonly country: Date;
 
 @IsString()
 @IsNotEmpty()
 readonly city: string;
}
