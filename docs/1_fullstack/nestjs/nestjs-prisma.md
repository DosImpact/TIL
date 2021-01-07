---
title: NestJS + Prisma2
---

## 목적

- NestJS에 Prisma2를 인젝션 하자.

## 참조

[https://docs.nestjs.com/recipes/prisma](https://docs.nestjs.com/recipes/prisma)

## Prisma 셋팅하기

[https://www.prisma.io/docs/guides/migrate-to-prisma/migrate-from-typeorm#overview-of-the-migration-process](https://www.prisma.io/docs/guides/migrate-to-prisma/migrate-from-typeorm#overview-of-the-migration-process)

### 설치

- cli 설치 및 client 설치 후 init

```ts
npm install @prisma/cli --save-dev
npm install @prisma/client
npx prisma init

```

- DB Connection 만들기
- DB 모델 > Prisma 모델

```ts
DATABASE_URL="postgresql://postgres:dosimpact@123.000.123.000:5432/nuber-eats?schema=public"

npx prisma introspect

```

### 프리즈마 schema 다듬기

- 현재 model의 이름은 대문로 시작하는게 관습이다. @@map을 이용해서 기존 TypeORM의 필드와 mapping이 가능

1. 모델의 첫글자를 대문자로 바꾸고, @@map으로 원래 모델 이름을 적어준다. 2.이러한 모델이름의 변경으로 다른 필드의 참조 모델타입을 변경해준다.
   Eg)
2. user -> User 모델로 변환 , @@map("user") 라고 적어둠
3. profile 모델에서 user를 User 타입으로 변환

### 결과

```ts
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
model Category {
  id             Int              @id @default(autoincrement())
  name           String
  PostToCategory PostToCategory[]
  @@map("category")
}
model Post {
  id             Int              @id @default(autoincrement())
  title          String
  content        String?
  published      Boolean          @default(false)
  authorId       Int?
  user           User?            @relation(fields: [authorId], references: [id])
  PostToCategory PostToCategory[]
  @@map("post")
}
model PostToCategory {
  postId     Int
  categoryId Int
  category   Category @relation(fields: [categoryId], references: [id])
  post       Post     @relation(fields: [postId], references: [id])

  @@id([postId, categoryId])
  @@index([postId], name: "IDX_93b566d522b73cb8bc46f7405b")
  @@index([categoryId], name: "IDX_a5e63f80ca58e7296d5864bd2d")
  @@map("post_categories_category")
}
model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  userId Int?    @unique
  user   User?   @relation(fields: [userId], references: [id])
  @@map("profile")
}
model Restaurant {
  id           Int     @id @default(autoincrement())
  name         String
  isVegan      Boolean
  address      String
  ownerName    String
  categoryName String
  @@map("restaurant")
}
model User {
  id      Int      @id @default(autoincrement())
  name    String?
  email   String   @unique
  post    Post[]
  profile Profile?
  @@map("user")
}
```

## 참고 More

    - JOIN Tabl이라 불리우는, 매핑 테이블이라고 부르는 n:m 관계에서 필요한 테이블은
    - TypeORM을 통해서 모델링을 하면 해당 테이블을 거쳐야 한다.
    - 이를 explicity 한 다대다 관계 매핑이다.

Prisma에서는 이를 좀 더 사람이 이해하기 쉽도록 implicity하게 할 수 있다. - 프리즈마 모델링을 이용해야하며 prisma migrate를 이용해야함 - TypeORM는 못사용한다.

## make Prisma Service

```ts
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

## 모듈에 프리즈마 연결해서 사용하기

```ts
import { Module } from "@nestjs/common";
import { WorkbooksService } from "./workbooks.service";
import { WorkbooksController } from "./workbooks.controller";
import { PrismaService } from "src/prisma.service";

@Module({
  providers: [WorkbooksService, PrismaService],
  controllers: [WorkbooksController],
})
export class WorkbooksModule {}
```

```ts
import { Controller, Get } from "@nestjs/common";
import { WorkbooksService } from "./workbooks.service";

@Controller("workbooks")
export class WorkbooksController {
  constructor(private workbooksService: WorkbooksService) {}

  @Get("/")
  getAllWorkBooks() {
    return this.workbooksService.allWorkBooks();
  }

  @Get("/include/")
  getWorkBookInclude() {
    return this.workbooksService.WorkBookInclude();
  }
}
```

```ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class WorkbooksService {
  constructor(private prisma: PrismaService) {}

  async allWorkBooks() {
    return this.prisma.workBook.findMany();
  }

  async WorkBookInclude() {
    return this.prisma.workBook.findOne({
      where: { id: 1 },
      include: {
        WorkBook_has_Problem: {
          where: { WorkBook_id: 1 },
          include: {
            Problem: {},
          },
        },
      },
    });
  }
}
```
