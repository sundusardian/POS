import { PartialType } from '@nestjs/mapped-types';
import { CreateDeskDto } from './create-desk.dto';

export class UpdateDeskDto extends PartialType(CreateDeskDto) {}
