---
title: topologySort 01
---

# 위상 정렬

## 위상 정렬 개념

목적  
 - 방향 그래프에서, 일의 순서를 나열하는것  
 - 일의 선행 순서는 지켜진다. 평행한 일의 순서는 여러가지가 나올 수 있다. 따라서 위상정렬은 여러가지 가능  


제한  
 - V+E 시간 복잡도  
 - 싸이클이 있는 그래프는 불가능하다. ( 싸이클 유무도 확인 가능 )  
 inDegree(진입 차수 )가 0 이 되면서 큐가 종료되고, 모든 정점은 방문하지 않게 된다. = 싸이클이 있어 위상정렬 불가능

선행 개념  
 - 방향그래프에선 하나의 정점에 들어오는 간선, 나가는 간선이 있다.  
 - 들어오는 간선의 수 = 진입차수 = indegree  
 - 나가는 간선의 수 = 진출 차수 = outdegree

알고리즘

    1. 진입 차수가 0인 정점(즉, 들어오는 간선의 수가 0)을 선택
    - 진입 차수가 0인 정점이 여러 개 존재할 경우 어느 정점을 선택해도 무방하다.
    - 초기에 간선의 수가 0인 모든 정점을 큐에 삽입

    2. 선택된 정점과 여기에 부속된 모든 간선을 삭제
    - 선택된 정점을 큐에서 삭제
    - 선택된 정점에 부속된 모든 간선에 대해 간선의 수를 감소

    3. 위의 과정을 반복해서 모든 정점이 선택, 삭제되면 알고리즘 종료

예제문제 https://www.acmicpc.net/problem/2252

```python
N, M = map(int, input().split())
graph = [[] for _ in range(N+1)]  # 인접 리스트
outDeg = [0 for _ in range(N+1)]  # 0 사용 X
for _ in range(M):
    u, v = map(int, input().split())
    graph[u].append(v)
    outDeg[v] += 1
q = []
for i in range(1, N+1):  # 진입차수 0 인경우 q에 넣는다.
    if outDeg[i] == 0:
        q.append(i)
# 모든 정점 순회 , 다 돌기전에 빈큐가 있다면 싸이클이 있는것!
for i in range(1, N+1):
    if not q:
        print(f"싸이클 생성")
        break
    # 큐에서 인접노드의 진입차수를 제거 후 , 0이된 노드를 큐에 넣는다.
    now = q.pop(0)
    print(f"{now} ", end="")
    for nxt in graph[now]:
        outDeg[nxt] -= 1
        if outDeg[nxt] == 0:
            q.append(nxt)
```

## 참조

https://gmlwjd9405.github.io/2018/08/27/algorithm-topological-sort.html#:~:text=%EB%82%98%EC%97%B4%ED%95%98%EB%8A%94%20%EA%B2%83-,%EC%9C%84%EC%83%81%20%EC%A0%95%EB%A0%AC(Topological%20Sort)%EC%9D%98%20%ED%8A%B9%EC%A7%95,(Topological%20Order)%EB%9D%BC%20%ED%95%9C%EB%8B%A4.

https://m.blog.naver.com/ndb796/221236874984
