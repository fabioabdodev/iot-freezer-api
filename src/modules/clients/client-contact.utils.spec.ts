import {
  isValidPhone,
  normalizeClientPhone,
} from './client-contact.utils';

describe('client-contact.utils', () => {
  it('normalizes brazilian phones to include country code', () => {
    expect(normalizeClientPhone('(31) 98888-7777')).toBe('5531988887777');
    expect(normalizeClientPhone('(31) 3333-4444')).toBe('553133334444');
  });

  it('preserves phones already normalized with country code', () => {
    expect(normalizeClientPhone('5531988887777')).toBe('5531988887777');
  });

  it('accepts phones with or without country code in validation', () => {
    expect(isValidPhone('(31) 98888-7777')).toBe(true);
    expect(isValidPhone('5531988887777')).toBe(true);
    expect(isValidPhone('98888-7777')).toBe(false);
  });
});
