---
title: Apollo CLI
---

## 참조

https://github.com/apollographql/apollo-tooling
https://www.apollographql.com/docs/devtools/apollo-config/

## Apollo CLI CodeGenerator 목적

- Apollo-tooling 은 백앤드의 모든 gql schema의 type을 생성해준다.
- Front에서 API를 보내는것에 대한 확신이 있다.
- 백앤드에서작성한 DTO가 (inputType) 덕분에 가능한것!

- 내가 작성한 gql query 만 input,output type interface를 제공
- 백앤드의 schema를 다운로드 가능

## 설치

```ts
npm install -g apollo
```

## 셋팅

- apollo.config.js 만들기

- gql라는 이름으로 query를 작성했다. 그때 tagname 은 gql ( graphql 이라고 작성하는 경우도 있다.)
- service : 서버 url 를 적어야 introspect 가능
- gql태그가 있는 모든 파일위치 (glob 패턴) 작성

```ts
module.exports = {
  client: {
    // gql작성시 타입 도움을 줄 파일들 (glob 패턴)
    includes: ["./src/**/*.tsx"],
    tagName: "gql", // gql 이라는 태그로 query를 작성한다.
    service: {
      name: "nuber-eats-backend",
      url: "http://localhost:4000/graphql",
      // optional headers
      //   headers: {
      // authorization: "Bearer lkjfalkfjadkfjeopknavadf",
      //   },
      // optional disable SSL validation check
      //   skipSSLValidation: true,
    },
  },
};
```

## 예제 apollo client:codegen

### gql 작성

```ts
const LOGIN_MUTATION = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      ok
      token
      error
    }
  }
`;
```

### CLI 실행

- (옵션) 출력 파일명, TS 로 출력

```ts
C:\Users\Dos\Desktop\Projects\nuber-eats_frontend>apollo client:codegen mytypes.d.ts --target=typescript
  √ Loading Apollo Project
  √ Generating query files with 'typescript' target - wrote 2 files

```

- (옵션) 출력 파일명, TS 로 출력, 하나의 파일로 출력 ( 원래는 gql 코드가 있는 부분에 각 폴더로 저장)

```ts
C:\Users\Dos\Desktop\Projects\nuber-eats_frontend>apollo client:codegen mytypes.d.ts --target=typescript --outputFlat
  √ Loading Apollo Project
  √ Generating query files with 'typescript' target - wrote 2 files

```

```ts
C:\Users\Dos\Desktop\Projects\nuber-eats_frontend>apollo client:codegen mytypes.d.ts --target=typescript --outputFlat
CLIError: Error in "Loading schema for nuber-eats-backend": Error: Failed to connect to a running GraphQL endpoint at http://localhost:4001/graphql
This may be because you didn't start your service or the endpoint URL is incorrect.
    at Object.error (C:\Users\Dos\AppData\Roaming\npm\node_modules\apollo\node_modules\@oclif\errors\lib\index.js:26:15)
    at Generate.error (C:\Users\Dos\AppData\Roaming\npm\node_modules\apollo\node_modules\@oclif\command\lib\command.js:60:23)
    at OclifLoadingHandler.showError (C:\Users\Dos\AppData\Roaming\npm\node_modules\apollo\lib\OclifLoadingHandler.js:28:22)
    at OclifLoadingHandler.handle (C:\Users\Dos\AppData\Roaming\npm\node_modules\apollo\lib\OclifLoadingHandler.js:13:18)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
    at async GraphQLClientProject.loadServiceSchema (C:\Users\Dos\AppData\Roaming\npm\node_modules\apollo\node_modules\apollo-language-server\lib\project\client.js:94:9)
    at async Promise.all (index 1)
    at async Task.task (C:\Users\Dos\AppData\Roaming\npm\node_modules\apollo\lib\Command.js:52:17) {
  oclif: { exit: 2 },
  code: undefined
}
  × Loading Apollo Project
    → This may be because you didn't start your service or the endpoint URL is incorrect.
    Generating query files
 »   Error: Error initializing Apollo GraphQL project "nuber-eats-backend": Error: Error in "Loading schema for nuber-eats-backend": Error: Failed to connect to a
 »   running GraphQL endpoint at http://localhost:4001/graphql
 »   This may be because you didn't start your service or the endpoint URL is incorrect.

```

### 결과

- ✔ 자동으로 만들어진 입력 변수 interface
- ✔ 자동으로 만들어진 출력 타입 interface

```ts
/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: loginMutation
// ====================================================

export interface loginMutation_login {
  __typename: "LoginOutput";
  ok: boolean;
  token: string | null;
  error: string | null;
}

export interface loginMutation {
  login: loginMutation_login;
}

export interface loginMutationVariables {
  email: string;
  password: string;
}
```

## 예제 apollo client:download-schema

- 명령

```
C:\Users\Dos\Desktop\Projects\nuber-eats_frontend>npx apollo client:download-schema  schema.gql
  √ Loading Apollo Project
  √ Saving schema to schema.gql
```

- 결과

```ts
"""
Direct the client to resolve this field locally, either from the cache or local resolvers.
"""
directive @client(
  """
  When true, the client will never use the cache for this value. See
  https://www.apollographql.com/docs/react/essentials/local-state/#forcing-resolvers-with-clientalways-true
  """
  always: Boolean
) on FIELD | FRAGMENT_DEFINITION | INLINE_FRAGMENT

"""
Export this locally resolved field as a variable to be used in the remainder of this query. See
https://www.apollographql.com/docs/react/essentials/local-state/#using-client-fields-as-variables
"""
directive @export(
  """The variable name to export this field as."""
  as: String!
) on FIELD

"""
Specify a custom store key for this result. See
https://www.apollographql.com/docs/react/advanced/caching/#the-connection-directive
"""
directive @connection(
  """Specify the store key."""
  key: String!

  """
  An array of query argument names to include in the generated custom store key.
  """
  filter: [String!]
) on FIELD

type DishChoice {
  name: String!
  extra: Int
}

...
```
