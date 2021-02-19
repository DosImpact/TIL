---
title: BFS | Graph | DFS | Tree 02
---

## Union - Find

목적 : 그래프의 싸이클 찾기 , 그래프의 집합 연산

## MST ( 최소 스패닝 트리 )

목적 : 최소비용으로만 모든 노드를 연결하자

## 크루스칼 알고리즘

목적 : MST를 구하는 알고리즘. 1. 가중치가 가장 적은 간선부터 연결하자 ( 단, 싸이클이 나오면 skip )
( 유니온 파인드 사용 )

## 프림 알고리즘

목적 : MST를 구하는 알고리즘. 1. 임의의 정점으로부터 시작해서, 현재 부분 그래프가 가진 모든 간선정보를 추합해서
가장 적은 가중치의 간선,정점을 하나씩 붙여나가자.
( BFS , 우선순위 큐 사용 )

---

## 다익스트라 알고리즘

https://m.blog.naver.com/ndb796/221234424646
목적 : 한 정점으로부터 모든 정점까지 최단거리를 어떻게 구하지 ? ( 양의 간선만 )

알고리즘 :
( DP 사용 ) 최단거리는 여러개의 최단거리 경로를 통해 구할 수 있다. - 그래서 노드의 방문 순서는 최단거리로 결정짓는다.

    1. 시작점 K 으로부터 모든 정점의 거리를 INF로 두는 1차원 배열 dist 를 만든다.
    - Dist[ N ]  : K에서 N까지 가는 최단거리
    2. K의 인접노드를 방문하여 최단 거리를 갱신한다.
    3. 큐에서 노드 NOW ( 거리가 작은 순으로 우선순위 큐에 넣는다) 꺼내어 인접노드 NXT 를 탐색.
    K에서 NXT 노드로 바로가는 것과
    K에서 NOW를 거쳐 NXT로 가는것을 비교해서 짧은 거리로 갱신한다.
     ( dist [ nxt ]  vs dist [ now ] + d [ now ][ nxt ] )

시간복잡도 :
정점 개수가 V, 간선 개수가 E일 때 기본적인 최적화를 거치면 O(ElogV)의 시간복잡도를 갖습니다.

## 벨만 포드 알고리즘

https://m.blog.naver.com/kks227/220796963742
목적 : 한 정점으로부터 모든 정점까지 최단거리를 어떻게 구하지 ? ( 양의 간선 + 음의 간선 )

## 프로이드 와샬 알고리즘

https://m.blog.naver.com/ndb796/221234427842
목적 : 모든 정점으로부터 모든 정점까지 최단거리를 어떻게 구하지 ?

문제

    - 최소 스패닝 트리 https://www.acmicpc.net/problem/1197
    특이점: 유니온 파인드 및 MST 정석


    - 친구 네트워크 https://www.acmicpc.net/problem/4195
    특이점 : 유니온 파인드에서, 부모 노드는 자식의 갯수를 트래킹 해야함
    Parent 배열처럼, 자식수 배열을 초기값1로 만들어주고, union 발생시마다 부모 노드에게 현재 나의 자식정보를 추가해준다.
    단, union이 무효일때 중복해서 자식 정보를 더하지 않도록 한다.

```py
        def union(x: int, y: int):
            px, py = getP(x), getP(y)
            if px == py:
                return
            if px > py:
                parent[px] = py
                childNum[py] += childNum[px]
            else:
                parent[py] = px
                childNum[px] += childNum[py]

```

    - 별자리 만들기 https://www.acmicpc.net/problem/4386
    특이점 : MST 문제 , 크루스칼 혹은 프림 알고리즘 해결 가능,
    별들 사이 거리 = 가중치 이므로 데이터 전처리 필요

    - 우주신과의 교감 https://www.acmicpc.net/problem/1774
    특이점 : MST 문제, 단 초기 union을 미리 몇 개 해야함, 이 가중치를 빼고 계산

    - 다리만들기 https://www.acmicpc.net/problem/17472
    특이점 : 힘든 구현량, BFS/DFS 단지번호붙이기 + 크루스칼 + edges 조건


    ---

    - 최단경로 https://www.acmicpc.net/problem/1753
    특이점 : 다익스트라 기본문제

```

```
