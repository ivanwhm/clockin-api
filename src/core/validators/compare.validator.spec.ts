import { ValidationArguments } from 'class-validator';

import { CompareValidator } from './compare.validator';

describe('CompareValidator', () => {
  let compareValidator: CompareValidator;

  beforeEach(() => {
    compareValidator = new CompareValidator();
  });

  describe('validate', () => {
    it('Should return true when the two values are equals.', () => {
      const args: ValidationArguments = {
        targetName: 'SomeDto',
        property: 'field1',
        value: 'value',
        object: { field2: 'value' },
        constraints: ['field2'],
      };
      expect(compareValidator.validate('value', args)).toBeTruthy();
    });

    it('Should return false when values are different.', () => {
      const args: ValidationArguments = {
        targetName: 'SomeDto',
        property: 'field1',
        value: 'value1',
        object: { field2: 'value2' },
        constraints: ['field2'],
      };
      expect(compareValidator.validate('value1', args)).toBeFalsy();
    });

    it('Should return false when values are from different types.', () => {
      const args: ValidationArguments = {
        targetName: 'SomeDto',
        property: 'field1',
        value: 123,
        object: { field2: new Date() },
        constraints: ['field2'],
      };
      expect(compareValidator.validate(123, args)).toBeFalsy();
    });

    it('Should return false when arguments are undefined.', () => {
      expect(compareValidator.validate(123)).toBeFalsy();
    });

    it('Should return false when arguments are explicit undefined.', () => {
      expect(compareValidator.validate(123, undefined)).toBeFalsy();
    });

    it('Should return false when arguments are explicit null.', () => {
      expect(compareValidator.validate(123, null)).toBeFalsy();
    });
  });

  describe('defaultMessage', () => {
    it('Should return a valid message.', () => {
      const args: ValidationArguments = {
        targetName: 'SomeDto',
        property: 'field1',
        value: 'value',
        object: { field2: 'value' },
        constraints: ['field2'],
      };
      expect(compareValidator.defaultMessage(args)).toBe("Values from properties 'field2' and 'field1' are different.");
    });

    it('Should return null when arguments are undefined.', () => {
      expect(compareValidator.defaultMessage()).toBeNull();
    });

    it('Should return null when arguments are explicit undefined.', () => {
      expect(compareValidator.defaultMessage(undefined)).toBeNull();
    });

    it('Should return null when arguments are explicit null.', () => {
      expect(compareValidator.defaultMessage(null)).toBeNull();
    });
  });
});
