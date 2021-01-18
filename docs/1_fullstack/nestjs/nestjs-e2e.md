---
title: NestJS E2E Test
---

## E2E 테스트

- 유닛테스트와 다르게 Request를 테스트한다.
- 유닛테스트는 하나의 서비스에 대해서 테스트 했다면 end to end 테스트는
- 하나의 request에 걸쳐있는 모듈,서비스를 전부 테스트하게 된다.

## NestJS E2E 테스트

- Jest 라이브러리를 사용
- /test/jest-e2e.json 에 설정이 들어간다.
- 명령어 "test:e2e": "jest --config ./test/jest-e2e.json" 을 실행

## config 설정

- unit test는 package.json 의 jest:{..} 에서 해주었지만
- e2e test 는 test/jest-e2e.json 에서 변경해주자. ( 명령어 셋팅에 config 파일 경로를 이렇게 지정해둠 )

- 절대경로 문제 : moduleNameMapper 을 다음처럼 변경

```ts
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "moduleNameMapper": {
    "^src/(.*)$": "<rootDir>/../src/$1"
  }
}
```

- env 문제 : .env.test 파일을 그대로 만들어주고, test DB를 사용하자

```ts
DB_HOST = localhost;
DB_PORT = 5433;
DB_USERNAME = postgres;
DB_PASSWORD = X_X_X_X_X_;
DB_NAME = nuber - eats - test;
SECRET_KEY = y1BBZTgN_X_X_X_X_X___TzxTohPW2;
```

# after All

- Test가 시작할때 (BefereAll) Test가 종료되었을때(AfterAll)
- App 종료
- DB Cleanup

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import \* as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';
describe('UserModule (e2e)', () => {
  let app: INestApplication;
  // app 을 생성하고
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  // 테스트가 끝나면( db clean, app close)
  afterAll(async () => {
    await getConnection().dropDatabase();
    await app.close();
  });
  it.todo('me');
});

```

## first test - gql

```ts
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { getConnection } from "typeorm";

const GRAPHQL_ENDPOINT = "/graphql";

describe("UserModule (e2e)", () => {
  let app: INestApplication; // app 을 생성하고

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  }); // 테스트가 끝나면( db clean, app close)

  afterAll(async () => {
    await getConnection().dropDatabase();
    await app.close();
  });

  describe("createAccount", () => {
    it("should create account", () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            createAccount(
              input: { email: "test@user.com", password: "test", role: Owner }
            ) {
              error
              ok
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });
  });
  it.todo("userProfile");
  it.todo("login");
  it.todo("me");
  it.todo("verifyEmail");
  it.todo("editProfile");
});
```

## mocking email module - got 라이브러리 함수

## userRepo 데이터 가져오기

## header setting 해주기

## 참조)

[https://github.com/nomadcoders/nuber-eats-backend/commit/110a531f0b02652fbaf713b9eccab476fdffcd44](https://github.com/nomadcoders/nuber-eats-backend/commit/110a531f0b02652fbaf713b9eccab476fdffcd44)
