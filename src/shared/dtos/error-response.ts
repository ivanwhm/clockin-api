import { HttpStatus } from '@nestjs/common';

export class ErrorResponseDto {
  public constructor(
    public code: HttpStatus,
    public timestamp: Date,
    public path: string,
    public method: string,
    public messages: string[],
  ) {}
}
