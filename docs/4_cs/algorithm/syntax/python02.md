---
title: Algo for Python - 시퀀스 자료구조
---

## 리스트 만들기 (range 객체 사용하기.)

```py
a = [] ## 혹은 a = list()
b = list(range(10)) ## 0부터 9까지 range 객체 만들어 list로 변환
print(b)
c = list(range(1, 5)) ## [1, 2, 3, 4]
print(c)
c = list(range(1, 11, 2)) ## [1, 3, 5, 7, 9] ## 1부터 10까지 2씩증가 | 11포함 안됨
print(c)
c = list(range(10, 0, -1)) ## [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] 이 역시 0은 미 포함.
print(c)
## for문으로 문자열 리스트 -> 정수 리스트 변환 및 합
nlist = [int(x) for x in ['10', '20', '30']]
print(sum(nlist))
```

## 한번에 출력하기 => \*을 쓰면 일자로 나옴.

print(\*[1, 2, 3, 4])  ## 1 2 3 4

## 리스트 CRUD

s = [2, '2', (4, 5), ['a', 'b'], {4, 5}]

## CRUD

## C

## R
s.index((4, 5))

## U

## U - append
s.append(['c', 'd'])

## U - extends / + 연산자
a = [1, 2, 3, 4]

print(a)
a += [6, 7, 8, ]
print(a) ##[1, 2, 3, 4, 6, 7, 8]
a += list("STRING") ##
print(a) ##[1, 2, 3, 4, 6, 7, 8, 'S', 'T', 'R', 'I', 'N', 'G']

## D
s.clear()
s.pop(0)
s.remove(['a', 'b'])

#### 람다식 | map ( 각원소를 2씩 곱할수있다. ) | filter (배열에서 짝수인경우만 퉤)

```python
## 람다식 | map ( 각원소를 2씩 곱할수있다. ) | filter (배열에서 짝수인경우만 퉤)
## (x,y) => x+y
## lamda x,y: x+y
def g(x): return x**2
(a, b, c) = map(g, [1, 2, 3])  ## 람다 없이 각 원소 2제곱
print(a, b, c)
(a, b, c) = map(lambda x: x*2, [1, 2, 3])  ## 람다로, 각 원소 2곱
print(a, b, c)
res = list(map(lambda x: x*2, [1, 2, 3]))  ## 람다로, 각 원소 2곱
print(res)
wannaEven = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
res = list(filter(lambda e: e % 2 == 0, wannaEven))  ## filter오브젝트에서 list로 반환하기.
print(res)
```

## enumerate()

```python
var = ['a', 'b', 'c']
for i, val in enumerate(var):
print(i, val)
```

## 2차원 배열

```python
a = [[10, 20], [30, 40], [50, 60]]

for x, y in a:  ## 리스트 자체를 받아서 사용
    print(x, y)

for i in a:  ## 리스트를 원소를 2번꺼내 사용
    for j in i:
        print(j, end=' ')

for i in range(len(a)):  ## 길이만큼 사용
    for j in range(len(a[i])):
        print(a[i][j])

for i, x in enumerate(a):
    for j, y in enumerate(x):
        print(a[i][j])

for i, x in enumerate(a):
    for j, y in enumerate(x):
        print(y)
```

## 반복문으로 2차원 | 배열 만들기

```python
a = ['x' for i in range(3)]
print(a) ## ['x', 'x', 'x']
a = [[0, 0, 0] for i in range(3)]
print(a) ## [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
a = [[0 for i in range(3)] for i in range(3)]
print(a) ## [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
## for문으로 리스트 완성하기
nlist = [int(x) for x in ['10', '20', '30']]
print(sum(nlist))
```

## 튜플 만들기 ( 튜플은 읽기 전용 리스트 )

```python
c = tuple(range(0, 10)) ## range to tuple
print(c) ## print (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
print(list(c)) ## tuple to list
```

## 시퀀스 활용.

- 시퀀스 자료형이란: 리스트, 튜플, range, string, bytes, bytearray = > 슬라이싱 등등 가능!

#### 시퀀스 존재성.

