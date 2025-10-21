import { IsArray, IsOptional, IsString } from "class-validator";

export class CreatePersonDto {

    @IsString({message: 'Name must be a string'})
    @IsOptional()
    name?: string;

    @IsString({message: 'Birth Year must be a string'})
    @IsOptional()
    birthYear?: string;

    @IsString({message: 'Gender must be a string'})
    @IsOptional()
    gender?: string;

    @IsString({message: 'Height must be a string'})
    @IsOptional()
    height?: string;

    @IsString({message: 'Homeworld must be a string'})
    @IsOptional()
    homeworld?: string;
}