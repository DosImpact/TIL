---
title: NestJS TypeORM 01
---

## 목적

- GraphQL API + TypeORM 데코레이터로 모델링
- 1:N 관계 모델링
- CURD

## 구현 순서

1. episode.entity.ts,podcast.entity.ts 엔터티를 구현합니다.

2. Service에 CURD 를 작성

## Entity 설계

- 팟캐스트는 여러개의 에피소드를 가지고 있다.
- podcast : 에피소드 = N : 1

```ts
import { Episode } from "./episode.entity";
import { ObjectType, Field, InputType } from "@nestjs/graphql";
import { IsString, IsNumber } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@InputType("PodcastInput", { isAbstract: true })
@ObjectType()
export class Podcast {
  @PrimaryGeneratedColumn()
  @Field((_) => Number)
  @IsNumber()
  id: number;

  @Column()
  @Field((_) => String)
  @IsString()
  title: string;

  @Column()
  @Field((_) => String)
  @IsString()
  category: string;

  @Column()
  @Field((_) => Number)
  @IsNumber()
  rating: number;

  @OneToMany((type) => Episode, (episode) => episode.podcast)
  @Field((_) => [Episode])
  episodes: Episode[];
}
```

```ts
import { InputType, ObjectType, Field } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Podcast } from "./podcast.entity";

@Entity()
@InputType("EpisodeInput", { isAbstract: true })
@ObjectType()
export class Episode {
  @PrimaryGeneratedColumn()
  @Field((_) => Number)
  id: number;

  @Column()
  @Field((_) => String)
  title: string;

  @Column()
  @Field((_) => String)
  category: string;

  @ManyToOne(() => Podcast, (podcast) => podcast.episodes)
  @Field((_) => Podcast, { nullable: true })
  podcast?: Podcast;
}
```

## TypeORM DI

- forRoot DI
- forFeature DI

```ts
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { PodcastsModule } from "./podcast/podcasts.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Podcast } from "./podcast/entities/podcast.entity";
import { Episode } from "./podcast/entities/episode.entity";

@Module({
  imports: [
    PodcastsModule,
    GraphQLModule.forRoot({ autoSchemaFile: true }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      // type: 'postgres',
      // host: 'xxx.xxx.221.xxx',
      // port: 5432,
      // username: 'postgres',
      // password: 'dosimpact',
      // database: 'podcast',
      logging: true,
      synchronize: true,
      entities: [Podcast, Episode],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

```ts
import { Module } from "@nestjs/common";
import { PodcastsService } from "./podcasts.service";
import { PodcastsResolver, EpisodeResolver } from "./podcasts.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Episode } from "./entities/episode.entity";
import { Podcast } from "./entities/podcast.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Episode, Podcast])],
  providers: [PodcastsService, PodcastsResolver, EpisodeResolver],
})
export class PodcastsModule {}
```

## Service 로직

```ts
import { Injectable } from "@nestjs/common";
import { CreateEpisodeDto } from "./dtos/create-episode.dto";
import { CreatePodcastDto } from "./dtos/create-podcast.dto";
import { UpdateEpisodeDto } from "./dtos/update-episode.dto";
import { UpdatePodcastDto } from "./dtos/update-podcast.dto";
import { Episode } from "./entities/episode.entity";
import { Podcast } from "./entities/podcast.entity";
import { CoreOutput } from "./dtos/output.dto";
import {
  PodcastOutput,
  PodcastSearchInput,
  EpisodesOutput,
  EpisodesSearchInput,
} from "./dtos/podcast.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Episode)
    private readonly episodeRepo: Repository<Episode>,
    @InjectRepository(Podcast)
    private readonly podcastRepo: Repository<Podcast>
  ) {}

  private podcasts: Podcast[] = [];

  getAllPodcasts(): Promise<Podcast[]> {
    return this.podcastRepo.find({ relations: ["episodes"] });
    // return this.podcasts;
  }

  async createPodcast({
    title,
    category,
  }: CreatePodcastDto): Promise<CoreOutput> {
    await this.podcastRepo.save(
      this.podcastRepo.create({
        title,
        category,
        rating: 0,
        episodes: [],
      })
    );
    return { ok: true, error: null };
  }

  async getPodcast(id: number): Promise<PodcastOutput> {
    const podcast = await this.podcastRepo.findOne(
      { id },
      { relations: ["episodes"] }
    );
    if (!podcast) {
      return {
        ok: false,
        error: `${id} id podcast doesn't exist!`,
      };
    }
    return {
      ok: true,
      podcast,
    };
  }

  async deletePodcast(id: number): Promise<CoreOutput> {
    try {
      await this.podcastRepo.delete(id);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: "cannot deletePodcast",
      };
    }
  }

  async updatePodcast({ id, ...rest }: UpdatePodcastDto): Promise<CoreOutput> {
    const podcast = await this.podcastRepo.findOne({ id });
    if (!podcast) {
      return { ok: false };
    }
    await this.podcastRepo.save({
      ...podcast,
      ...rest,
    });
    return { ok: true };
  }

  // --------------------------------------------

  async getEpisodes(podcastId: number): Promise<EpisodesOutput> {
    const { podcast, ok, error } = await this.getPodcast(podcastId);
    if (!ok) {
      return { ok, error };
    }
    return { ok: true, episodes: podcast.episodes };
  }

  async createEpisode({
    id: podcastId,
    title,
    category,
  }: CreateEpisodeDto): Promise<CoreOutput> {
    try {
      const { podcast, ok, error } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }
      await this.episodeRepo.save(
        this.episodeRepo.create({
          title,
          category,
          podcast,
        })
      );
      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  }

  async deleteEpisode({
    podcastId,
    episodeId,
  }: EpisodesSearchInput): Promise<CoreOutput> {
    try {
      const { podcast, error, ok } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }
      const episode = await this.episodeRepo.findOne({
        where: {
          id: episodeId,
          podcast,
        },
      });
      await this.episodeRepo.delete(episode);

      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  }

  async updateEpisode({
    podcastId,
    episodeId,
    ...rest
  }: UpdateEpisodeDto): Promise<CoreOutput> {
    try {
      const { podcast, error, ok } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }
      const preEpisode = await this.episodeRepo.findOne({
        where: {
          podcast,
          id: episodeId,
        },
      });

      await this.episodeRepo.save([{ ...preEpisode, ...rest }]);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: "cannot updateEpisode" };
    }
  }
}
```

### ⚠ 릴레이션 필드는 반드시 relations 표기 해서 find 하기

### ⚠ one to many - relation connect

[https://typeorm.io/#/many-to-one-one-to-many-relations](https://typeorm.io/#/many-to-one-one-to-many-relations)

## 참조

- 챌린지 3,4일차
