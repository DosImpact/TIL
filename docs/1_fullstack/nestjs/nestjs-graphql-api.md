---
title: NestJS GraphQL API 설계 - 2 ( None DB )
---

## 목적

- GraphQL API 의 URL 셋팅을 해보자.!

## 설계

- OutType의 공통의 요소는 CoreOutput 으로 만들자.
- 다음 Service의 내용을 GraphQL input,ouput,DTO 로 구현하자.

```ts
getAllPodcasts;
createPodcast;
getPodcast;
deletePodcast;
updatePodcast;
getEpisodes;
createEpisode;
deleteEpisode;
findEpisode;
updateEpisode;
```

## resolver.ts 결과

```ts
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { PodcastOutType } from "./dtos/podcast.dto";
import { Podcast } from "./entities/podcast.entity";
import { PodcastsService } from "./podcasts.service";
import {
  CreaetPodcastInput,
  CreaetPodcastOutput,
} from "./dtos/create-podcast.dto";
import { PodcastsOutType } from "./dtos/podcasts.dto";
import {
  UpdatePodcastInput,
  UpdatePodcastOutput,
} from "./dtos/update-podcast.dto";
import { DeletePodcastOutput } from "./dtos/delete-podcast.dto";
import { Episode } from "./entities/episode.entity";
import { EpisodesOutType } from "./dtos/episodes.dto";
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from "./dtos/create-episode.dto";
import {
  DeleteEpisdoInput,
  DeleteEpisdoOutput,
} from "./dtos/delete-episode.dto";
import { EpisdoInputType, EpisodoOutType } from "./dtos/episode.dto";
import {
  UpdateEpisdoInput,
  UpdateEpisdoOutput,
} from "./dtos/update-episode.dto";

@Resolver(() => Podcast)
export class PodcastResolver {
  constructor(private readonly podcastsService: PodcastsService) {}
  // getAllPodcasts
  @Query((returns) => PodcastOutType)
  getAllPodcasts() {
    return this.podcastsService.getAllPodcasts();
  }
  // createPodcast
  @Mutation((returns) => CreaetPodcastOutput)
  createPodcast(@Args("input") creaetPodcastInput: CreaetPodcastInput) {
    return this.podcastsService.createPodcast(creaetPodcastInput);
  }
  // getPodcast
  @Query((returns) => PodcastsOutType)
  getPodcast(@Args("id", { type: () => String }) id: string): PodcastsOutType {
    return this.podcastsService.getPodcast(id);
  }
  // updatePodcast
  @Mutation((returns) => UpdatePodcastOutput)
  updatePodcast(
    @Args("id", { type: () => String }) id,
    @Args("input") updatePodcastInput: UpdatePodcastInput
  ) {
    return this.podcastsService.updatePodcast(id, updatePodcastInput);
  }
  // deletePodcast
  @Mutation((returns) => DeletePodcastOutput)
  deletePodcast(@Args("id", { type: () => String }) id) {
    return this.podcastsService.deletePodcast(id);
  }
}

@Resolver((of) => Episode)
export class EpisodeResolver {
  constructor(private readonly podcastsService: PodcastsService) {}
  //getEpisodes
  @Query((returns) => EpisodesOutType)
  getEpisodes(@Args("id", { type: () => String }) id: string): EpisodesOutType {
    return this.podcastsService.getEpisodes(id);
  }
  //createEpisode
  @Mutation((returns) => CreateEpisodeOutput)
  createEpisode(
    @Args("id", { type: () => String }) id: string,
    @Args("input") createEpisodeInput: CreateEpisodeInput
  ): CreateEpisodeOutput {
    return this.podcastsService.createEpisode(id, createEpisodeInput);
  }

  //deleteEpisode
  @Mutation((returns) => DeleteEpisdoOutput)
  deleteEpisode(
    @Args("input") { episodeId, podcastId }: DeleteEpisdoInput
  ): DeleteEpisdoOutput {
    return this.podcastsService.deleteEpisode(podcastId, episodeId);
  }

  //findEpisode
  @Query((returns) => EpisodoOutType)
  findEpisode(@Args("input") { episode, podcastId }: EpisdoInputType) {
    return this.podcastsService.findEpisode(podcastId, episode);
  }

  //updateEpisode
  @Mutation((returns) => UpdateEpisdoOutput)
  updateEpisode(
    @Args("input")
    { episodeId, podcastId, updateEpisodeDto }: UpdateEpisdoInput
  ) {
    return this.podcastsService.updateEpisode(
      podcastId,
      episodeId,
      updateEpisodeDto
    );
  }
}
```

## CoreOutput.ts 결과

```ts
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CoreOutput {
  @Field((type) => String, { nullable: true })
  err?: string;
}
```

## entity.ts 결과 (샘플)

```ts
import { Field, Float, InputType, Int, ObjectType } from "@nestjs/graphql";

// ⚠ Input에 대한 이름- Alias을 지정해줘야한다.
// 1. 입력할떄의 Episode 타입이랑
// 2. 출력할때의 Episode 타입이랑 충돌
@InputType("EpisodeInputType", { isAbstract: true })
@ObjectType()
export class Episode {
  @Field((type) => Float)
  id: number;

  @Field((type) => String)
  title: string;

  @Field((type) => String)
  category: string;

  @Field((type) => Int)
  rating: number;
}
```

