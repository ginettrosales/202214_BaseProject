import {IsDateString, IsNotEmpty, IsString, IsUrl, MaxDate} from 'class-validator';

export class AirlineDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;
    
    @IsDateString()
    @IsNotEmpty()
    @MaxDate(new Date())
    readonly foundation: Date;
    
    @IsUrl()
    @IsNotEmpty()
    readonly website: string;
}
