export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AnalyticsCostUserMultiplier: number
      AnalyticsCostNewUserMultiplier: number
      ENV: "test" | "dev" | "prod"
    }
  }
}