## create-.dto.ts 결과 (샘플)

```ts
import { Field, Float, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/CoreOutput";
import { Episode } from "../entities/episode.entity";
import { CreatePodcastDto } from "./create-podcast.dto";

export class CreateEpisodeDto extends CreatePodcastDto {}

@InputType()
export class CreateEpisodeInput extends PickType(Episode, [
  "title",
  "category",
]) {}

@ObjectType()
export class CreateEpisodeOutput extends CoreOutput {
  @Field((type) => Float)
  episodeId: number;
}
```

- 순서대로

```ts
getAllPodcasts;
createPodcast;
getPodcast;
deletePodcast;
updatePodcast;
getEpisodes;
createEpisode;
deleteEpisode;
findEpisode;
updateEpisode;
```

```graphql
query {
  getAllPodcasts {
    podcasts {
      id
      title
      category
      rating
      episodes {
        id
        title
        category
        rating
      }
    }
  }
}

{
  "data": {
    "getAllPodcasts": {
      "podcasts": [
        {
          "id": 1609918417982,
          "title": "podcastTitle",
          "category": "simple",
          "rating": 0,
          "episodes": []
        },
        {
          "id": 1609918420013,
          "title": "podcastTitle",
          "category": "simple",
          "rating": 0,
          "episodes": []
        },
        {
          "id": 1609918420150,
          "title": "podcastTitle",
          "category": "simple",
          "rating": 0,
          "episodes": []
        }
      ]
    }
  }
}
```

```graphql
mutation {
  createPodcast(input: { title: "podcastTitle", category: "simple" }) {
    id
    error
  }
}

{
  "data": {
    "createPodcast": {
      "id": 1609918420150,
      "error": null
    }
  }
}
```

```graphql
query{
  getPodcast(id:"1609918417982"){
    podcast{
      id
      title
    }
    err
  }
}

{
  "data": {
    "getPodcast": {
      "podcast": {
        "id": 1609918417982,
        "title": "podcastTitle"
      },
      "err": null
    }
  }
}
```

```graphql
mutation {
  updatePodcast(id: "1609918420013", input: { title: "updateed" }) {
    err
  }
}
{
  "data": {
    "updatePodcast": {
      "err": null
    }
  }
}
```

```graphql
mutation{
  deletePodcast(id:"1609918417982"){
    err
  }
}

{
  "data": {
    "deletePodcast": {
      "err": null
    }
  }
}
```

```graphql
query{
  getEpisodes(id:"1609918420013"){
    err
    episodes{
      id
      title
      category
      rating
    }
  }
}

{
  "data": {
    "getEpisodes": {
      "err": null,
      "episodes": [
        {
          "id": 1609918444399,
          "title": "first",
          "category": "simple",
          "rating": 0
        },
        {
          "id": 1609918444543,
          "title": "first",
          "category": "simple",
          "rating": 0
        },
        {
          "id": 1609918444676,
          "title": "first",
          "category": "simple",
          "rating": 0
        },
        {
          "id": 1609918444835,
          "title": "first",
          "category": "simple",
          "rating": 0
        }
      ]
    }
  }
}
```

```graphql
mutation{
  createEpisode(id:"1609918420013",input:{
    title:"first",
    category:"simple"
  }){
    err
    episodeId
  }
}

{
  "data": {
    "createEpisode": {
      "err": null,
      "episodeId": 1609918444835
    }
  }
}
```

```graphql
mutation {
  deleteEpisode(
    input: { podcastId: "1609918420013", episodeId: "1609918444399" }
  ) {
    err
  }
}

{
  "data": {
    "deleteEpisode": {
      "err": null
    }
  }
}

```

```graphql
query{
  findEpisode(input:{
    podcastId:"1609917617137",
    episode:"1609917637726"
  }){
    err
    episode{
      id
      title
      category
      rating
    }
  }
}

{
  "data": {
    "findEpisode": {
      "err": null,
      "episode": {
        "id": 1609917637726,
        "title": "title updated",
        "category": "category updated",
        "rating": 10
      }
    }
  }
}
```

```graphql
mutation {
  updateEpisode(
    input: {
      podcastId: "1609917617137"
      episodeId: "1609917637726"
      updateEpisodeDto: {
        title: "title updated"
        category: "category updated"
        rating: 10
      }
    }
  ){
    err
  }
}

{
  "data": {
    "updateEpisode": {
      "err": null
    }
  }
}
```

## FeedBack

챌린지 3일차
REST API > GraphQL API

### ⚠ entity - Field 셋팅 안해서 - 오류

### ⚠ Input에 대한 이름- Alias을 지정해줘야한다.

1.  입력할떄의 Episode 타입이랑
2.  출력할때의 Episode 타입이랑 충돌

### ⚠ Date.now( ) 로 id 값을 주니

Int (32비트) 를 훨씬 넘는다. GraphQL type을 Float로 하자.

## 참조

- 챌린지 3 일차