```python
a = [0, 1, 2, 'a', "hello", True, [0, 'dos', True], (0, 'impact', False)]
print(1 in a) ## 참
print(10 in a) ## 거짓
print('a' in a) ## 참
print(True in a) ## 참
print(1 not in a) ## 거짓
print(10 not in a) ## 참
print('a' not in a) ## 거짓
print(True not in a) ## 거짓
print('ll' in a[4]) ## 참
print('dos' in a[6])  ## 참
print('do' in a[6])  ## 거짓
print('do' in a[6][1])  ## 참
print('impact' in a[7])  ## 참
print('act' in a[7])  ## 거짓
print('act' in a[7][1])  ## 참
```

## 시퀀스 with => len + 곱하기 del

```python
a = [1, 2, 3]
b = [4, 5, 6, 7, 8, 9, 10]
st = 'hello'
print(len(st)) ## 5
print(a+b) ## [1, 2, 3, 4, 5, 6]
print(a*2) ## [1, 2, 3, 1, 2, 3]
print(a[-1]) ## 3 (뒤에서 첫번째)
del a[1] ## 1번째 인덱스 삭제
print(a) ## [1, 3]
```

## 시퀀스 with => slice [][:]

```python
print(b[0:2]) ## [4, 5]
print(b[0:]) ## [4, 5, 6, 7, 8, 9, 10]
print(b[0:-1]) ## [4, 5, 6, 7, 8, 9]
print(b[0:-1:2]) ## 2씩 증가하면서 가져오기 [4, 6, 8]
print(b[::2]) ## [4, 6, 8, 10] 짝수번 인덱스만 가져오기.
print(b[::-1]) ## 뒤 집기 [10, 9, 8, 7, 6, 5, 4]
print(b[1::] + b[0:1:]) ## 로테이션 [5, 6, 7, 8, 9, 10, 4]
```

## join 함수 : 리스트사이사이 특정 문자열을 넣고, 하나의 문자열로 만들어준다. ( splite와 반대대는 개념)

```py
var = ['A', 'B', 'C']
print(''.join(var))  ## ABC
print('|'.join(var))  ## A|B|C
```

## 딕셔너리 사용(obj)

## 딕셔너리 key 또는 values 순회하기

obj = {"atype": [1, 2, 3], "btype": [4, 5]}
for i in obj.values():
    print(i)
[1, 2, 3]
[4, 5]

obj = {"atype": [1, 2, 3], "btype": [4, 5]}
for i in obj:
    print(i)
atype
btype

## key 값으로 set 은 불가능 하다.
s = {
    1: [1, 2, 3],
    '2': (1, 2),
    (1, 3): 0,
   ## {0}: 2
}
for key in s.values():
    print(key)

ㄴ

```python
x = {'base': 1, 'dos': 20}
print(x['base'])
## 피보나치 + dp for문 | dp 재귀
d = {}
def dp(n):
    if(n <= 1):
        return n
    if((n) in d):
        return d[(n)]
    d[n] = dp(n-1)+dp(n-2)
    return d[n]
var = int(input())
d[0] = 0
d[1] = 1
for i in range(2, var+1):
    d[i] = d[i-1] + d[i-2]
print(dp(var))
```

## python - defaultdict ( 원래 dict 에서는 없는 key를 참조하면 애러나 나는데, defaultdict은 그러지 않아 )

defaultdict

> > > from collections import defaultdict
> > > d_dict = defaultdict(int)
> > > d_dict["a"]
> > > 0
> > > d_dict
> > > defaultdict(<class 'int'>, {'a': 0})
> > > 심지어 미리 선언하지 않은 key에 값을 더해주는 것도 가능하다.
> > > d_dict = defaultdict(int)
> > > d_dict["a"] += 10
> > > 10
> > > d_dict
> > > defaultdict(<class 'int'>, {'a': 10})
> > > 다음과 같이 lambda 식을 사용해 원하는 초기값을 지정할수도 있다.
> > > d_dict = defaultdict(lambda: 'default value')
> > > d_dict["a"]
> > > 'default value'

## python - 덱 ( 큐대신 댁을 쓰기. 큐는 시퀀서가 아니다.) | 로테이션도 추가되어 있음.

