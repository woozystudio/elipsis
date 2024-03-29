import IConfig from "./Config";

export default interface IClient {
    config: IConfig;

    Init(): void;
    LoadHandlers(): void;
}