import { AnyObject } from './any-object';

export type ExtractProperties<T extends AnyObject, TProperty> = {
    [key in keyof T]: T[key] extends TProperty ? key : never
};

export type Property<T extends AnyObject, TProperty> = ExtractProperties<T, TProperty>[keyof T];

export type FunctionProperty<T extends AnyObject> = Property<T, () => any>;