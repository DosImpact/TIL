---
title: NestJS TypeORM 모델링 예제
---

## 목적

- 모델링 연습

## 구현 순서

1. user.entity.ts, sharedNote.entity.ts Note.entity.ts 엔터티를 구현합니다.

2. Service에 CURD 를 작성

## 1:N 관계 만들기

```ts

// 사용자는 N개의 노트를 가지고 있다.
// 노트의 owner필드가 JoinColumn이다.
  @OneToMany(() => Note, (note) => note.owner)
  notes: Note[];

// 노트는 1명의 사용자를 가진다.
// 그 사용자의 pk를 fk로 ownerId라고 셋팅 해준다.
  @Column()
  ownerId: number;
  @ManyToOne(() => User, (user) => user.notes)
  @JoinColumn({ name: "ownerId" })
  owner: User;

```

## 사용자 엔터티 user.entity.ts

```ts
import { ObjectType, Field, Int, InputType } from "@nestjs/graphql";
import { Note } from "src/notes/entities/note.entity";
import { SharedNote } from "src/shared-notes/entities/shared-note.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@InputType("UserInput", { isAbstract: true })
@ObjectType()
export class User {
  @Field(() => Int, { description: "Example field (placeholder)" })
  exampleField: number;

  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field((type) => String)
  username: string;

  @OneToMany(() => Note, (note) => note.owner)
  notes: Note[];

  @OneToMany(() => SharedNote, (sharedNote) => sharedNote.target)
  notesSharedWithYou: SharedNote[];

  @OneToMany(() => SharedNote, (sharedNote) => sharedNote.sender)
  notesYouShared: SharedNote[];
}
```

## 노트 엔터티 Note.entity.ts

```ts
import { ObjectType, Field, Int, InputType } from "@nestjs/graphql";
import { SharedNote } from "src/shared-notes/entities/shared-note.entity";
import { User } from "src/users/entities/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
@InputType("NoteInput", { isAbstract: true })
@ObjectType()
export class Note {
  @Field(() => Int, { description: "Example field (placeholder)" })
  exampleField: number;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  ownerId: number;
  @ManyToOne(() => User, (user) => user.notes)
  @JoinColumn({ name: "ownerId" })
  owner: User;

  @OneToMany(() => SharedNote, (sharedNote) => sharedNote.note)
  shares: SharedNote[];
}
```

## 노트 엔터티sharedNote.entity.ts

```ts
import { ObjectType, Field, Int, InputType } from "@nestjs/graphql";
import { Note } from "src/notes/entities/note.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
@InputType("SharedNoteInput", { isAbstract: true })
@ObjectType()
export class SharedNote {
  @Field(() => Int, { description: "Example field (placeholder)" })
  exampleField: number;

  @PrimaryColumn()
  targetId: number;
  @ManyToOne(() => User, (user) => user.notesSharedWithYou)
  @JoinColumn({ name: "targetId" })
  target: User;

  @PrimaryColumn()
  senderId: number;
  @ManyToOne(() => User, (user) => user.notesYouShared)
  @JoinColumn({ name: "senderId" })
  sender: User;

  @PrimaryColumn()
  noteId: number;
  @ManyToOne(() => Note, (note) => note.shares)
  @JoinColumn({ name: "noteId" })
  note: Note;
}
```

## CURD - single Fields

```ts
// curd single table
const u1 = usersRepo.create({ username: "dodo" });
await usersRepo.find({ username: "dodo" });
await usersRepo.findOne({ username: "dodo" });
await usersRepo.update({ id: u1.id }, { username: "dodo" });
await usersRepo.save({ ...u1, username: "dodo2" }); // update
await usersRepo.save({ ...u1, username: "dodo3" }); // insert
await usersRepo.save({ ...u1, username: "dodo4" }); // insert
await usersRepo.save([{ id: u1.id, username: "dodo3" }]); // insert
```

## CURD - many to one fields

