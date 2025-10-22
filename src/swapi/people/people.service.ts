import { Injectable, NotFoundException } from '@nestjs/common';
import { SwapiListResponse, SwapiPerson, SwapiPersonResponse } from './interfaces/swapi-person.interface';
import { ApiService } from 'src/api/api.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { off } from 'process';

function generateID(){
    const id = Math.floor(Math.random() * (900 - 400 + 1) + 400).toString();
    return id;
}

@Injectable()
export class PeopleService {
    
    private readonly basePath = '/people';

    // Arreglo local con objetos precargados para probar los metodos CRUD simulados
    private local: SwapiPerson[] = [
        { id: "401", name: 'Kara Velorin', birth_year: '42 BBY', gender: 'female', height: '168', homeworld: 'Nal Hutta', },
        { id: "402", name: 'Darin Solas', birth_year: '19 ABY', gender: 'male', height: '183', homeworld: 'Corulag', },
        { id: "403", name: 'Ryn Talvos', birth_year: '55 BBY', gender: 'male', height: '190', homeworld: 'Ord Mantell', },
        { id: "404", name: 'Mira Kaen', birth_year: '12 ABY', gender: 'female', height: '160', homeworld: 'Corellia', },
        { id: "405", name: 'Tovan Krell', birth_year: '7 BBY', gender: 'non-binary', height: '175', homeworld: 'Dantooine', },
        { id: '406', name: 'Lira Thane', birth_year: '23 BBY', gender: 'female', height: '165', homeworld: 'Rodia' },
        { id: '407', name: 'Galen Voss', birth_year: '10 ABY', gender: 'male', height: '178', homeworld: 'Corellia' },
        { id: '408', name: 'Soren Vale', birth_year: '45 BBY', gender: 'male', height: '182', homeworld: 'Mandalore' },
        { id: '409', name: 'Tess Korrin', birth_year: '5 ABY', gender: 'female', height: '155', homeworld: 'Chandrila' },
        { id: '410', name: 'Rho Jarek', birth_year: '60 BBY', gender: 'male', height: '188', homeworld: 'Duro' },
        { id: '411', name: 'Niva Lorenn', birth_year: '15 ABY', gender: 'female', height: '170', homeworld: 'Coruscant' },
        { id: '412', name: 'Dax Rendar', birth_year: '39 BBY', gender: 'male', height: '179', homeworld: 'Kuat' },
        { id: '413', name: 'Velra Sun', birth_year: '25 ABY', gender: 'female', height: '162', homeworld: 'Bespin' },
        { id: '414', name: 'Orin Kael', birth_year: '48 BBY', gender: 'male', height: '176', homeworld: 'Ord Mantell' },
        { id: '415', name: 'Seren Talon', birth_year: '9 ABY', gender: 'female', height: '158', homeworld: 'Ryloth' },

    ];

    constructor(private readonly api: ApiService){}

    async findAll(limit = 10, offset = 0){
        const page = offset / limit + 1;
        const response = await this.api.get<SwapiListResponse>(
            `${this.basePath}?page=${page}&limit=${limit}`
        );
        return response.results;
    }

    async finById(id: string){
        try{
            const response = await this.api.get<SwapiPersonResponse>(
                `${this.basePath}/${id}`
            )
            return response.result.properties;
        } catch {
            throw new NotFoundException(`Person with id ${id} not found`);
        }
    }

    async findAllLocal(page = 1, limit= 5){
        const offset = (page - 1) * limit;
        const start = offset;
        const end = offset + limit;

        const results = this.local.slice(start, end);

        return {
            total: this.local.length,
            limit,
            offset,
            data: results,
        };
    }

    async findByIdLocal(id: string){
        const person = this.local.find(p => p.id == id);
        if(!person) throw new NotFoundException(`Person with id ${id} not found`);
        return person;
    }

    async createPerson(person: CreatePersonDto){
        const newPerson: SwapiPerson = {
            id: generateID() ?? '',
            name: person.name ?? '',
            birth_year: person.birthYear ?? '',
            height: person.height ?? '',
            gender: person.gender ?? '',
            homeworld: person.homeworld ?? '',
        }

        this.local.push(newPerson);

        return {
            message: `Person ${person.name} created locally`,
            person: newPerson,
        };
    }

    async updateById(id: string, update: UpdatePersonDto){
        const person = this.local.find(p => p.id === id);
        if(!person) throw new NotFoundException(`Person with id ${id} not found`);

        Object.assign(person, update);

        return {
            message: `Person with id ${id} successfully updated`,
            updated: person,
        }
    }

    async deletePerson(id: string){
        const index = this.local.findIndex(p => p.id === id);
        if (index === -1) throw new NotFoundException(`Person with id ${id} not found`);

        const [removed] = this.local.splice(index, 1);

        return {
            message: `Person with id ${id} successfully deleted`,
            person: removed,
        };
    }
}
