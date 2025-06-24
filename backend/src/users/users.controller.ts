import {
    Controller,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { Roles } from '../common/decorators/roles.decorator';
  import { RolesGuard } from '../common/guards/roles.guard';
  import { AccessTokenGuard } from '../common/guards/access-token.guard';
  
  @Controller('users')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Get()
    findAll() {
      return this.usersService.findAll();
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
      return this.usersService.update(+id, dto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.usersService.remove(+id);
    }
  }
  