```ts
// curd many to one
const joe = await usersRepo.save(usersRepo.create({ username: "joe" }));
const note_to_tim = await notesRepo.save(
  notesRepo.create({ text: "hello tim", ownerId: joe.id })
);

const notes = await notesRepo.find({ ownerId: joe.id });
console.log(note_to_tim, notes);
```

## CURD - many to many

```ts
      // crud many to many
      const tim = await usersRepo.save(usersRepo.create({ username: 'tim' }));
      const note_to_jeo = await notesRepo.save(
        notesRepo.create({ text: 'hello jeo', ownerId: tim.id }),
      );
      await sharedNotesRepo.save(
        sharedNotesRepo.create({
          senderId: joe.id,
          targetId: tim.id,
          noteId: note_to_tim.id,
        }),
      );

      await sharedNotesRepo.save(
        sharedNotesRepo.create({
          senderId: tim.id,
          targetId: joe.id,
          noteId: note_to_jeo.id,
        }),
      );

      console.log('....');
      const notesSharedWithTim = await sharedNotesRepo.find({
        where: {
          targetId: tim.id,
        },
        relations: ['note'],
      });
      console.log('notesSharedWithTim', notesSharedWithTim);

      // relation

      const u_tim = await usersRepo.findOne(
        { id: tim.id },
        { relations: ['notesSharedWithYou', 'notesSharedWithYou.note'] },
      );

      const u_joe = await usersRepo.findOne(
        { id: joe.id },
        { relations: ['notesYouShared', 'notesYouShared.note'] },
      );

      console.log(u_tim, u_joe);
      console.log('____start_____');

      const u_joe2 = await usersRepo.findOne(
        { id: joe.id },
        {
          relations: [
            'notesYouShared',
            'notesYouShared.note',
            'notesSharedWithYou',
            'notesSharedWithYou.note',
          ],
        },
      );
      console.log(u_joe2);
      console.log(JSON.stringify(u_joe2, null, 4));
    };
```

## logging

