import {
  IsArray,
  ArrayNotEmpty,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class IeltsReadingDto {
  @IsString()
  @IsNotEmpty()
  testId: string;

  @IsArray()
  @ArrayNotEmpty()
  answers: string[];

  @IsInt()
  @Min(1)
  userId: number;
}
