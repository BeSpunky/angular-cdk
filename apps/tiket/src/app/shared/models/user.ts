export class User
{
    constructor(
        public readonly uid  : string,
        public readonly name : string,
        public readonly email: string,
        public readonly rut  : string,
        public readonly roles: string[] = [],
    ) { }
}