---
title: NestJS MSA - TCP
---

## 목적

- REST API 서버1 을 만든다.
- MicroService를 제공하는 서버2 를 만든다.
- 서버1 은 서버2의 클라이언트로 MicroService를 TCP 메시지로 요청한다.

## 설치

> yarn add @nestjs/microservices

## 서버1 - REST API + MSA Client 만들기

### 설계

- Service에 MS 클라이언트를 Injection 하자

### 결과

- 3000번 포트 실행

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

- 3000번에는 POST API 하나가 리슨중

```ts
import { Controller, Logger, Post, Body } from "@nestjs/common";
import { MathService } from "./math.service";

@Controller()
export class AppController {
  // Create a logger instance
  private logger = new Logger("AppController");

  // Inject the math service
  constructor(private mathService: MathService) {}

  // Map the 'POST /add' route to this method
  @Post("add")
  // Define the logic to be executed
  async accumulate(@Body("data") data: number[]) {
    this.logger.log("Adding " + data.toString()); // Log something on every call
    return this.mathService.accumulate(data); // use math service to calc result & return
  }
}
```

- 서비스 레이어에서는 MS 클라이언트이고, 메시지를 보냄

```ts
import { Injectable } from "@nestjs/common";
import {
  ClientProxyFactory,
  Transport,
  ClientProxy,
} from "@nestjs/microservices";

@Injectable()
export class MathService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: "127.0.0.1",
        port: 8877,
      },
    });
  }

  public accumulate(data: number[]) {
    return this.client.send<number, number[]>("add", data);
  }
}
```

## 서버2 - MSA Server 만들기

### 설계

- MS 서버를 구동
- 메시지패턴을 작성
- Service로직 Injection

### 결과

- main.ts

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { Transport } from "@nestjs/microservices";

// Create a logger instance
const logger = new Logger("Main");

// Create the microservice options object
const microserviceOptions = {
  transport: Transport.TCP,
  options: {
    host: "127.0.0.1",
    port: 8877,
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    microserviceOptions
  );
  app.listen(() => {
    logger.log("Microservice is listening...");
  });
}
bootstrap();
```

- app.controller.ts

```ts
import { Controller, Logger, Post, Body } from "@nestjs/common";
import { MathService } from "./math.service";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class AppController {
  // Create a logger instance
  private logger = new Logger("AppController");

  // Inject the math service
  constructor(private mathService: MathService) {}

  // Define the message pattern for this method
  @MessagePattern("add")
  // Define the logic to be executed
  async accumulate(data: number[]) {
    this.logger.log("Adding " + data.toString()); // Log something on every call
    return this.mathService.accumulate(data); // use math service to calc result & return
  }
}
```

- math.service.ts

```ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class MathService {
  public accumulate(data: number[]): number {
    return (data || []).reduce((a, b) => Number(a) + Number(b));
  }
}
```
