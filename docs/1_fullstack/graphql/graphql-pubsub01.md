---
title: NestJS GraphQL Subscribe 예제
---

## 목적

- subscribe real-time 구현

## 개념

- HTTP/HTTPS 는 req,res 객체가 있다. header 객체 안에 JWT 토큰으로 인증도 했었다.
- WS/WSS (웹소켓)를 사용하는 subscribe 시스템은, req 가 아닌 connection 객체이다.
- 그래서 쿠키, jwt 토큰도 접근 방식이 다르다. 전혀 다른 프로토콜이다.

## 사용 모듈

- npm graphql-subscriptions
  [https://www.npmjs.com/package/graphql-subscriptions](https://www.npmjs.com/package/graphql-subscriptions)

## 셋팅

### Graphql module

- nest.js 에서 이미 제공하는 구독 헨들러를 설정해주자.

```ts
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), //true
      context: ({ req, connection }) => {
        if (req) {
          return { user: req['user'] };
        } else {
          console.log(connection);
        }
      },
    }),
```

### @Subscribe Resolver

- Subscription으로 리슨 상태로 들어오면
- 특정 Mutation은 특정 key값으로 브로드 케스트를 날릴 수 있다.
- payload가 RAM에 들어오며 해당 객체가 Listen중인 client에게 전달된다.

```ts
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

@Resolver((of) => Order)
export class OrderResolver {
  constructor(private readonly ordersService: OrderService) {}

  @Mutation((returns) => Boolean)
  potatoReady() {
    pubsub.publish("hotPotatos", {
      // 1. key 이름이 동일
      readyPotato: "YOur potato is ready. love you.", // payload는 key 이름이 subscription 함수 이름 동일
    });
    return true;
  }

  @Subscription((returns) => String)
  readyPotato() {
    return pubsub.asyncIterator("hotPotatos");
  }
}
```

## 참조

- [https://youtu.be/ao4C9dJO7n0](https://youtu.be/ao4C9dJO7n0)