```ts
notesSharedWithTim [
  SharedNote {
    targetId: 8,
    senderId: 7,
    noteId: 7,
    note: Note { id: 7, text: 'hello tim', ownerId: 7 }
  }
]
query: SELECT DISTINCT "distinctAlias"."User_id" as "ids_User_id" FROM (SELECT "User"."id" AS "User_id", "User"."username" AS "User_username", "User__notesSharedWithYou"."targetId" AS "User__notesSharedWithYou_targetId", "User__notesSharedWithYou"."senderId" AS "User__notesSharedWithYou_senderId", "User__notesSharedWithYou"."noteId" AS "User__notesSharedWithYou_noteId", "User__notesSharedWithYou__note"."id" AS "User__notesSharedWithYou__note_id", "User__notesSharedWithYou__note"."text" AS "User__notesSharedWithYou__note_text", "User__notesSharedWithYou__note"."ownerId" AS "User__notesSharedWithYou__note_ownerId" FROM "user" "User" LEFT JOIN "shared_note" "User__notesSharedWithYou" ON "User__notesSharedWithYou"."targetId"="User"."id"  LEFT JOIN "note" "User__notesSharedWithYou__note" ON "User__notesSharedWithYou__note"."id"="User__notesSharedWithYou"."noteId" WHERE "User"."id" = $1) "distinctAlias"  ORDER BY "User_id" ASC LIMIT 1 -- PARAMETERS: [8]
query: SELECT "User"."id" AS "User_id", "User"."username" AS "User_username", "User__notesSharedWithYou"."targetId" AS "User__notesSharedWithYou_targetId", "User__notesSharedWithYou"."senderId" AS "User__notesSharedWithYou_senderId", "User__notesSharedWithYou"."noteId" AS "User__notesSharedWithYou_noteId", "User__notesSharedWithYou__note"."id" AS "User__notesSharedWithYou__note_id", "User__notesSharedWithYou__note"."text" AS "User__notesSharedWithYou__note_text", "User__notesSharedWithYou__note"."ownerId" AS "User__notesSharedWithYou__note_ownerId" FROM "user" "User" LEFT JOIN "shared_note" "User__notesSharedWithYou" ON "User__notesSharedWithYou"."targetId"="User"."id"  LEFT JOIN "note" "User__notesSharedWithYou__note" ON "User__notesSharedWithYou__note"."id"="User__notesSharedWithYou"."noteId" WHERE ( "User"."id" = $1 ) AND ( "User"."id" IN (8) ) -- PARAMETERS: [8]
query: SELECT DISTINCT "distinctAlias"."User_id" as "ids_User_id" FROM (SELECT "User"."id" AS "User_id", "User"."username" AS "User_username", "User__notesYouShared"."targetId" AS "User__notesYouShared_targetId", "User__notesYouShared"."senderId" AS "User__notesYouShared_senderId", "User__notesYouShared"."noteId" AS "User__notesYouShared_noteId", "User__notesYouShared__note"."id" AS "User__notesYouShared__note_id", "User__notesYouShared__note"."text" AS "User__notesYouShared__note_text", "User__notesYouShared__note"."ownerId" AS "User__notesYouShared__note_ownerId" FROM "user" "User" LEFT JOIN "shared_note" "User__notesYouShared" ON "User__notesYouShared"."senderId"="User"."id"  LEFT JOIN "note" "User__notesYouShared__note" ON "User__notesYouShared__note"."id"="User__notesYouShared"."noteId" WHERE "User"."id" = $1) "distinctAlias"  ORDER BY "User_id" ASC LIMIT 1 -- PARAMETERS: [7]
query: SELECT "User"."id" AS "User_id", "User"."username" AS "User_username", "User__notesYouShared"."targetId" AS "User__notesYouShared_targetId", "User__notesYouShared"."senderId" AS "User__notesYouShared_senderId", "User__notesYouShared"."noteId" AS "User__notesYouShared_noteId", "User__notesYouShared__note"."id" AS "User__notesYouShared__note_id", "User__notesYouShared__note"."text" AS "User__notesYouShared__note_text", "User__notesYouShared__note"."ownerId" AS "User__notesYouShared__note_ownerId" FROM "user" "User" LEFT JOIN "shared_note" "User__notesYouShared" ON "User__notesYouShared"."senderId"="User"."id"  LEFT JOIN "note" "User__notesYouShared__note" ON "User__notesYouShared__note"."id"="User__notesYouShared"."noteId" WHERE ( "User"."id" = $1 ) AND ( "User"."id" IN (7) ) -- PARAMETERS: [7]
User {
  id: 8,
  username: 'tim',
  notesSharedWithYou: [ SharedNote { targetId: 8, senderId: 7, noteId: 7, note: [Note] } ]
} User {
  id: 7,
  username: 'joe',
  notesYouShared: [ SharedNote { targetId: 8, senderId: 7, noteId: 7, note: [Note] } ]
}
____start_____
query: SELECT DISTINCT "distinctAlias"."User_id" as "ids_User_id" FROM (SELECT "User"."id" AS "User_id", "User"."username" AS "User_username", "User__notesYouShared"."targetId" AS "User__notesYouShared_targetId", "User__notesYouShared"."senderId" AS "User__notesYouShared_senderId", "User__notesYouShared"."noteId" AS "User__notesYouShared_noteId", "User__notesYouShared__note"."id" AS "User__notesYouShared__note_id", "User__notesYouShared__note"."text" AS "User__notesYouShared__note_text", "User__notesYouShared__note"."ownerId" AS "User__notesYouShared__note_ownerId", "User__notesSharedWithYou"."targetId" AS "User__notesSharedWithYou_targetId", "User__notesSharedWithYou"."senderId" AS "User__notesSharedWithYou_senderId", "User__notesSharedWithYou"."noteId" AS "User__notesSharedWithYou_noteId", "User__notesSharedWithYou__note"."id" AS "User__notesSharedWithYou__note_id", "User__notesSharedWithYou__note"."text" AS "User__notesSharedWithYou__note_text", "User__notesSharedWithYou__note"."ownerId" AS "User__notesSharedWithYou__note_ownerId" FROM "user" "User" LEFT JOIN "shared_note" "User__notesYouShared" ON "User__notesYouShared"."senderId"="User"."id"  LEFT JOIN "note" "User__notesYouShared__note" ON "User__notesYouShared__note"."id"="User__notesYouShared"."noteId"  LEFT JOIN "shared_note" "User__notesSharedWithYou" ON "User__notesSharedWithYou"."targetId"="User"."id"  LEFT JOIN "note" "User__notesSharedWithYou__note" ON "User__notesSharedWithYou__note"."id"="User__notesSharedWithYou"."noteId" WHERE "User"."id" = $1) "distinctAlias"  ORDER BY "User_id" ASC LIMIT 1 -- PARAMETERS: [7]
query: SELECT "User"."id" AS "User_id", "User"."username" AS "User_username", "User__notesYouShared"."targetId" AS "User__notesYouShared_targetId", "User__notesYouShared"."senderId" AS "User__notesYouShared_senderId", "User__notesYouShared"."noteId" AS "User__notesYouShared_noteId", "User__notesYouShared__note"."id" AS "User__notesYouShared__note_id", "User__notesYouShared__note"."text" AS "User__notesYouShared__note_text", "User__notesYouShared__note"."ownerId" AS "User__notesYouShared__note_ownerId", "User__notesSharedWithYou"."targetId" AS "User__notesSharedWithYou_targetId", "User__notesSharedWithYou"."senderId" AS "User__notesSharedWithYou_senderId", "User__notesSharedWithYou"."noteId" AS "User__notesSharedWithYou_noteId", "User__notesSharedWithYou__note"."id" AS "User__notesSharedWithYou__note_id", "User__notesSharedWithYou__note"."text" AS "User__notesSharedWithYou__note_text", "User__notesSharedWithYou__note"."ownerId" AS "User__notesSharedWithYou__note_ownerId" FROM "user" "User" LEFT JOIN "shared_note" "User__notesYouShared" ON "User__notesYouShared"."senderId"="User"."id"  LEFT JOIN "note" "User__notesYouShared__note" ON "User__notesYouShared__note"."id"="User__notesYouShared"."noteId"  LEFT JOIN "shared_note" "User__notesSharedWithYou" ON "User__notesSharedWithYou"."targetId"="User"."id"  LEFT JOIN "note" "User__notesSharedWithYou__note" ON "User__notesSharedWithYou__note"."id"="User__notesSharedWithYou"."noteId" WHERE ( "User"."id" = $1 ) AND ( "User"."id" IN (7) ) -- PARAMETERS: [7]
User {
  id: 7,
  username: 'joe',
  notesYouShared: [ SharedNote { targetId: 8, senderId: 7, noteId: 7, note: [Note] } ],
  notesSharedWithYou: [ SharedNote { targetId: 7, senderId: 8, noteId: 8, note: [Note] } ]
}
{
    "id": 7,
    "username": "joe",
    "notesYouShared": [
        {
            "targetId": 8,
            "senderId": 7,
            "noteId": 7,
            "note": {
                "id": 7,
                "text": "hello tim",
                "ownerId": 7
            }
        }
    ],
    "notesSharedWithYou": [
        {
            "targetId": 7,
            "senderId": 8,
            "noteId": 8,
            "note": {
                "id": 8,
                "text": "hello jeo",
                "ownerId": 8
            }
        }
    ]
}
```

## Feedback

- ⚠ relations의 depth는 . 으로 가능

- ⚠ object depth가 깊은 객체는 console.log 시 JSON.stringify로 해결~

## 참조

- [https://youtu.be/ao4C9dJO7n0](https://youtu.be/ao4C9dJO7n0)
