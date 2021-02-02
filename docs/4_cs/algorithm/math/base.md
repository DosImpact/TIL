---
title: 수학 기본 개념 정리
---

## 1. 약수, 배수, 소인수

### 1.1 약수 구하기

N의 약수구하기 -> 루트 N까지만 for문을 돌면서, N을 나눈 나머지가 0인것들의 집합

### 1.2 A*B = L*G

```
GCD(a,b) = GCD(b,a%b)
```

### 1.3 소인수 분해하기

```py
N = int(input())

# N을 2부터 나눠본다 , 나눌때 해당 소수로 계속 나눈다. , N이 가지는 가장큰 소수는 루트N 이하 이다. -> 루트N 까지만 for문

for i in range(2, N+1):
    if i*i > N:
        break
    # N이 i로 나누어 떨어지면, 계속 나누기
    while(N % i == 0):
        print(i)
        N = int(N/i)
if N > 1:
    print(N)
```

## 2. 진법

- 1.십진수를 16진수로 변환 하기
- 2.해당 주어진 숫자를 16진수로 읽어볼까?

```py
print(10)  # 10
print(hex(10))  # 0xa ( 10진수 -> 16진수 변환 )
print(int("10", 16))  # 16 ( 해당 숫자 ( 어떤 진수인지는 모름 ) -> 16진수로 보라 등. )
```

- 10진수에서 2진수,8진수,12진수,16진수 등으로 바꾸는 원리 -> 계속 나눠라 0이 될때 까지.

```py
def cal(a, b):
    s = 0
    while a > 0:
        s += a % b
        a = a//b
    return s

for i in range(1000, 10000):
    a = cal(i, 10)
    b = cal(i, 12)
    c = cal(i, 16)
    if a == b == c:
        print(i)

```

## 3 소수

- 3.1 (루트N) : 으로 수소인지 아닌지 판별

2~루트N 까지 for문을 돌면서 하나라도 나누어 떨어진다면 소수가 아니다.!

- 3.2 (loglogN) : 특정 범위 내 숫자들이 소수인지 아닌지 판별

```
- 에라토스테네스의 체
- 2~100까지라면 -> 2부터 시작 | 2소수저장 | 2의 배수 지우기 | 11*11 > 100 이므로 11까지만 하면 됨..!
- 11*11까지만 해도 되는데, check배열을 돌면서 check가 0인 녀석들을 다시 모아야 한다.!
```

```py
pn = []
check = [0 for _ in range(M+1)]
for i in range(2, M):
    if i*i > M:
        break
    if check[i] == 0:
        pn.append(i)
        for j in range(i*2, M+1, i):
            check[j] = 1
```

- 골드바흐의 추측

```py
import sys

def input(): return sys.stdin.readline()

END = 10\**6
Check = [0 for _ in range(END+1)]
for i in range(2, END+1):
    if i*i > END:
        break
    if Check[i] == 0:
        for j in range(i\*i, END+1, i):
            Check[j] = 1
while(True):
    N = int(input())
    if N == 0:
        break
    for i in range(2, N+1):
        if Check[i] == 0 and Check[N-i] == 0:
            print(f"{N} = {i} + {N-i}")
            break
```

- 팩토리얼 0의 개수 - 100! = 1 _ 2 _ 3* ….. *100 = 다 각각 소인수 분해를 하면 -> 결국 0을 만드는건 2와 5뿐 -> 5는 항상 2보다 적기떄문에 -> 5의 갯수만 구하기

```py
N = int(input())  # 1 ~ N 까지 100
i = 5
Ans = 0
while(i <= N):
    Ans += int(N / i)
    i = i\*5  # fb) i가 5의 배수씩 커지는 상황
print(Ans)

-조합 0의 개수 - 조합은 2와 5의 갯수가 어떻게 될지 모르므로 직접 다 구해본다.!

```
