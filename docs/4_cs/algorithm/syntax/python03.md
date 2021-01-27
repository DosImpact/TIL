---
title: Algo for Python - 시퀀스 알고리즘
---

## sum,min,max,sorted | 합,최소,최대,정렬

```python
var = [1, 2, 3, 4, -1, 100]
print(sum(var))  ## 109
print(min(var))  ## 01
print(max(var))  ## 100
print(sorted(var))  ## [-1, 1, 2, 3, 4, 100]
print(sorted(var, reverse=True))  ## [100, 4, 3, 2, 1, -1]

var = (1, 2, 3, 4, -1, 100)
print(sum(var))  ## 109
print(min(var))  ## 01
print(max(var))  ## 100
print(sorted(var))  ## [-1, 1, 2, 3, 4, 100]

var = "EABCD"
## print(sum(var))  ##TypeError: unsupported operand type(s) for +: 'int' and 'str'
print(min(var))  ## A
print(max(var))  ## E
print(sorted(var))  ## ['A', 'B', 'C', 'D', 'E']
```

## 리스트
C | append, extend 
R | index count
U | sort reverse insert
D | remove pop

```python

a = [50, 20, 3, 4, 5]
a.append(6)
print(a)  ## [50, 20, 3, 4, 5, 6]
a.extend([7, 8])
print(a)  ## [50, 20, 3, 4, 5, 6, 7, 8]
a.sort()
print(a)  ## [3, 4, 5, 6, 7, 8, 20, 50]
a.sort(reverse=True)
print(a)  ## [50, 20, 8, 7, 6, 5, 4, 3]
a.reverse()
print(a)  ## [3, 4, 5, 6, 7, 8, 20, 50]
idx = a.index(20)  ## 현재 20의 위치는 6번째.
print(idx)  ## 6
a.insert(idx, 21)  ## 20위치가 하나 밀리고, 21이 들어감
print(a)  ## [3, 4, 5, 6, 7, 8, 21, 20, 50]
a.remove(21)  ## 21 찾아서 제거
print(a)  ## [3, 4, 5, 6, 7, 8, 20, 50]
a.pop()
a.pop()
print(a)  ## [3, 4, 5, 6, 7, 8]
print([3, 3, 3, 2, 2, 1].count(3))  ## 3
```

## lamba - find -> result (index)

```python
test_list = [11, 33, 44, 33, 66, 77]
res_index = [i for i in range(len(test_list)) if test_list[i] == 33]
print(res_index)  # [1,3] 33은 1번 3번 인덱스에 존재

test_list = ["11", "33", "44", "33", "66", "77"]
res_index = [i for i in range(len(test_list)) if '4' in test_list[i]]
print(res_index)  # [2] 4가 들어간 원소는 2번이다. test_list
```

## labda - find -> result ( value )

```python
test_list = ["11", "33", "44", "33", "66", "77"]

res_index = [test_list[i]
             for i in range(len(test_list)) if '4' in test_list[i]]
print(res_index)  # ['44'] 4가 들어간 원소 '44' 을 반환

res_index = [test_list[i]
             for i in range(len(test_list)) if 'kk' in test_list[i]]
print(res_index)  # [] 'kk'가 들어간 원소가 없다, [] 반환
```

## set 을 이용한 unique 중복제거 ( set으로 바꾸면 끝!)

```python
var = [5, 1, 1, 2, 2, 2, 3, 3, 3, 3]
print(set(var))  ## 내부적으로 obj인듯 {1, 2, 3, 5}
var = list(set(var))
var.sort()
print(var)  ## unique 중복제거 && 정렬 [1, 2, 3, 5]
```

## deque

- rotate 사용가능

```python
from collections import deque
import sys

dq = deque(['.', 'c', '.', 'c'])
print(dq)  ## deque(['.', 'c', '.', 'c'])

dq.rotate(1)
print(dq)  ## deque(['c', '.', 'c', '.'])

dq.rotate(-1)
print(dq)  ## deque(['.', 'c', '.', 'c'])
```

## 순열 조합 정리 permutations combinations import itertools

```python
import itertools
pool = ['A', 'B', 'C']
# 결과는 튜플로 반환된다. -> join을 통해 하나의 문자열로 뭉처줄 수 있다.
# [('A', 'B', 'C'), ('A', 'C', 'B'), ('B', 'A', 'C'), ('B', 'C', 'A'), ('C', 'A', 'B'), ('C', 'B', 'A')]
print(list(itertools.permutations(pool)))

#['ABC', 'ACB', 'BAC', 'BCA', 'CAB', 'CBA']
print(list(map(lambda x: "".join(x), itertools.permutations(pool))))

#['ABC', 'ACB', 'BAC', 'BCA', 'CAB', 'CBA']
print(list(map(''.join, itertools.permutations(pool))))  # 3개의 원소로 수열 만들기

#['AB', 'AC', 'BA', 'BC', 'CA', 'CB']
print(list(map(''.join, itertools.permutations(pool, 2))))  # 2개의 원소로 수열 만들기

# [('A', 'B'), ('A', 'C'), ('B', 'C')]
print(list(itertools.combinations(pool, 2)))

# ['ABC']
print(list(map(''.join, itertools.combinations(pool, 3))))  # 3개의 원소로 수열 만들기

#['AB', 'AC', 'BC']
print(list(map(''.join, itertools.combinations(pool, 2))))  # 2개의 원소로 수열 만들기
```

## 순열 조합 정리 2  permutations combinations import itertools

```python
from itertools import permutations, combinations
pool = [1, 2, 3]
## 순열 전체원소
res = list(permutations(pool))
for re in res:
    for r in re:
        print(r, end='')
    print()
"""
123
132
213
231
312
321
"""
## 순열 2개씩 ( 중복 안됨 )
res = list(permutations(pool, 2))
for re in res:
    for r in re:
        print(r, end='')
    print()
"""
12
13
21
23
31
32
"""

## 조합 2개씩 ( 중복 안됨 )
res = list(combinations(pool, 2))
for re in res:
    for r in re:
        print(r, end='')
    print()
"""
12
13
23
"""
```
