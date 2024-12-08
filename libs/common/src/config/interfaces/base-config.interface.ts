export interface IBaseConfig {
  env: string;
  globalPrefix: string;
  port: number;
}

export interface IJwt {
  jwt_secret: string;
}
