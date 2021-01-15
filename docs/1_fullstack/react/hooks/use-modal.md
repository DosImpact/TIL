---
title: React custom hook - 모달창 UI 컴포넌트 만들기
---

## 목적

- 모달창을 가장 위에 뛰울 수 있어야한다.
- 닫기버튼,ESC버튼,배경을 누르면 닫혀야 한다.
- Effect 와 Callback Ref 를 사용

## 완성된 모습

```ts
import React, { useEffect, useState, useCallback, useRef } from "react";
import styled, { keyframes } from "styled-components";

// @Prams(headerText) : headerText 내용
// @Prams(onChange): close event bind
// @Prams(visible): 모달창 show 여부

// @returns(Modal) : JSX Modal elemnt

const useModal = ({ onChange, visible, headerText }) => {
  // handle modal state
  const [showModal, setShowModal] = useState(visible);
  useEffect(() => {
    setShowModal(visible);
    return () => {};
  }, [visible]);

  // close-button click close
  const handle_closeModal = () => {
    setShowModal(false);
    onChange(false);
  };

  // background click close
  const modalRef = useRef();
  const handle_closeModalBackground = (e) => {
    if (modalRef.current === e.target) {
      handle_closeModal();
    }
  };

  // key press close
  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showModal) {
        handle_closeModal();
      }
    },
    [showModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => {
      document.removeEventListener("keydown", keyPress);
    };
  }, [keyPress, showModal]);

  const Modal = ({ children, ...props }) => {
    return (
      showModal && (
        <Background
          props={props}
          onClick={handle_closeModalBackground}
          ref={modalRef}
        >
          <ModalWrapper>
            <ModalHeader>
              <div className="headerTitle">{headerText}</div>
              <div className="closeButtonBox" onClick={handle_closeModal}>
                <img
                  className="closeButtonImg"
                  src={"assets/icons/xbox.svg"}
                  alt="close"
                ></img>
              </div>
            </ModalHeader>
            <ModalBody>{children}</ModalBody>
          </ModalWrapper>
        </Background>
      )
    );
  };

  return { Modal };
};

export default useModal;

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const FadeIn = keyframes`
    0%{
        opacity:0;
    }
    100%{
        opacity:1;
    }
`;

const ModalWrapper = styled.div`
  margin: 0 auto;
  max-width: 744px;
  width: 90%;
  max-height: 853px;
  height: 90%;

  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
  position: relative;
  z-index: 100;
  border-radius: 10px;
  padding: 60px;
`;

const ModalHeader = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
  animation: ${FadeIn} 0.25s linear;
  & .headerTitle {
    font-size: 40px;
    font-weight: 500;
    letter-spacing: -0.4px;
    .closeButtonBox {
    }
    .closeButtonImg {
    }
  }
`;

const ModalBody = styled.div`
  animation: ${FadeIn} 0.25s linear;
`;
```

## 분석

```ts
import React, { useEffect, useState, useCallback, useRef } from "react";
import styled, { keyframes } from "styled-components";

// @Prams(headerText) : headerText 내용
// @Prams(onChange): close event bind
// @Prams(visible): 모달창 show 여부

// @returns(Modal) : JSX Modal elemnt

const useModal = ({ onChange, visible, headerText }) => {
```

- 훅의 입력에 따라서 현재 모달창의 state를 동기화 합니다.

```ts
// handle modal state
const [showModal, setShowModal] = useState(visible);
useEffect(() => {
  setShowModal(visible);
  return () => {};
}, [visible]);
```

- 모달창을 닫으면 state를 false로 만들고 onChange로 알려줍니다.

```ts
// close-button click close
const handle_closeModal = () => {
  setShowModal(false);
  onChange(false);
};
```

- 뒷배경을 Ref하여서 해당 배경을 누르면 닫히도록 핸들러를 만듦니다.

```ts
// background click close
const modalRef = useRef();
const handle_closeModalBackground = (e) => {
  if (modalRef.current === e.target) {
    handle_closeModal();
  }
};
```

- 버튼에 대한 이벤트 입니다.

```ts
// key press close
const keyPress = useCallback(
  (e) => {
    if (e.key === "Escape" && showModal) {
      handle_closeModal();
    }
  },
  [showModal]
);

useEffect(() => {
  document.addEventListener("keydown", keyPress);
  return () => {
    document.removeEventListener("keydown", keyPress);
  };
}, [keyPress, showModal]);
```

- modal의 body JSX

```jsx
  const Modal = ({children, ...props}) => {
    return (
      showModal && (
        <Background props={props} onClick={handle_closeModalBackground} ref={modalRef}>
          <ModalWrapper>
            <ModalHeader>
              <div className="headerTitle">{headerText}</div>
              <div className="closeButtonBox" onClick={handle_closeModal}>
                <img className="closeButtonImg" src={'assets/icons/xbox.svg'} alt="close"></img>
              </div>
            </ModalHeader>
            <ModalBody>{children}</ModalBody>
          </ModalWrapper>
        </Background>
      )
    )
  }

return { Modal };
};

export default useModal;

const Background = styled.div` width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); position: fixed; top: 0; left: 0; display: flex; justify-content: center; align-items: center; z-index: 100;`;

const FadeIn = keyframes` 0%{ opacity:0; } 100%{ opacity:1; }`;

const ModalWrapper = styled.div`
margin: 0 auto;
max-width: 744px;
width: 90%;
max-height: 853px;
height: 90%;

box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
background: #fff;
position: relative;
z-index: 100;
border-radius: 10px;
padding: 60px;
`;

const ModalHeader = styled.div` display: flex; flex-flow: row nowrap; align-items: center; justify-content: space-between; margin-bottom: 40px; animation: ${FadeIn} 0.25s linear; & .headerTitle { font-size: 40px; font-weight: 500; letter-spacing: -0.4px; .closeButtonBox { } .closeButtonImg { } }`;

const ModalBody = styled.div` animation: ${FadeIn} 0.25s linear;`;

```
