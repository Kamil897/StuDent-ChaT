import { IsEnum, IsInt, IsNotEmpty, IsObject, Min } from 'class-validator';

export class AddHistoryDto {
  @IsInt()
  @Min(1)
  userId!: number;

  @IsEnum({ writing: 'ielts-writing', reading: 'ielts-reading' } as any)
  examType!: 'ielts-writing' | 'ielts-reading';

  @IsObject()
  @IsNotEmpty()
  result!: Record<string, any>;
}

