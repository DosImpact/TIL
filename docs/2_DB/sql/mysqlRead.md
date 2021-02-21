---
title: 🚀 MY SQL READ
---

# SUPER BASIC

# 데이터 요청은 논리 FLOW가 있고, 쿼리문의 순서를 따라야 한다.

    - 1,2,3 이 한세트

    1. SELECT : 보여줄 레코드의 템플릿임을 고려
    2. FROM : 리소스의 형태 정의
    3. WHERE(1차거름) -> 리소스에서 1차적으로 조건에 맞게 거른다.

---

1. GROUP -> 해당 조건에 맞는것들이 나온상태에서 -> 공통된 특정 데이터로 묶어준다. -> 이는 대표성을 띄는 1개의 행으로 표현되며 (마치 행들이 접혀있다. )

-> 보이는것과 다르게 COUNT, AVG, SUM 등의 연산이 가능하다. 2. HAVING(2차 거름) -> 각각의 그룹에 대해 aggregate 한 연산결과 조건에 안맞는 그룹들을 아예 배제시킨다.

---

    1. 이제 대표성을 띄는 행 간에 정렬을 시도한다.

```
SELECT _, COUNT(_)
FROM ANIMAL_INS
WHERE INTAKE_CONDITION != "AGED"
GROUP BY INTAKE_CONDITION
ORDER BY COUNT(\*)
```

```
ANIMAL_ID ANIMAL_TYPE DATETIME INTAKE_CONDITION NAME SEX_UPON_INTAKE COUNT(\*)
A353259 Dog 2016-05-08 12:57:00 Injured Bj Neutered Male 5
A362707 Dog 2016-01-27 12:27:00 Sick Girly Girl Spayed Female 6
A349996 Cat 2018-01-22 14:32:00 Normal Sugar Neutered Male 82
```

# 1 Read

```
SELECT \* FROM topic;

SELECT id,title,created,author FROM topic;

SELECT id,title,created,author FROM topic LIMIT 2;
```

## 1.1 Read where

```
SELECT id,title,author FROM topic WHERE author="kdy";

SELECT ANIMAL_ID FROM ANIMAL_INS WHERE NAME IS NULL;

SELECT ANIMAL_ID FROM ANIMAL_INS WHERE NAME IS NOT NULL;

--READ 중복 제거해서 읽기
--예시 ) 이름이 NULL이 아니고 중복을 제거한 이름들의 갯수는

SELECT COUNT( DISTINCT NAME ) FROM ANIMAL_INS WHERE NAME IS NOT NULL;

--LIKE : 문자열 검색 조건 ( % \_ A-Z ) <- 이 3개의 조합으로 표현

SELECT \* FROM Customers
WHERE CustomerName LIKE 'a%';

SELECT NAME
FROM ANIMAL*INS
WHERE NAME LIKE "\_E*"

SELECT A.ANIMAL_ID, A.ANIMAL_TYPE, A.NAME
FROM ANIMAL_INS A LEFT JOIN ANIMAL_OUTS B ON A.ANIMAL_ID = B.ANIMAL_ID
WHERE A.SEX_UPON_INTAKE LIKE "%Intact%" AND B.SEX_UPON_OUTCOME NOT LIKE "%Intact%"

WHERE CustomerName LIKE 'a%' Finds any values that start with "a"
WHERE CustomerName LIKE '%a' Finds any values that end with "a"
WHERE CustomerName LIKE '%or%' Finds any values that have "or" in any position
WHERE CustomerName LIKE '\_r%' Finds any values that have "r" in the second position
WHERE CustomerName LIKE 'a**%' Finds any values that start with "a" and are at least 3 characters in length
WHERE ContactName LIKE 'a%o' Finds any values that start with "a" and ends with "o" - %는 뭐가 오든상관이 없다. - A%는 A로 시작하고 그다음에는 뭐가 옫느 상관이 없다. - "%HI% HI가 들어간 모든 문자열 - "_A%" 첫글자는 뭐가 오든 상관 없고 + 두번째글자는 무조건 A + 그다음에는 뭐가 오든 상관없음 - "_**" 무슨 글자든 상관없는데, 3글자만
출처: <https://www.w3schools.com/sql/sql_like.asp>

--IN ( '…', ) - 특정 이름 선택
SELECT ANIMAL_ID, NAME, SEX_UPON_INTAKE
FROM ANIMAL_INS
WHERE NAME IN ('Lucy', 'Ella', 'Pickle', 'Rogan', 'Sabrina', 'Mitty')
```

