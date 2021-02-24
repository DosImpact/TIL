---
title: 트라이 자료구조
---

## 트라이 자료구조

목적 : 문자열 저장을 트라이( 트리 ) 형태로 저장해서 검색을 빠르게 하자.
목적 : 접두사 혹은 접미사가 주어지면, 해당하는 단어들을 트라이 자료구조 에서 빠르게 검색 가능

### 시간복잡도

가장 긴 문자열의 길이 L, 총 문자열의 수 M - 생성시 M\*L - 탐색시 L

### 자료구조

    - 트리형태 - 노드들로 구성되어진다. 노드는 key, data, children( 하위 노드 ) 구성
    - key 값 ( eg) neo 를 넣을때 3개의 노드가 key로 n,e,o 를 저장 )
    - Data 값 ( eg) neo 를 넣을때 o를 key로 가지고 있는 마지막 노드는 neo를 data로 갖는다. )

### 알고리즘:

    - 트라이 생성
    - 문자열 존재성
    - 특정 문자열로 시작하는 문자열 조사

```py
class Node(object):
    def __init__(self, key, data=None):
        self.key = key
        self.data = data
        self.children = {}


class Trie(object):  # class는 이렇게 선언하고 object를 상속받는다.
    def __init__(self):
        self.head = Node(None)
    # insert

    def insert(self, string: str):  # fb 클래스 함수는 첫번째 인자로 self 를 받아야 한데
        p = self.head
        for s in string:
            if s not in p.children:
                p.children[s] = Node(s)
            p = p.children[s]
        p.data = string

    def exist(self, string: str):
        p = self.head
        for s in string:
            if s in p.children:
                p = p.children[s]
            else:
                return False
        if p.data == string:
            return True
        else:
            return False

    def search(self, prefix: str):
        p = self.head
        for s in prefix:
            if s in p.children:
                p = p.children[s]
            else:
                return []
        ans = []
        q = [p]
        while q:
            now_node: Node = q.pop(0)
            if now_node.data:
                ans.append(now_node.data)
            q += list(now_node.children.values())
        return ans


mainTrie = Trie()

print(mainTrie)
mainTrie.insert("hello")
mainTrie.insert("hewww")
mainTrie.insert("hi")
mainTrie.insert("aws")

print(mainTrie.exist("h"))  # False
print(mainTrie.exist("he"))  # False
print(mainTrie.exist("hello"))  # True
print(mainTrie.search("h"))  # ['hi', 'hello', 'hewww']
print(mainTrie.search("he"))  # ['hello', 'hewww']
print(mainTrie.search("hew"))  # ['hewww'
print(mainTrie.search("a"))  # ['aws']

```
