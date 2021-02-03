---
title: Numpy 기본사용법
---

# Numpy 기본사용법

## 차원, shape

```py
import numpy as np

# 1차원, shape (3,)
array1 = np.array([1,2,3])
# 2차원, (2,3)
array2 = np.array([[1,2,3],[2,3,4]])


print(f"{array1} {array1.shape}  {array1.ndim}") #
print(f"{array2} {array2.shape}  {array2.ndim} {array2.dtype}")

```

## 타입

- 메모리 절약을 위해 8bit int 등으로 변환

```py
print(f"{array2.dtype}")
```

### Create

```py
list1 = [1,2,3]
print(f"list1 {list1}")
print(f"list1 type {type(list1)}")
array1 = np.array(list1)
print(f"array1 {array1}")
print(f"array1 type {type(array1)}")

```

## 타입 변환

```py
array_int1 = np.array([1,2,3])
array_float = array_int1.astype('float64')
print(f"array_float dtype : {array_float.dtype}")

array_int2 = array_float.astype('int16')
print(f"array_int2 dtype : {array_int2.dtype}")
```

## Sum

```py
array3 = np.array([[1,2,3],[4,5,6]])
print(array3.sum())  # 차원을 1로 축소하면서 더함
print(array3.sum(axis=0)) # 아래 방향으로 더함
print(array3.sum(axis=1)) # 오른쪽 뱡향으로 더함
```

## arange, zeros, ones

```py
# 0~10 까지 1차원 배열 생성
arange1 = np.arange(10)
print(arange1,arange1.dtype,arange1.shape)
# 3,2 shape를 가지는 배열 0 으로 초기화
zeros1 = np.zeros((3,2),dtype='int32')
print(zeros1,zeros1.dtype,zeros1.shape)
# 3,2 shape를 가지는 배열 1로 초기화 ( dtype은 기본 float )
ones1 = np.ones((3,2))
print(ones1,ones1.dtype,ones1.shape)
```

```py
# 1차원 > 2차원 변환
arange2 = arange1.reshape(2,5)
print('arange2\n',arange2)
# 1차원 > 2차원 변환 , 1축의 크기를 가변적
arange3 = arange1.reshape(-1,5)
print('arange3\n',arange3)
# 1차원 > 2차원 변환 , 1축 5행,2축의 크기를 가변적
arange4 = arange1.reshape(5,-1)
print('arange4\n',arange4)
# 2차원 > 1차원
arange5 = arange3.reshape(-1,)
print('arange5\n',arange5)
```

## indexing

- 특정 위치의 단일값 추출
- 슬라이싱 ( 특정 range [1:3], [:] 등 )
- 팬시 인덱싱 ( 특정 range [[0,1,2],[[0,1],0:2],[[0,1]] )
- 불린 인덱싱 ( filter, array1[ array1 > 5 ] )

```py
array1 = np.arange(start=1,stop=10)
print(array1)
print(array1[2])
array1[0] = 10
array1[8] = 10
print(array1)

# row,col 2차원 배열 접근
array1d = np.arange(start=1,stop=10)
array2d = array1d.reshape(3,3)
print(array2d)
print(array2d[0,0])
print(array2d[1,1])
print(array2d[0,2])
```

### 슬라이싱

- 1차원
- 2차원

```py
array1 = np.arange(start=1,stop=10)
# slicing 1D
print(array1)
print(array1[:2])
print(array1[2:])
print(array1[:-1])
print(array1[::2])
print()

# slicing 2D
array2 = array1.reshape(3,3)
print(array2)
print()
print(array2[:,:])
print()
print(array2[1:,1:])
print()
print(array2[1:,:])
print()
print(array2[:,1:])

```

### 펜시 인덱싱

- 2차원

```py
array2 = np.arange(start=1,stop=10).reshape(3,3)
print(array2)
```