## 1.X Read with new columns

```
--특정 조건이 들어간 것들을 새로운 행으로 만들어버리기 - CASE WHEN THEN ELSE END AS 라는 문법을 이용하자.

-- 퀄리티가 30이상 30, 30 이하인 퀄리티 칼럼 만들기

SELECT OrderID, Quantity,
CASE
WHEN Quantity > 30 THEN "The quantity is greater than 30"
WHEN Quantity = 30 THEN "The quantity is 30"
ELSE "The quantity is under 30"
END AS QuantityText
FROM OrderDetails;

-- 중성화 수술이 되어있는지 판단하는 칼럼을 만들기
SELECT ANIMAL_ID,NAME,
CASE WHEN SEX_UPON_INTAKE LIKE '%Neutered%' OR SEX_UPON_INTAKE LIKE 'Spayed%' THEN "O" ELSE "X" END AS 중성화
FROM ANIMAL_INS
```

## 1.2 Read Null 처리하기

```
SELECT ANIMAL_TYPE, IFNULL(NAME, "No name" ) AS NAME ,SEX_UPON_INTAKE
FROM ANIMAL_INS
ORDER BY ANIMAL_ID
```

## 1.3 Read order by ascend | descend

```
SELECT id,title,author FROM topic WHERE author = "kdy" ORDER BY id DESC|ASC

-- 두개 이상의 조건은 ,로 이어준다. ( AND , OR 가 아니다. ) Where 나 when절에서 사용가능
--정렬 두개이상 조건 -> 이름 순, 들어온시간은 내림차순
SELECT ANIMAL_ID,NAME,DATETIME
FROM ANIMAL_INS
ORDER BY NAME ASC, DATETIME DESC

-- ORDER의 순서를 직접 정해주기

SELECT ANIMAL_TYPE, COUNT(\*) AS count
FROM ANIMAL_INS
WHERE ANIMAL_TYPE = "CAT" OR ANIMAL_TYPE = "DOG"
GROUP BY ANIMAL_TYPE
ORDER BY FIELD(ANIMAL_TYPE, "CAT","DOG")
```

## 1.4 Read MIN,MAX,SUM,COUNT

```
SELECT COUNT(column_name)
FROM table_name
WHERE condition;

SELECT AVG(column_name)
FROM table_name
WHERE condition;

SELECT SUM(column_name)
FROM table_name
WHERE condition;

SELECT MIN(column_name)
FROM table_name
WHERE condition;

--예시
SELECT \*,MAX(PRICE) AS HPRICE FROM PRODUCTS;
SELECT COUNT(CategoryID), MAX(CategoryID) FROM PRODUCTS WHERE CategoryID = 1 OR CategoryID=2
```

## 1.5 Read Group by with MIN,MAX,SUM,COUNT

