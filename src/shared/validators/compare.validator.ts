import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint()
export class CompareValidator implements ValidatorConstraintInterface {
  validate(value: any, args?: ValidationArguments): boolean {
    if (args) {
      for (const constraint of args.constraints) {
        if (value === args.object[constraint]) {
          return true;
        }
      }
    }

    return false;
  }

  defaultMessage(args?: ValidationArguments): string {
    if (args && args.constraints && args.constraints.length > 0 && args.property) {
      return `Values from properties ${args.constraints.pop()} and ${args.property} are different`;
    }

    return null;
  }
}
