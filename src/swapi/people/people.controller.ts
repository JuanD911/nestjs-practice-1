import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Controller('people')
export class PeopleController {
  
  constructor(private readonly peopleService: PeopleService) {}

  @Get('all')
  getAll(@Query('limit') limit = 10, @Query('offset') offset = 0){
    return this.peopleService.findAll(Number(limit), Number(offset));
  }

  @Get(':id')
  getById(@Param('id') id: string){
    return this.peopleService.finById(id);
  }

  @Get('local/all')
  getAllLocal(@Query('page') page = 1, @Query('limit') limit = 5){
    return this.peopleService.findAllLocal(Number(page), Number(limit));
  }

  @Get('local/:id')
  getByIdLocal(@Param('id') id: string){
    return this.peopleService.findByIdLocal(id);
  }

  @Post('create-person')
  @UsePipes(ValidationPipe)
  createPerson(@Body() person: CreatePersonDto){
    return this.peopleService.createPerson(person);
  }

  @Patch('local/update/:id')
  updatePerson(@Param('id') id: string, @Body() updatedPerson: UpdatePersonDto){
    return this.peopleService.updateById(id, updatedPerson);
  }

  @Delete('local/:id')
  deletePerson(@Param('id') id: string){
    return this.peopleService.deletePerson(id);
  }

}
