---
title: NestJS Bull.js
---

# NestJS 에서 큐시스템사용하기

    - 큐잉 라이브러리 bull.js 를 사용한다.
    - bull.js 에서 Redis 백앤드를 사용하므로 Redis를 설치하고 실행 !
    - 따라서 큐잉시스템은 노드인스턴스간 공유가 가능하다.

# producer/consumer 패턴

    - producer 가 Redis의 기반한 큐시스템에 작업을 밀어넣는다.
    ( audio 라는 큐에 transcode 라는 이름으로 넣음 )

      constructor(@InjectQueue('audio') private readonly audioQueue: Queue) {}
    	...
        await this.audioQueue.add('transcode', {
          file: 'audio.mp3',
        });


    - consumer 는 클래스로 만들고
    @Processor('audio')
    의 데코레이터를 가지면 audio 큐를 관찰하고
    @Process('transcode')
    의 데코레이터를 가지는 함수는, transcode 작업에 대해 처리한다.

# 패키지 설치

$ npm install --save @nestjs/bull bull
$ npm install --save-dev @types/bull

# Bull 모듈 셋팅

    - app 모듈에서 redis 셋팅과 함께 root 모듈을 반환
    - 오디오 모듈에서 사용할 큐 이름과 함께 모듈 임포트
    *등록할 큐 이름은 unique 해야함, inject key로도 사용할 예정임

@Module({
imports: [
BullModule.forRoot({
redis: {
host: 'localhost',
port: 6379,
},
}),
AudioModule,
],
controllers: [AppController],
providers: [AppService],
})
export class AppModule {}

@Module({
imports: [
BullModule.registerQueue({
name: 'audio',
}),
],
controllers: [AudioController],
providers: [AudioProcessor],
})
export class AudioModule {}

# 프로듀서 구현

    - 등록된 큐이름으로 DI
    - 큐에 작업 이름과, 작업에 필요한 변수, 옵션 ( 여기서는 최대 10분동안 작업 이후에는 강제종료 ) 을 전달

import { InjectQueue } from '@nestjs/bull';
import { Controller, Get, Post } from '@nestjs/common';
import { Queue } from 'bull';

@Controller('audio')
export class AudioController {

counter: number;

constructor(@InjectQueue('audio') private readonly audioQueue: Queue) {
this.counter = 0;
}

@Get('transcode')
async transcode() {
this.counter += 1;
await this.audioQueue.add(
'transcode',
{
file: `audio${this.counter}.mp3`,
},
{ timeout: 60000 \* 10 },
);
return `ok[${this.counter}]`;
}
}

# 컨슈머 구현

    @Processor('audio')
    export class AudioProcessor
    - audio 큐 관찰 클래스

      @Process('transcode')
      async handleTranscode(job: Job)
    - transcode 작업 처리 함수

    - 그 외 이벤트 리스너 있음
    큐가 등록되었을때
    큐의 작업이 완료 되었을때

import {
OnQueueActive,
OnQueueCompleted,
Process,
Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// audio 라는 큐 프로세서 생성

@Processor('audio')
export class AudioProcessor {

private readonly logger = new Logger(AudioProcessor.name);

@Process('transcode') // transcode 라는 job 이름 생성
async handleTranscode(job: Job) {
this.logger.debug('Start transcoding...');

    // progress 진행도 기록 가능
    let progress = 0;
    for (let i = 0; i < 100; i++) {
      await sleep(20);
      progress += 10;
      job.progress(progress);
    }

    this.logger.debug(job.data);
    this.logger.debug('Transcoding completed');

}

// event-listeners 프로세스의 이벤트가 실행되면 정보 출력
@OnQueueActive()
onActive(job: Job) {
console.log(
`[onActive]Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
);
}

// event-listeners 프로세스의 이벤트가 종료 출력
@OnQueueCompleted()
onCompleted(job: Job) {
console.log(
`[onCompleted]Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
);
}
}

## 참조

https://docs.nestjs.com/techniques/queues#named-configurations
