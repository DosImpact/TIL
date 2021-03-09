---
title: sort 01
---

## 문제유형 - 커스텀 정렬 함수

    - 가장 큰 수 : https://programmers.co.kr/learn/courses/30/lessons/42746
    특이점 : 예외처리 - 뺀앞에 0 이오는 경우라면 ?
    특이점 : u,v 를 정렬하므로써 전체 답을 얻을 수 있다는 발상 어려움
    또한, 정렬 함수 만들때 발상 어려움

# 퀵 소트 구현하기 by python

    - 하지만 그냥 파이썬의 C++로 짜여진 sort 쓰는것이 빠르다.
    - 패킹 언패킹 등 파이썬의 작업때문에 오히려 더 느리다.

```

res = [4, 3, 2, 1, 6, 7, 8, 9]

def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr)//2]
    ltn, eqn, gtn = [], [], []
    for num in arr:
        if num < pivot:
            ltn.append(num)
        elif num > pivot:
            gtn.append(num)
        else:
            eqn.append(num)
    return quicksort(ltn) + eqn + quicksort(gtn)

print(quicksort(res))

```