```
    --해당 테이블에서 일딴 나라별로 그룹을 만들어, 그리고 나서 각 그룹별로 customerID의 갯수와 country를 출력!

SELECT COUNT(CustomerID), Country
FROM Customers
GROUP BY Country;

SELECT COUNT(CustomerID), Country
FROM Customers
GROUP BY Country
ORDER BY COUNT(CustomerID) DESC;

    --해당 그룹에대한 조건을 주기 ( aggregate functions 은 where절에서 사용 불가하기 때문에 having이라는 조건을 사용 )

SELECT NAME,COUNT(\*) AS COUNT
FROM ANIMAL_INS
GROUP BY NAME
HAVING COUNT(NAME) >=2

    - 그룹을 맺고 조건절 + 정렬까지 ( 다행이도 정렬에서는 aggregate func 가 사용이 가능하다. )

SELECT COUNT(CustomerID), Country
FROM Customers
GROUP BY Country
HAVING COUNT(CustomerID) > 5
ORDER BY COUNT(CustomerID) DESC;

--예시) 어떤 시각에 가장 입양이 많이 들어 왔을까?
--SQL 문의 순서도 중요하다.

SELECT HOUR(DATETIME),COUNT(DATETIME) AS COUNT
FROM ANIMAL_OUTS
WHERE HOUR(DATETIME) >= 9 AND HOUR(DATETIME) <= 19
GROUP BY HOUR(DATETIME)
ORDER BY HOUR(DATETIME) ASC
```

## 1.6 Datetime 처리하기

```
--시간 자료형에서 HOUR만 가져오기 -- HOUR(DATETIME)

--시간을 원하는 포멧으로 출력하기--DATE_FORMAT

--형식에는 %Y(4자리 연도), %y(2자리 연도), %m(월), %d(일), %H(24시간), %h(12시간), %i, %s가 있습니다.

SELECT ANIMAL_ID,NAME,
DATE_FORMAT(DATETIME,'%Y-%m-%d') AS 날짜
FROM ANIMAL_INS

--년/월/일 간격 구하기 ( NULL인 시간이 들어가면 비교 대상에서 제외 -> 아니야.. ) -- DATEDIFF
(참고 시간 간격만 따지려면 TIMEDIFF를 사용하면 된다. )
SELECT A.ANIMAL_ID, A.NAME
FROM ANIMAL_INS A, ANIMAL_OUTS B
WHERE A.ANIMAL_ID = B.ANIMAL_ID
ORDER BY DATEDIFF(A.DATETIME,B.DATETIME)
LIMIT 2

-- DATEDIFF (전,후) 간격이 클수록 큰 -가 된다. -> ASC 순서대로! ( 주의 ! NULL인경우 먼저 나온다.)
SELECT A.ANIMAL_ID,A.NAME
FROM ANIMAL_INS A LEFT JOIN ANIMAL_OUTS B ON A.ANIMAL_ID = B.ANIMAL_ID
WHERE A.DATETIME IS NOT NULL AND B.DATETIME IS NOT NULL
ORDER BY DATEDIFF(A.DATETIME,B.DATETIME)
LIMIT 2
```

## 1.X FROM 을 여러 개 만들어서 테이블 늘리기 (물론 SELECT를 여러개로 늘릴수도 있다. )

```
SELECT A.CART*ID
FROM (SELECT * FROM CART*PRODUCTS WHERE NAME ="우유") AS A,
(SELECT * FROM CART_PRODUCTS WHERE NAME ="요거트") AS B
WHERE A.CART_ID = B.CART_ID
```

## 1.X 변수를 설정해서, 0시부터 23시까지 각각 얼마의 동물들이 입양되었는지 알아보기

```
-- 변수 선언은 SET @HOUR , 대입은 := 연산자를 이용한다. ( 물론 = 도 되는데 비교연산자랑 모호해질수 있음 )
-- @HOUR := @HOUR + 1 을 함으로써 각의 행들을 만들어 내며
-- FROM를 꼭 써주어서 WHERE문에 @HOUR에 대한 조건을 적자.
-- SELECT 열이 들어가는 공간에는 또 다른 SQL문이 들어갈수 있으며 이는 변수를 사용하기 위함.?!

SET @HOUR := -1;
SELECT (@HOUR := @HOUR + 1) AS HOUR,
(SELECT COUNT(\*) FROM ANIMAL_OUTS WHERE HOUR(`DATETIME`) = @HOUR ) AS `CNT`
FROM ANIMAL_OUTS
WHERE @HOUR < 23
```
