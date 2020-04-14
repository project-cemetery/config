import { dateIsValid } from '../dateIsValid';

describe('dateIsValid', () => {
  test('should return false on empty string', () => {
    const valid = dateIsValid(new Date(''));
    expect(valid).toBeFalsy();
  });

  test('should return true on YYYY-MM-DD', () => {
    const valid = dateIsValid(new Date('2018-01-12'));
    expect(valid).toBeTruthy();
  });

  test('should return true on MMM DD YYYY', () => {
    const valid = dateIsValid(new Date('Dec 10 2018'));
    expect(valid).toBeTruthy();
  });
});
