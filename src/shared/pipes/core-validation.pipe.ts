import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform, ValidationPipe } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { isEmpty, validate } from 'class-validator';
import { formatErrors, isPrimitiveType } from 'src/core/helpers';

@Injectable()
export class CoreValidationPipe extends ValidationPipe implements PipeTransform {
  public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (value instanceof Object && isEmpty(value)) {
      throw new HttpException('Nothing was sent.', HttpStatus.BAD_REQUEST);
    }

    const { metatype } = metadata;
    if (!metatype || isPrimitiveType(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new HttpException(`${formatErrors(errors)}`, HttpStatus.BAD_REQUEST);
    }

    return value;
  }
}
