import Category from "../enums/Category";

export default interface ICommandOptions {
    name: string;
    description: string;
    category: Category;
    options: object;
    default_member_permissions: bigint;
    dm_permissions: boolean;
    cooldown: number;
    development: boolean;
}