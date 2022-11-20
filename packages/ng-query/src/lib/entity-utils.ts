type DataUpdateFunction<TInput, TOutput> = (input: TInput) => TOutput;

export function arrayPush<T extends Record<string, any>, K extends keyof T>(
  entitiesKey: K,
  entity: T[K] extends any[] ? T[K][0] : never
): DataUpdateFunction<T | undefined, T | undefined> {
  return function (state: T | undefined) {
    if (state) {
      return {
        ...state,
        [entitiesKey]: [...state[entitiesKey], entity],
      };
    }

    return;
  };
}

export function removeEntity<T extends Record<string, any>, K extends keyof T>(
  entitiesKey: K,
  entityId: string | number,
  entityIdKey: keyof T = 'id'
): DataUpdateFunction<T | undefined, T | undefined> {
  return function (state: T | undefined) {
    if (state) {
      return {
        ...state,
        [entitiesKey]: state[entitiesKey].filter(
          (entity: any) => entity[entityIdKey] !== entityId
        ),
      };
    }

    return;
  };
}