```python
from collections import deque

dq = deque([1, 2, 3, 4])

print(dq[0])  ## front
print(dq[-1])  ## back
print(len(dq))  ## size
dq.append(5)  ## push_back
dq.appendleft(6)  ## push_front
print(dq.pop())  ## pop_back
print(dq.popleft())  ## pop_front
dq.rotate()
print(list(dq))


```

## python - 덱 vs 리스트 - 덱은 pop 에 인덱스를 적을 수 없다.

arr = []
## 앞에서 넣고 뺴고
arr.pop(0)
arr.insert(0, 1)
## 뒤에서 넣고 빼고
arr.pop()
arr.append(1)

dq = deque()
## 앞에서 넣고 뺴고
dq.appendleft(1)
dq.popleft()
## 뒤에서 넣고 빼고
dq.append(1)
dq.pop()

## set 함수 정리 (존재성 사용법은 동일)

data = set([1, 2, 3])
print(data)  ## {1, 2, 3}
data = set("hello")
print(data)  ## {'h', 'e', 'l', 'o'}
s1 = set([1, 2, 3, 4, 5, 6])
s2 = set([4, 5, 6, 7, 8, 9])
## 교집합 개념 &
print(s1 & s2)  ## {4, 5, 6}
print(s1.intersection(s2))  ## {4, 5, 6}
## 합집합
print(s1 | s2)  ## {1, 2, 3, 4, 5, 6, 7, 8, 9}
print(s1.union(s2))  ## {1, 2, 3, 4, 5, 6, 7, 8, 9}
## 차집합
print(s1-s2)  ## {1, 2, 3}
print(s2-s1)  ## {8, 9, 7
## CRUD
s1.add(7)
print(s1)  ## {1, 2, 3, 4, 5, 6, 7}
s1.update([7, 8, 9])  ## {1, 2, 3, 4, 5, 6, 7, 8, 9}
print(s1)
s1.remove(1)
print(s1)  ## {2, 3, 4, 5, 6, 7, 8, 9}

## 우선순위 큐 사용하기. heappush,heappop,heapify

```python
import heapq

## 힙 만들기 push = logn && n개 원소 = n => 총 시간 복잡도 : nlogn
h = []  ## 우선순위 큐로 사용될 리스트
heapq.heappush(h, (3, "Go to home"))  ## 두번쨰 인자는 (우선순위,값)
heapq.heappush(h, (10, "Do not study"))
heapq.heappush(h, (1, "Enjoy!"))
heapq.heappush(h, (4, "Eat!"))
heapq.heappush(h, (7, "Pray!"))
print(h)
## 힙 꺼내기 nlogn
print(heapq.heappop(h))  ## 우선순위 순서대로 나온다. 1 -> 3 -> 4 -> 7 -> 10
print(heapq.heappop(h))
print(heapq.heappop(h))
print(heapq.heappop(h))
print(heapq.heappop(h))
## 힙 만들기 by 이미  만들어진 리스트 -> 힙 정렬 : O(n) 걸림
hlist = [(7, 'kdy'), (2, 'dos'), (4, 'hello')]
heapq.heapify(hlist)
print(heapq.heappop(hlist))
print(heapq.heappop(hlist))
print(heapq.heappop(hlist))


import heapq

arr = [4, 1, 5, 3, 8, 6, 3, 9953, 12, 43, 555]
print(arr)  ## [4, 1, 5, 3, 8, 6, 3, 9953, 12, 43, 555]
heapq.heapify(arr)
print(arr)  ## [1, 3, 3, 4, 8, 6, 5, 9953, 12, 43, 555]
print(arr[0])  ## 가장 작은 원소 보장, 그외는 아니다.
heapq.heappush(arr, 2)
print(heapq.heappop(arr))  ## 1
print(heapq.heappop(arr))  ## 2
print(heapq.heappop(arr))  ## 3
print(heapq.heappop(arr))  ## 3
print(heapq.heappop(arr))  ## 4
print(heapq.heappop(arr))  ## 5
print(heapq.heappop(arr))  ## 6
print(arr)  ## [8, 12, 555, 9953, 43]
```
