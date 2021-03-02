---
title: 투포인터 알고리즘
---

# 투포인터 알고리즘

투 포인터 알고리즘은 보통 부분합 문제 해결

# 절대 정답이 아닌 case를 skip한다.

# 대표적으로 부분합 문제, 구간[a:b]의 합이 S가 되는 문제

알고리즘

1. 시작은 left,right = 0,0 으로
2. left,right 구간합이 S 보다 작은경우 - right를 늘린다.

# left,right 구간합이 S보다 큰 경우 - left를 늘린다.

# left,right 구간합이 S랑 동일한 경우 - ans++, left를 증가

3. right를 더이상 증가할 수 없으면 끝

# 부분합 - https://www.acmicpc.net/problem/1806
