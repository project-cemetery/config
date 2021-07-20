import fc from 'fast-check';

import { createConfiguration } from './create_configuration';

describe('createConfiguration', () => {
  const emptyRecordArb = fc.object({
    values: [fc.constant(null), fc.constant(undefined), fc.constant('')],
    maxDepth: 0,
  });

  const truthyStringArb = fc
    .string({ minLength: 1 })
    .filter((s) => Number(s.trim()) !== 0);

  describe('#asIs', () => {
    test('should return original value in any case', () => {
      fc.assert(
        fc.property(fc.object(), (record) => {
          const config = createConfiguration(record);

          for (const [key, value] of Object.entries(record)) {
            expect(config.key(key).asIs).toBe(value);
          }
        }),
      );
    });
  });

  describe('#value', () => {
    describe('#asBoolean', () => {
      describe('#exists', () => {
        test('should return true for exist values', () => {
          const recordArb = fc.object({
            values: [truthyStringArb, fc.integer(), fc.float(), fc.boolean()],
          });

          fc.assert(
            fc.property(recordArb, (record) => {
              const config = createConfiguration(record);

              for (const key of Object.keys(record)) {
                expect(config.key(key).value.asBoolean.exists).toBeTruthy();
              }
            }),
          );
        });

        test('should return false for empty values', () => {
          fc.assert(
            fc.property(emptyRecordArb, fc.string(), (record, key) => {
              const config = createConfiguration(record);

              expect(config.key(key).value.asBoolean.exists).toBeFalsy();
            }),
          );
        });
      });

      describe('#orDefault', () => {
        test('should return default for empty value', () => {
          fc.assert(
            fc.property(
              emptyRecordArb,
              fc.boolean(),
              fc.string(),
              (record, def, key) => {
                const config = createConfiguration(record);

                expect(config.key(key).value.asBoolean.orDefault(def)).toEqual(
                  def,
                );
              },
            ),
          );
        });
      });

      describe('#nullable', () => {
        test('should return null for any empty value', () => {
          fc.assert(
            fc.property(emptyRecordArb, fc.string(), (record, key) => {
              const config = createConfiguration(record);

              expect(config.key(key).value.asBoolean.nullable).toBeNull();
            }),
          );
        });
      });

      describe('#orThrow', () => {
        test('should throw exception for any empty value', () => {
          fc.assert(
            fc.property(emptyRecordArb, fc.string(), (record, key) => {
              const config = createConfiguration(record);

              expect(
                () => config.key(key).value.asBoolean.orThrow,
              ).toThrowError();
            }),
          );
        });
      });

      test('return of any method should be the same for exist value', () => {
        const recordArb = fc.object({
          values: [
            fc.string({ minLength: 1 }),
            fc.integer(),
            fc.float(),
            fc.boolean(),
          ],
        });

        fc.assert(
          fc.property(recordArb, (record) => {
            const config = createConfiguration(record);

            for (const key of Object.keys(record)) {
              const value1 = config.key(key).value.asBoolean.nullable;
              const value2 = config.key(key).value.asBoolean.orThrow;
              const value3 = config.key(key).value.asBoolean.orDefault(false);

              expect(value1).toBe(value2);
              expect(value1).toBe(value3);
            }
          }),
        );
      });

      test('should parse string representation of booleans', () => {
        const record = { key1: 'true', key2: 'false' };

        const config = createConfiguration(record);

        expect(config.key('key1').value.asBoolean.orThrow).toEqual(true);
        expect(config.key('key2').value.asBoolean.orThrow).toEqual(false);
      });

      test('should return true for any truthy value', () => {
        const recordArb = fc.object({
          values: [
            truthyStringArb,
            fc.integer({ min: 1 }),
            fc.float({ min: 0 + Number.EPSILON }),
            fc.constant(true),
          ],
          maxDepth: 0,
        });

        fc.assert(
          fc.property(recordArb, (record) => {
            const config = createConfiguration(record);

            for (const key of Object.keys(record)) {
              expect(config.key(key).value.asBoolean.orThrow).toBeTruthy();
            }
          }),
        );
      });

      test('should return true for any falsy value', () => {
        const record = { key1: '0', key2: 0, key3: false, key4: 'false' };

        const config = createConfiguration(record);

        expect(config.key('key1').value.asBoolean.orThrow).toEqual(false);
        expect(config.key('key2').value.asBoolean.orThrow).toEqual(false);
        expect(config.key('key3').value.asBoolean.orThrow).toEqual(false);
        expect(config.key('key4').value.asBoolean.orThrow).toEqual(false);
      });
    });

    describe('#asDate', () => {
      const dateStringOrb = fc.date().map((date) => date.toISOString());

      describe('#exists', () => {
        test('should return true for exist date-like values', () => {
          const recordArb = fc.object({
            values: [dateStringOrb, fc.integer(), fc.float()],
            maxDepth: 0,
          });

          fc.assert(
            fc.property(recordArb, (record) => {
              const config = createConfiguration(record);

              for (const key of Object.keys(record)) {
                expect(config.key(key).value.asDate.exists).toBeTruthy();
              }
            }),
          );
        });

        test('should return false for empty values', () => {
          fc.assert(
            fc.property(emptyRecordArb, fc.string(), (record, key) => {
              const config = createConfiguration(record);

              expect(config.key(key).value.asDate.exists).toBeFalsy();
            }),
          );
        });

        test('should return false for exist non-date-like values', () => {
          const recordWithInvalidDates = {
            key1: 'invalid date',
            key2: '2020-13-34',
            key3: '15 января 2021',
          };

          const config = createConfiguration(recordWithInvalidDates);

          for (const key of Object.keys(recordWithInvalidDates)) {
            expect(config.key(key).value.asDate.exists).toBeFalsy();
          }
        });
      });
    });

    describe('#asNumber', () => {
      const numbericStringOrb = fc.oneof(
        fc.integer().map((date) => date.toString()),
        fc.float().map((date) => date.toString()),
      );

      describe('#exists', () => {
        test('should return true for exist numberic values', () => {
          const recordArb = fc.object({
            values: [numbericStringOrb, fc.integer(), fc.float()],
            maxDepth: 0,
          });

          fc.assert(
            fc.property(recordArb, (record) => {
              const config = createConfiguration(record);

              for (const key of Object.keys(record)) {
                expect(config.key(key).value.asNumber.exists).toBeTruthy();
              }
            }),
          );
        });

        test('should return false for empty values', () => {
          fc.assert(
            fc.property(emptyRecordArb, fc.string(), (record, key) => {
              const config = createConfiguration(record);

              expect(config.key(key).value.asDate.exists).toBeFalsy();
            }),
          );
        });

        test('should return false for exist non-numeric values', () => {
          const recordWithInvalidDates = {
            key1: 'fdsfds4343',
            key2: '43543fdfd',
            key3: 'gfdgfd',
          };

          const config = createConfiguration(recordWithInvalidDates);

          for (const key of Object.keys(recordWithInvalidDates)) {
            expect(config.key(key).value.asDate.exists).toBeFalsy();
          }
        });
      });
    });
  });

  describe('#asArray', () => {
    describe('#ofBoolean', () => {
      test('should return array of booleans with one value', () => {
        const record = { key1: 'true' };

        const config = createConfiguration(record);

        expect(config.key('key1').asArray.ofBoolean.orThrow).toEqual([true]);
      });

      test('should return array of booleans with two values separated by comma', () => {
        const record = { key1: 'true,false' };

        const config = createConfiguration(record);

        expect(config.key('key1').asArray.ofBoolean.orThrow).toEqual([
          true,
          false,
        ]);
      });

      test('should return array of booleans with two values separated by semicolon', () => {
        const record = { key1: 'true;false' };

        const config = createConfiguration(record);

        expect(config.key('key1').asArray.ofBoolean.orThrow).toEqual([
          true,
          false,
        ]);
      });
    });
  });

  describe('#shape', () => {
    test('should do something =)', () => {
      const record = { key1: 'true', key2: 2 };

      const config = createConfiguration(record);

      const shape = config.shape(({ key1, key2, key3 }) => ({
        key1: key1.value.asBoolean.orThrow,
        key2: key2.value.asString.nullable,
        key3: key3.value.asNumber.orDefault(12),
      }));

      expect(shape.key1).toBe(true);
      expect(shape.key2).toBe('2');
      expect(shape.key3).toBe(12);
    });
  });
});
