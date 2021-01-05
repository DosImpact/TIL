---
title: NestJS REST API 설계 - 1
---

## 목적

- REST API 의 URL 셋팅을 해보자.!

- 컨트롤러 목표

```cs
url routing 기능

GET POST PATCH, DELETE

@Param @Body @Query
```

- 서비스 목표

```cs
JS 배열을 DB라고 가정하여 CRUD 구현
 📌 ------------ Podcasts CURD
 📌 ------------ Episodes CURD
```

## 구현 순서

1. 엔터티를 구현합니다.

2. 컨트롤러를 구현합니다.

- param,body,query는 데코레이터 이용

3. 서비스를 구현합니다.

- Array를 DB라 가정하여 CURD를 구현합니다.
- 방어적 프로그래밍을 합니다. ( NotFoundException 이용 )

4. 서비스에 필요한 dto를 구현합니다.

- update,creat DTO 필수

## entity

### episode.entity.ts

```ts
export class Episode {
  title: string;
  order: number;
}
```

### podcast.entity.ts

```ts
import { Episode } from "./episode.entity";

export class Podcast {
  id: number;
  title: string;
  category: string;
  rating: number;
  episodes: Episode[];
}
```

## podcasts.module.ts

```ts
import { Module } from "@nestjs/common";
import { PodcastsService } from "./podcasts.service";
import { PodcastsController } from "./podcasts.controller";

@Module({
  controllers: [PodcastsController],
  providers: [PodcastsService],
})
export class PodcastsModule {}
```

## podcasts.controller.ts

```ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { Podcast } from "./entities/podcast.entity";
import { PodcastsService } from "./podcasts.service";
import { CreatePodcastInput } from "./dto/createPodcast.dto";
import { UpdatePodcastInput } from "./dto/updatePodcast.dto";
import { UpdateEpisodeInput } from "./dto/updateEpisode.dto";
import { CreateEpisodeInput } from "./dto/createEpisode.dto";

// url routing 기능

// GET POST PATCH, DELETE

// @Param @Body @Query

@Controller("podcasts")
export class PodcastsController {
  constructor(private readonly podcastsService: PodcastsService) {}

  // 📌 ------------ Podcasts CURD
  @Get("/")
  getPodcasts(): Podcast[] {
    return this.podcastsService.getPodcasts();
  }

  @Post("/")
  createPodcasts(@Body() createPodcastInput: CreatePodcastInput) {
    return this.podcastsService.createPodcasts(createPodcastInput);
  }

  @Get("/:id")
  getPotcastById(@Param("id") id: number): Podcast {
    return this.podcastsService.getPotcastById(id);
  }

  @Patch("/:id")
  updatePotcastById(
    @Param("id") id: number,
    @Body() updatePodcastInput: UpdatePodcastInput
  ) {
    return this.podcastsService.updatePotcastById(
      Number(id),
      updatePodcastInput
    );
  }

  @Delete("/:id")
  deletePotcastById(@Param("id") id: number) {
    return this.podcastsService.deletePotcastById(Number(id));
  }

  // 📌 ------------ Episodes CURD

  @Get("/:id/episodes")
  getEpisodes(@Param("id") podcastId: number) {
    return this.podcastsService.getEpisodes(Number(podcastId));
  }
  @Get("/:id/episodes/:episodesId")
  getEpisodesById(
    @Param("id") podcastId: number,
    @Param("episodesId") episodesId: number
  ) {
    return this.podcastsService.getEpisodesById(
      Number(podcastId),
      Number(episodesId)
    );
  }

  @Post("/:id/episodes")
  createEpisodes(
    @Param("id") podcastId: number,
    @Body() createEpisodeInput: CreateEpisodeInput
  ) {
    return this.podcastsService.createEpisodes(
      Number(podcastId),
      createEpisodeInput
    );
  }

  @Patch("/:id/episodes/:episodesId")
  updateEpisodesById(
    @Param("id") podcastId: number,
    @Param("episodesId") episodesId: number,
    @Body() updateEpisodeInput: UpdateEpisodeInput
  ) {
    return this.podcastsService.updateEpisodesById(
      Number(podcastId),
      Number(episodesId),
      updateEpisodeInput
    );
  }

  @Delete("/:id/episodes/:episodesId")
  deleteEpisodesById(
    @Param("id") podcastId: number,
    @Param("episodesId") episodesId: number
  ) {
    return this.podcastsService.deleteEpisodesById(
      Number(podcastId),
      Number(episodesId)
    );
  }
}
```

## podcasts.service.ts

```ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateEpisodeInput } from "./dto/createEpisode.dto";
import { CreatePodcastInput } from "./dto/createPodcast.dto";
import { UpdateEpisodeInput } from "./dto/updateEpisode.dto";
import { UpdatePodcastInput } from "./dto/updatePodcast.dto";
import { Episode } from "./entities/episode.entity";
import { Podcast } from "./entities/podcast.entity";

@Injectable()
export class PodcastsService {
  podcastDB: Podcast[] = [
    {
      id: 1,
      title: "oh my love",
      rating: 5,
      category: "family",
      episodes: [
        { order: 1, title: "1st get out" },
        { order: 2, title: "2nd kimchi family" },
      ],
    },
  ];

  // 📌 ------------ Podcasts CURD

  getPodcasts(): Podcast[] {
    return this.podcastDB;
  }
  createPodcasts(createPodcastInput: CreatePodcastInput) {
    this.podcastDB.push({ ...createPodcastInput, episodes: [] });
    return createPodcastInput;
  }
  getPotcastById(id: number): Podcast {
    const podCast = this.podcastDB.filter((e) => {
      return e.id === +id;
    });
    if (podCast.length >= 1) {
      return podCast[0];
    } else {
      throw new NotFoundException("no potcast id");
    }
  }
  updatePotcastById(id: number, updatePodcastInput: UpdatePodcastInput) {
    const podCastIndex = this.podcastDB.findIndex((e) => {
      return e.id === +id;
    });
    if (podCastIndex !== -1) {
      this.podcastDB[podCastIndex] = {
        ...this.podcastDB[podCastIndex],
        ...updatePodcastInput,
      };
      return this.podcastDB[podCastIndex];
    } else {
      throw new NotFoundException("no potcast id");
    }
  }
  deletePotcastById(id: number) {
    const podCastIndex = this.podcastDB.findIndex((e) => {
      return e.id === +id;
    });
    if (podCastIndex !== -1) {
      return this.podcastDB.splice(podCastIndex, 1);
    } else {
      throw new NotFoundException("deletePotcastById no potcast id");
    }
  }

  // 📌 ------------ Episodes CURD

  getEpisodes(podCastId: number) {
    const podCast = this.podcastDB.find((e) => {
      return e.id === +podCastId;
    });
    if (podCast) {
      return podCast.episodes;
    } else {
      throw new NotFoundException(`getEpisodes no potcast id ${podCastId}`);
    }
  }
  getEpisodesById(podCastId, episodesId) {
    const podCast = this.podcastDB.find((e) => {
      return e.id === +podCastId;
    });
    if (podCast) {
      const episodes = podCast.episodes;
      if (episodes) {
        const episodesResult = episodes.find((e) => e.order === episodesId);
        if (episodesResult) {
        } else {
          throw new NotFoundException(
            `getEpisodes no potcast id ${podCastId} on episodes ${episodesId}`
          );
        }
        return episodesResult;
      } else {
        return episodes;
      }
    } else {
      throw new NotFoundException(`getEpisodes no potcast id ${podCastId}`);
    }
  }

  createEpisodes(podcastId: number, createEpisodeInput: CreateEpisodeInput) {
    const podcastResultIdx = this.podcastDB.findIndex(
      (e) => e.id === +podcastId
    );
    if (podcastResultIdx !== -1) {
      this.podcastDB[podcastResultIdx].episodes.push(createEpisodeInput);
      return this.podcastDB[podcastResultIdx].episodes;
    } else {
      throw new NotFoundException(`createEpisodes no potcast id ${podcastId}`);
    }
  }

  updateEpisodesById(
    podcastId: number,
    episodesId: number,
    updateEpisodeInput: UpdateEpisodeInput
  ) {
    const podcastResultIdx = this.podcastDB.findIndex(
      (e) => e.id === +podcastId
    );
    if (podcastResultIdx !== -1) {
      // Ref Target
      const targetEpisode = this.podcastDB[podcastResultIdx].episodes;
      const searchResultIdx = targetEpisode.findIndex(
        (e) => e.order === episodesId
      );
      if (searchResultIdx !== -1) {
        targetEpisode[searchResultIdx] = updateEpisodeInput;
        return targetEpisode;
      } else {
        throw new NotFoundException(
          `updateEpisodesById no potcast id ${podcastId}`
        );
      }
    } else {
      throw new NotFoundException(
        `updateEpisodesById no potcast id ${podcastId}`
      );
    }
  }
  deleteEpisodesById(podcastId: number, episodesId: number) {
    // podcastId check
    const poadcastResIdx = this.podcastDB.findIndex((e) => e.id === podcastId);
    if (poadcastResIdx === -1)
      throw new NotFoundException(
        `deleteEpisodesById no potcast id ${podcastId}`
      );

    // episodesId check
    const episodesResIdx = this.podcastDB[poadcastResIdx].episodes.findIndex(
      (e) => e.order === episodesId
    );
    if (episodesResIdx === -1)
      throw new NotFoundException(
        `deleteEpisodesById no potcast id ${podcastId} on episodesId ${episodesId}`
      );

    // delete
    return this.podcastDB[poadcastResIdx].episodes.splice(episodesResIdx, 1);
  }
}
```

## dto

```ts
export class CreateEpisodeInput {
  title: string;
  order: number;
}
```

```ts
export class CreatePodcastInput {
  id: number;
  title: string;
  category: string;
  rating: number;
}
```

```ts
export class UpdateEpisodeInput {
  title: string;
  order: number;
}
```

```ts
export class UpdatePodcastInput {
  id: number;
  title: string;
  category: string;
  rating: number;
}
```

## FeedBack

### ⚠ id number 값

body 로부터 오는 데이터는 항상 string이다. 그래서 number로 변환해함.

1. 방법 - validate pipe 이용 > transformer
2. 방법 - Number, + 등으로 number로 일일히 변환

### ⚠ JS 배열 함수 Recap

=== 로 비교 결과 - index 반환
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

=== 로 비교 결과 - lastIndex 반환
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf

( ) => 비교 결과 boolean - 하나는 element 반환
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find

( ) => 비교 결과 boolean - 하나는 index 반환
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex

### ⚠ 방어적 프로그래밍

if 들어가고

if 또 들어가고

if 또 들어가고 하는 방법에서

- if 예외상황이 있나 check 하는 방법 - 방어적 프로그래밍으로 리팩토링

## 참조

- 챌린지 2일차
