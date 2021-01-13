---
title: Redis는 왜 사용하는가?
---

## Redis의 사용 용도

- Message Queue
- Shared Memory
- Remote Dictionary

## Redis의 특징

### 1. Key-Value Store

레디스는 거대한 맵(Map) 데이터 저장소  
Key와 value가 매핑된 단순한 맵 데이터 저장소로서 데이터를 레디스에 쉽고 편하게 읽고 쓸 수 있음.  
장점은 익히기 쉽고 직관적임.  
단점은 Key-value 형태로 저장된 데이터를 레디스 자체내에서 처리하는 것이 어렵다는 것.

### 2. 다양한 데이터 타입

리스트, 배열 형식의 데이터 처리에 특화됨 ( 리스트 형 데이터의 입력과 삭제가 MySQL보다 10배 정도 빠르다. )

value값으로 문자열, 리스트, set, sorted set, hash 등 여러 데이터 형식을 지원함.

### 3. Persistence

Redis는 데이터를 disk에 저장할 수 있음.  
따라서 Redis는 서버가 셧다운된 후에 재시작 하더라도 disk에 저장해놓은 데이터를 다시 읽어서  
 데이터가 유실되지 않음.

redis의 데이터를 disk에 저장하는 방식은 snapshot, AOF 방식이 있다.
스냅샷 기능을 이용하여 메모리의 내용을 \*.rdb 파일로 저장하여 해당 시점의 데이터를 복구할 수 있다.

AOF는 redis의 모든 write/update 연산 자체를 모두 log 파일에 기록하는 형태이다. 서버가 재시작할 시
write/update를 순차적으로 재실행, 데이터를 복구합니다.

레디스 공식문서에서의 권장사항은 RDBMS의 rollback 시스템같이 두 방식을 혼용해서 사용하는 것.
주기적으로 snapshot으로 벡업하고 다음 snapshot까지의 저장을 AOF 방식으로 수행하는 것.

### 4. ANSI C로 작성

C언어로 작성되어 Java와 같이 가상머신 위에서 동작하는 언어에서 발생하는 성능 문제에 대해 자유로움.  
곧바로 기계어로 동작하지 않고 어떤 가상의 머신 위에서 인터프리터된 언어로 가동하는 경우에는

가비지컬렉션(Garbage Collection) 동작에 따른 성능 문제가 발생할 수 밖에 없다.

### 5. 서버 측 복제 및 샤딩을 지원

## Redis 단점

- **메모리 파편화가 발생하기 쉽다.**
  메모리를 2배로 사용한다.
  Redis는 싱글 쓰레드이다.

그래서 스냅샷을 뜰 때 자식 프로세스를 하나 만들낸 후 새로 변경된 메모리 페이지를 복사해서 사용한다.
Redis는 copy-on-write 방식을 사용한다.
보통 Redis를 사용할 때는 데이터 변경이 잦기 때문에 실제 메모리 크기만큼 자식 프로세스가 복사하게 된다.
그래서 실제로 필요한 메모리 양보다 더 많은 메모리를 사용하게 된다.

- **싱글 쓰레드이기 때문에...**
  이로 인해서 긴 Transaction이 들어 오면, 그 Tx를 처리하기 위해서 다른 request를 처리 못하는 현상이 발생한다.

대표적으로 Flushall이나 Keys는 List 전체를 Scan하는 구조로, 100만개 처리시 1초, 1000만개 10초,1억개 100초가 소요된다.

- 이를 예방하기 위해서, 데이타를 전체 하나의 Collection에 넣는 것이 아니라 여러개의 Collection에 나눠서 처리하는 방안이 좋다. 각 Collection당 보통 10,000개 정도의 데이타를 저장하는 것이 좋다.

## 참조

[https://yjam.tistory.com/50](https://yjam.tistory.com/50)
[https://bcho.tistory.com/829](https://bcho.tistory.com/829)
[https://www.infoworld.com/article/3063161/why-redis-beats-memcached-for-caching.html](https://www.infoworld.com/article/3063161/why-redis-beats-memcached-for-caching.html)
[https://genesis8.tistory.com/189](https://genesis8.tistory.com/189)
