---
title: react slot Pattern
---

## 목적

- 리액트 UI의 슬롯 패턴을 구현하자.
- 리액트 컴포넌트는 하나의 children만 받을 수 있다.
- 하지만 리액트의 props 으로 JSX React compoents 를 받을 수 있다.
- 여러가지 종류의 자식을 받을 수 있는셈

## 설계

- 스터디 디테일 컴포넌트는 2개의 주요 section이 자주 바뀐다.
- 왼쪽 부분의 study의 정보를 나타내는 profile 부분
- 탭의 영역인 studyDetailTab 부분
- 그래서 외부에서 이 양쪽에 컴포넌트 배열을 주입시켜 보자.

## 구조

```
C:.
|   StudyDetailModule.js
|
+---profiles
|       ProfileAlarm.js
|       ProfileNotice.js
|       ProfileThumb.js
|
\---tabs
        StudyDetailTabAccess.js
        StudyDetailTabCycle.js
        StudyDetailTabDetail.js
        StudyDetailTabsModule.js
```

### 모듈 구현

- StudyDetail모듈
- StudyDetail의 Profile 스롯에 들어가는 StudyDetailProfile모듈

```
C:.
|   StudyDetailModule.js 🚀
|
+---profiles
|       ProfileAlarm.js
|       ProfileNotice.js
|       ProfileThumb.js
|
\---tabs
        StudyDetailTabAccess.js
        StudyDetailTabCycle.js
        StudyDetailTabDetail.js
        StudyDetailTabsModule.js 🚀
```

```js
import React from "react";
import styled from "styled-components";

import StudyDetailTabsModule from "./tabs/StudyDetailTabsModule";
// import ProfileAlarm from './profiles/ProfileAlarm'
// 프로필 컴포넌트

//@Params (profileComponents) 프로필 컴포넌트들.
//@Params (tabNames)          탭 이름 설정
//@Params (tabComponents)     탭 하위 컴포넌트  ( 이름과 동일순으로 ! )

const StudyDetailModule = ({
  study,
  profileComponents,
  tabNames,
  tabComponents,
}) => {
  // TODO : dummyData
  if (!study) {
    study = {};
    study["title"] = "[빡센환급반] 2020/15기";
  }

  return (
    <Container>
      <InnerContainer>
        <div className="profileTitle">{study?.title}</div>
        <div className="gridContainer">
          <div className="gridItem studyDetailProfile">
            <Wrapper>{profileComponents}</Wrapper>
          </div>
          <div className="gridItem studyDetailTabs">
            <StudyDetailTabsModule
              tabNames={tabNames}
              tabComponents={tabComponents}
            />
          </div>
        </div>
      </InnerContainer>
    </Container>
  );
};

export default StudyDetailModule;

const Container = styled.div`
  margin-top: 96px;
`;

const InnerContainer = styled.div`
  margin: 0 auto;
  max-width: 1240px;
  .gridContainer {
    display: grid;
    grid-template-columns: 413px 1fr;
    gap: 80px;
  }
  .gridItem {
  }
  .profileTitle {
    font-size: 36px;
    font-weight: 500;
    letter-spacing: -0.36px;
  }
`;
const Wrapper = styled.div`
  .row {
    margin-top: 17px;
    ${(props) => props.theme.flexHC};
  }
`;
```

```js
import React from "react";
import styled from "styled-components";

const StudyDetailTabsModule = ({
  tabNames,
  tabComponents,
  showDetail,
  ...props
}) => {
  const [index, setIndex] = React.useState(0);

  if (!tabComponents) {
    console.error("tabComponents is not exists");
    return null;
  }

  return (
    <StudyDetailTabsWrapper props={props}>
      <div className="tabHeader">
        {Array.from(tabNames).map((name, idx) => (
          <HeaderItem selected={index === idx} onClick={() => setIndex(idx)}>
            {name}
          </HeaderItem>
        ))}
      </div>
      {/* 현재 설정된 index의 tab을 뿌려줍니다. index가   */}
      <div className="tabBody">
        {tabComponents &&
          (tabComponents[index] ? (
            <>{tabComponents[index]}</>
          ) : (
            <>{tabComponents[0]}</>
          ))}
      </div>
    </StudyDetailTabsWrapper>
  );
};
export default StudyDetailTabsModule;

const StudyDetailTabsWrapper = styled.div`
  margin-top: 62px;
  .tabHeader {
    height: 64px;
    ${(props) => props.theme.flexHC};
  }
  .tabBody {
  }
`;
const HeaderItem = styled.div`
  width: 50%;
  height: 64px;
  ${(props) => props.theme.centering};
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: ${(props) => props.theme.borderDefault};
  border-width: 3px;
  border-color: ${(props) =>
    props.selected ? props.theme.MainColor3 : props.theme.GreyColor1};
  color: ${(props) => (props.selected ? "ffffff" : props.theme.GreyColor2)};
`;
```

### 모듈에 장착할 요소 구현

```
C:.
|   StudyDetailModule.js
|
+---profiles
|       ProfileAlarm.js 🚀
|       ProfileNotice.js 🚀
|       ProfileThumb.js 🚀
|
\---tabs
        StudyDetailTabAccess.js 🚀
        StudyDetailTabCycle.js 🚀
        StudyDetailTabDetail.js 🚀
        StudyDetailTabsModule.js
```

```js
import React from "react";
import styled from "styled-components";
import { Button } from "../../../components/common/inputs";

const ProfileAlarm = () => {
  return (
    <Wrapper>
      <div className="row alarmRow">
        <Button
          className="alarmButton"
          variant="outline"
          text={
            <div className="buttonContent">
              <img
                className="icon"
                alt="bell"
                src={`/assets/icons/bell.svg`}
              ></img>
              <div>알림받기</div>
            </div>
          }
        />
      </div>
    </Wrapper>
  );
};

export default ProfileAlarm;

const Wrapper = styled.div`
  .profileImg {
    margin-top: 28px;
    width: 413px;
    height: 275px;
    object-fit: cover;
  }

  .row {
    margin-top: 17px;
    ${(props) => props.theme.flexHC};
    .detailKey {
      color: ${(props) => props.theme.MainColor3};
      margin-right: 16px;
      font-size: 22px;
    }
    .detailValue {
      font-size: 24px;
      font-weight: 500;
      letter-spacing: -0.24px;
      color: #6d7278;
    }
    .badge {
      width: 90px;
      height: 38px;
      border-radius: 20px;
      font-size: 18px;
      font-weight: bold;
    }
  }
  .alarmRow {
    margin-top: 56px;
    .alarmButton {
      width: 100%;
      height: 56px;
      .buttonContent {
        ${(props) => props.theme.flexHC};
        justify-content: center;
        color: ${(props) => props.theme.MainColor3};
        font-size: 22px;
        .icon {
          margin-right: 15px;
        }
      }
    }
  }
`;
```

```js
import React from "react";
import styled from "styled-components";

const ProfileNotice = () => {
  return (
    <Wrapper>
      <div className="row infoStartRow">
        <span className="dot" />
        <div className="info">오프라인으로 진행합니다.</div>
      </div>
      <div className="row">
        <span className="dot" />
        <div className="info">총 8명의 인원을 모집합니다.</div>
      </div>
      <div className="row">
        <span className="dot" style={{ visibility: "hidden" }} />
        <div className="info mainColor">현재 6명이 스터디를 신청했습니다!</div>
      </div>
    </Wrapper>
  );
};

export default ProfileNotice;

const Wrapper = styled.div`
  .profileImg {
    margin-top: 28px;
    width: 413px;
    height: 275px;
    object-fit: cover;
  }

  .row {
    margin-top: 17px;
    ${(props) => props.theme.flexHC};
    .dot {
      display: inline-block;
      width: 5px;
      height: 5px;
      background-color: ${(props) => props.theme.MainColor3};
      border-radius: 50%;
      margin: 0px 10px;
    }
  }
  .infoStartRow {
    margin-top: 42px;
  }
  .alarmRow {
    margin-top: 56px;
  }
`;
```

```js
import React from "react";
import styled from "styled-components";
import Badge from "../../../components/common/badges/Badge";

const ProfileThumb = (props) => {
  console.log(props);
  return (
    <Wrapper>
      <div>{props?.data}</div>
      <img
        className="profileImg"
        src={`/assets/cardImg3.png`}
        alt="profileImg"
      ></img>
      <div className="row">
        <div className="detailKey">일시</div>
        <div className="detailValue">{props?.studySentence.getDays()}</div>
      </div>
      <div className="row">
        <div className="detailKey">장소</div>
        <div className="detailValue">종로해커스 A301호</div>
      </div>
      <div className="row">
        <Badge className="badge" text="모집중" variant="able" />
      </div>
    </Wrapper>
  );
};

export default ProfileThumb;

const Wrapper = styled.div`
  .profileImg {
    margin-top: 28px;
    width: 413px;
    height: 275px;
    object-fit: cover;
  }

  .row {
    margin-top: 17px;
    ${(props) => props.theme.flexHC};
    .detailKey {
      color: ${(props) => props.theme.MainColor3};
      margin-right: 16px;
      font-size: 22px;
    }
    .detailValue {
      font-size: 24px;
      font-weight: 500;
      letter-spacing: -0.24px;
      color: #6d7278;
    }
    .badge {
      width: 90px;
      height: 38px;
      border-radius: 20px;
      font-size: 18px;
      font-weight: bold;
    }
  }
`;
```

```js
import React from "react";
import styled from "styled-components";
import { Button } from "../../../components/common/inputs";

const StudyDetailTabAccess = ({ ...props }) => {
  return (
    <Wrapper props={props}>
      <div className="row confirmRow">
        <Button
          className="submitButton"
          variant="dark"
          text="참여인원 확정하기"
        ></Button>
      </div>

      <div className="profileSection">
        <div className="row acessRow">
          <div>
            <div className="info"> Jake77 | 2020-12-04 신청서 보기</div>
          </div>
          <div>
            <Button
              className="rejectButton"
              variant="disable"
              text="거절"
            ></Button>
            <Button
              className="acceptButton"
              variant="outlined"
              text="수락"
            ></Button>
          </div>
        </div>
      </div>

      <div className="profileSection">
        <div className="row acessRow">
          <div>
            <div className="info"> qarkasd21 | 2020-12-04 신청서 보기</div>
          </div>
          <div></div>
        </div>
      </div>

      <div className="profileSection">
        <div className="row acessRow">
          <div>
            <div className="info"> Jake77 | 2020-12-04 신청서 보기</div>
          </div>
          <div>
            <Button
              className="rejectButton"
              variant="disable"
              text="거절"
            ></Button>
            <Button
              className="acceptButton"
              variant="outlined"
              text="수락"
            ></Button>
          </div>
        </div>
      </div>

      <div className="detailSection">
        <div className="title">공인 영어 점수</div>
        <div className="content">TOEIC 990점</div>
        <div className="title">목적</div>
        <div className="content">
          영어 스터디를 하고 싶어서 찾아보던 중에 괜찮은 서비스가 있어서
          체험해보려고 합니다.
        </div>
        <div className="title">Chitchat 영어 레벨 셀프 테스트</div>
        <div className="content">Lv 1 / 영어공부는 처음이에요.</div>
        <div className="title">스터디 신청서</div>
        <div className="content">
          안녕하세요, 공시생 스터디 참여하고 싶은 Rua입니다! 30대 / 여성{" "}
        </div>
      </div>

      <div className="profileSection">
        <div className="row acessRow">
          <div>
            <div className="info"> Jake77 | 2020-12-04 신청서 보기</div>
          </div>
          <div>
            <Button
              className="acceptButton"
              variant="outlined"
              text="결제하기"
            ></Button>
          </div>
        </div>
      </div>

      <div className="detailConfirmSection">
        <div className="notice">
          *스터디 개설자가 기본적인 프로필 정보를 확인합니다.
        </div>
        <div className="title">공인 영어 점수</div>
        <div className="content">TOEIC 990점</div>
        <div className="title">목적</div>
        <div className="content">
          영어 스터디를 하고 싶어서 찾아보던 중에 괜찮은 서비스가 있어서
          체험해보려고 합니다.
        </div>
        <div className="title">Chitchat 영어 레벨 셀프 테스트</div>
        <div className="content">Lv 1 / 영어공부는 처음이에요.</div>
        <div className="title">스터디 신청서</div>
        <div className="content">
          안녕하세요, 공시생 스터디 참여하고 싶은 Rua입니다! 30대 / 여성{" "}
        </div>
      </div>

      <div className="profileSection">
        <div className="row acessRow">
          <div>
            <div className="info">수락 대기 | 2020-12-05 신청</div>
          </div>
          <div>
            <Button
              className="acceptButton"
              variant="outlined"
              text="신청 취소"
            ></Button>
          </div>
        </div>
      </div>

      <div className="detailConfirmSection">
        <div className="notice">
          *스터디 개설자가 기본적인 프로필 정보를 확인합니다.
        </div>
        <div className="title">공인 영어 점수</div>
        <div className="content">TOEIC 990점</div>
        <div className="title">목적</div>
        <div className="content">
          영어 스터디를 하고 싶어서 찾아보던 중에 괜찮은 서비스가 있어서
          체험해보려고 합니다.
        </div>
        <div className="title">Chitchat 영어 레벨 셀프 테스트</div>
        <div className="content">Lv 1 / 영어공부는 처음이에요.</div>
        <div className="title">스터디 신청서</div>
        <div className="content">
          안녕하세요, 공시생 스터디 참여하고 싶은 Rua입니다! 30대 / 여성{" "}
        </div>
      </div>

      <div className="profileSection">
        <div className="row acessRow">
          <div>
            <div className="info"> qarkasd21 | 2020-12-04 신청서 보기</div>
          </div>
          <div></div>
        </div>
      </div>
    </Wrapper>
  );
};
export default StudyDetailTabAccess;

const Wrapper = styled.div`
  margin-top: 48px;
  font-size: 24px;
  .row {
    ${(props) => props.theme.flexHC};
  }
  .confirmRow {
    margin-bottom: 14px;
    justify-content: flex-end;
    .submitButton {
      width: 145px;
      height: 36px;
    }
  }
  .profileSection {
    ${(props) => props.theme.flexHC};
    align-items: center;

    min-height: 76px;
    width: 100%;
    padding: 20px 24px;
    margin-bottom: 14px;

    border-radius: 8px;
    border: solid 1px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    .acessRow {
      width: 100%;
      justify-content: space-between;
      cursor: pointer;
      .info {
        font-size: 16px;
        font-weight: 500;
        letter-spacing: -0.16px;
        color: #6d7278;
      }
      .rejectButton {
        width: 94px;
        height: 36px;
        margin-right: 8px;
      }
      .acceptButton {
        width: 94px;
        height: 36px;
      }
    }
  }
  .detailSection {
    padding: 24px 16px;
    background-color: #f7f7f7;
    margin-bottom: 32px;
    .title {
      font-family: SpoqaHanSans;
      font-weight: 600;
      font-size: 22px;
      letter-spacing: -0.22px;
      color: #000000;
      margin-bottom: 14px;
    }
    .content {
      font-size: 16px;
      color: #bbbbbb;
      margin-bottom: 32px;
    }
  }
  .detailConfirmSection {
    padding: 24px 16px;
    margin-bottom: 32px;
    .notice {
      margin-bottom: 12px;
      font-size: 16px;
      letter-spacing: -0.16px;
      color: #a9d5e2;
    }
    .title {
      font-family: SpoqaHanSans;
      font-weight: 600;
      font-size: 22px;
      letter-spacing: -0.22px;
      color: #000000;
      margin-bottom: 14px;
    }
    .content {
      font-size: 16px;
      color: #bbbbbb;
      margin-bottom: 32px;
    }
  }
`;
```

```js
import React from "react";
import styled from "styled-components";

const TopicCard = ({ iconImg, title, tags, content, ...props }) => {
  return (
    <TopicCardWrapper {...props}>
      <div className="leftCard">
        <img src={iconImg} alt="icons"></img>
      </div>
      <div className="rightCard">
        <div className="row titleRow">{title}</div>
        <div className="row tagsRow">{tags}</div>
        <div className="row contentRow">{content}</div>
      </div>
    </TopicCardWrapper>
  );
};
const TopicCardWrapper = styled.div`
  border-radius: 19.5px;
  background-color: #f7f7f7;
  padding: 16px 12px;
  display: grid;
  grid-gap: 12px;
  grid-template-columns: 56px 1fr;
  border: solid 1px #d4d4d4;
  .row {
    ${(props) => props.theme.flexHC};
  }
  .titleRow {
    font-size: 18px;
    font-weight: 500;
    color: #6d7278;
    letter-spacing: -0.18px;
  }
  .tagsRow {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.14px;
    color: #ff9f5e;
    margin-top: 8px;
  }
  .contentRow {
    font-size: 16px;
    line-height: 1.63;
    letter-spacing: -0.16px;
    color: #6d7278;
    margin-top: 12px;
  }
`;

//@Params(variant) : grey
const CycleContainer = ({ variant, cycleInfo, topcis, props }) => {
  console.log("topcis", topcis, topcis.length);
  return (
    <CycleWrapper variant={variant} {...props}>
      <div className="header">
        <div className="headerTitle">
          <div className="row">
            <span className="titleNum">{cycleInfo?.num}</span> |{" "}
            {cycleInfo?.time} | {cycleInfo?.place}
          </div>
          <div className="row dateRow">
            <span className="titleDate">{cycleInfo?.date}</span>
          </div>
        </div>
        {/* <div className="row">{cycleInfo?.date}</div> */}
        {/* <img alt="img" src={topcis[0].iconImg}></img> */}
      </div>
      <div className="body">
        <div className="cycleBodyTitle">토픽보기 ({topcis.length})</div>
        <div className="topicContainer">
          {topcis.length === 0 && (
            <div className="noTopic">아직 토픽이 없어요 :0</div>
          )}
          {topcis.length >= 1 &&
            Array.from(topcis).map((e, idx) => {
              return (
                <TopicCard
                  key={idx}
                  iconImg={e.iconImg}
                  title={e.title}
                  tags={e.tags}
                  content={e.content}
                />
              );
            })}
        </div>
      </div>
    </CycleWrapper>
  );
};
const CycleWrapper = styled.li`
  margin-bottom: 32px;
  border-radius: 8px;
  border: solid 1px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  ${(props) => props.variant === "grey" && `background-color: #f8f8f8;`}
  .row {
    ${(props) => props.theme.flexHC};
  }
  .header {
    padding: 20px;
    border-bottom: ${(props) => props.theme.BorderDefault};
    .headerTitle {
      white-space: pre-wrap;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: -0.14px;
      color: rgba(0, 0, 0, 0.25);
      .titleNum {
        font-size: 18px;
        font-weight: 500;
        color: ${(props) => props.theme.MainColor3};
        ${(props) => props.variant === "grey" && `color: #c3c3c3;`}
      }
      .titleDate {
        color: ${(props) => props.theme.MainColor3};
        ${(props) => props.variant === "grey" && `color: #c3c3c3;`}
      }
    }
    .dateRow {
      margin-top: 12px;
    }
  }
  .body {
    padding: 20px;
    .cycleBodyTitle {
      font-size: 18px;
      font-weight: 500;
      letter-spacing: -0.18px;
      color: #000000;
      margin-bottom: 16px;
    }
    .topicContainer {
      display: grid;
      grid-gap: 16px;
      grid-template-columns: 1fr 1fr;
      .noTopic {
        font-size: 14px;
        font-weight: 500;
        letter-spacing: -0.14px;
        color: rgba(0, 0, 0, 0.25);
      }
    }
  }
`;

const StudyDetailTabCycle = ({ ...props }) => {
  const dumbTopic = {
    iconImg: `/assets/icons/cookie.svg`,
    title: "청취(12)",
    tags: "#토픽 #오늘도빡세게",
    content:
      "청취 토픽으로 리스닝 향상을 위해 청취 후 프리토킹. 1) 7시 30 ~ 8시30 : 첫번째 리딩 토픽 ( 프리토킹 토픽 2...",
  };
  const dumbCycleInfo = {
    num: "2회차",
    time: "토 오후 3시 ~ 오후 6시",
    place: "종로해커스 A301호",
    date: "2020-11-07 진행",
  };
  const dumbData1 = {
    cycleInfo: { ...dumbCycleInfo, num: "1회차" },
    topcis: [],
  };
  const dumbData2 = {
    cycleInfo: dumbCycleInfo,
    topcis: [dumbTopic, dumbTopic, dumbTopic],
  };
  const dumbData3 = {
    cycleInfo: { ...dumbCycleInfo, num: "3회차" },
    topcis: [],
  };
  const dumbData4 = {
    cycleInfo: { ...dumbCycleInfo, num: "3회차" },
    topcis: [],
  };

  return (
    <Wrapper props={props}>
      <div className="section nextSection">
        <div className="title">예정된 모임</div>
        <ul className="CycleList">
          <CycleContainer
            cycleInfo={dumbData2.cycleInfo}
            topcis={dumbData2.topcis}
          />
          <CycleContainer
            cycleInfo={dumbData3.cycleInfo}
            topcis={dumbData3.topcis}
          />
          <CycleContainer
            cycleInfo={dumbData4.cycleInfo}
            topcis={dumbData4.topcis}
          />
        </ul>
      </div>
      <div className="section lastSection">
        <div className="title">지난 모임</div>
        <ul className="CycleList">
          <CycleContainer
            variant="grey"
            cycleInfo={dumbData1.cycleInfo}
            topcis={dumbData1.topcis}
          />
          <CycleContainer
            variant="grey"
            cycleInfo={dumbData2.cycleInfo}
            topcis={dumbData2.topcis}
          />
        </ul>
      </div>
    </Wrapper>
  );
};
export default StudyDetailTabCycle;

const Wrapper = styled.div`
  margin-top: 48px;
  font-size: 24px;
  .section {
    .row {
      ${(props) => props.theme.flexHC};
    }
    .title {
      font-size: 28px;
      font-weight: bold;
      letter-spacing: -0.4px;
      color: #222222;
      margin-bottom: 16px;
    }
    .CycleList {
    }
  }
  .nextSection {
  }
  .lastSection {
    margin-top: 64px;
  }
`;
```

```js
import React from "react";
import styled from "styled-components";
import { Button } from "../../../components/common/inputs";

const StudyDetailTabDetail = ({ ...props }) => {
  return (
    <Wrapper props={props}>
      <div className="section infoSection">
        <div className="title">스터디 소개</div>
        <div className="tags">#공무원영어 #스터디모임 #어휘</div>
        <div className="basicText">
          {`3일 동안, 매년 39,000명이 넘는 방문객이 행사장을 가득 메우죠. 책 애호가, 서점 주인, 디자이너, 미술계 인사들, 그저 NYABF가 궁금한 사람 등 수많은 사람들이 각자의 호기심을 안고 행사장을 찾아갑니다.

‘업계사람’들에게는 NYABF가 서로의 소식을 업데이트하고 다음 만남을 기약하는 곳이기도 합니다. 책을 사랑하는 사람들에게는 생각지 못했던 책들을 발견하고, 때로는 귀한 책을 아트북페어 특가로 사는 기회가 되기도 합니다.
          
올해로 14회를 맞이하는 NYABF는 어땠을까요? 작년과 올해로 10주년을 맞이한 서울과 도쿄의 북페어와는 무엇이 달랐을까요?
          `}
        </div>
      </div>

      <div className="section processSection">
        <div className="title">스터디 진행 방식</div>
        <div className="basicText">
          {`3일 동안, 매년 39,000명이 넘는 방문객이 행사장을 가득 메우죠. 책 애호가, 서점 주인, 디자이너, 미술계 인사들, 그저 NYABF가 궁금한 사람 등 수많은 사람들이 각자의 호기심을 안고 행사장을 찾아갑니다.

‘업계사람’들에게는 NYABF가 서로의 소식을 업데이트하고 다음 만남을 기약하는 곳이기도 합니다. 책을 사랑하는 사람들에게는 생각지 못했던 책들을 발견하고, 때로는 귀한 책을 아트북페어 특가로 사는 기회가 되기도 합니다.

올해로 14회를 맞이하는 NYABF는 어땠을까요? 작년과 올해로 10주년을 맞이한 서울과 도쿄의 북페어와는 무엇이 달랐을까요?`}
        </div>
      </div>

      <div className="section scheduleSection">
        <div className="title">스터디 일정</div>
        <div className="row">
          <div className="key">시작 및 종료일</div>
          <div className="value">2020/11/01 - 2020/11/15</div>
        </div>
        <div className="row">
          <div className="key">모임 횟수</div>
          <div className="value">총 4회</div>
        </div>
        <div className="row">
          <div className="key">일시</div>
          <div className="value">매주 금, 토 오후 3시 - 오후 6시</div>
        </div>
        <div className="row">
          <div className="key">장소</div>
          <div className="value">종로해커스 A301호</div>
        </div>
        <div className="row">
          <div className="key"></div>
          <div className="value urlRef">url 참조</div>
        </div>
      </div>

      <div className="section conditionsSection">
        <div className="row">
          <div className="title">스터디 참가 조건</div>
          <Button
            className="selfCheckConfirm"
            variant="outline"
            text="자가 진단표 확인"
          ></Button>
        </div>
        <div className="row levelRow">
          <Button className="levelBox" variant="able" text="레벨3~8"></Button>
          <div className="recText">최소 레벨 3 이상 권장합니다.</div>
        </div>
      </div>

      <div className="section costSection">
        <div className="title">스터디 참가비와 패널티</div>
        <div className="row">
          <input id="opt1" className="checkBoxInput" type="checkbox"></input>
          <label htmlFor="opt1">
            <div className="checkBoxText">
              참가비는 매번 회차별로 균등 배분되어 환급이 됩니다.
            </div>
          </label>
        </div>
        <div className="row">
          <input id="opt2" className="checkBoxInput" type="checkbox"></input>
          <label htmlFor="opt2">
            <div className="checkBoxText">
              패널티가 발생하면 해당 맴버는 패널티를 제외한 금액이 환급됩니다.
            </div>
          </label>
        </div>
        <div className="row">
          <input id="opt3" className="checkBoxInput" type="checkbox"></input>
          <label htmlFor="opt3">
            <div className="checkBoxText">
              한 시즌동안 모인 패널티는 100% 달성자(노결석, 노지각, 100% 과제
              제출)에게 상금으로 지급됩니다.
            </div>
          </label>
        </div>
        <div className="row enterRow">
          <div className="key">참가비</div>
          <div className="value">10,000원(전체 회차 기준).</div>
        </div>
        <div className="row penaltyRow">
          <div className="key">패널티</div>
          <div className="value">
            <div className="penaltyBox">
              <div className="gridItem th">지각비(회차 기준)</div>
              <div className="gridItem th">결석비(회차 기준)</div>
              <div className="gridItem th">과제 미제출(회차 기준)</div>
              <div className="gridItem td">1,000원</div>
              <div className="gridItem td">2,000원</div>
              <div className="gridItem td">-</div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
export default StudyDetailTabDetail;

const Wrapper = styled.div`
  margin-top: 48px;
  font-size: 24px;
  .section {
    .row {
      ${(props) => props.theme.flexHC};
    }
    .title {
      font-size: 28px;
      font-weight: bold;
      letter-spacing: -0.4px;
      color: ${(props) => props.theme.MainColor3};
    }
    .tags {
      margin-top: 20px;
      font-weight: 500;
      letter-spacing: -0.24px;
      color: rgba(74, 74, 74, 0.72);
    }
    .basicText {
      margin-top: 30px;
      white-space: pre-wrap;
      line-height: 1.58;
      letter-spacing: -0.24px;
      color: #222222;
    }
  }

  .infoSection {
  }
  .processSection {
    margin-top: 120px;
  }
  .scheduleSection {
    .title {
      margin-bottom: 24px;
    }
    margin-top: 120px;
    .row {
      margin-bottom: 36px;
    }
    .key {
      min-width: 150px;
      font-size: 22px;
      font-weight: 500;
      line-height: 1.32;
      letter-spacing: -0.22px;
      color: #bbbbbb;
    }
    .value {
      letter-spacing: -0.24px;
      color: #000000;
    }
    .urlRef {
      opacity: 0.8;
      font-size: 20px;
      letter-spacing: -0.2px;
      color: #fa6400;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .conditionsSection {
    margin-top: 120px;
    .selfCheckConfirm {
      margin-left: 16px;
    }
    .levelRow {
      margin-top: 24px;
      .levelBox {
        width: 108px;
        height: 36px;
        font-size: 18px;
        margin-right: 12px;
      }
    }
  }
  .costSection {
    margin-top: 120px;
    .title {
      margin-bottom: 24px;
    }
    .row {
      margin-bottom: 16px;
    }
    .enterRow {
      margin-top: 28px;
    }
    .penaltyRow {
      margin-top: 28px;
      align-items: flex-start;
      .penaltyBox {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        width: 654px;
        height: 122px;
        border-radius: 8px;
        border: solid 1px rgba(0, 0, 0, 0.1);
        background-color: #ffffff;
      }
      .gridItem {
        ${(props) => props.theme.centering};
      }
      .th {
        font-size: 18px;
        font-weight: 500;
        letter-spacing: -0.18px;
        text-align: center;
        color: #6d7278;
        border-bottom: ${(props) => props.theme.BorderDefault};
      }
      .td {
        font-size: 24px;
        font-weight: 500;
        letter-spacing: -0.24px;
        color: #fa6400;
      }
    }
    .checkBoxInput {
      margin-right: 10px;
    }
    input.checkBoxInput[type="checkbox"]:checked + label {
      .checkBoxText {
        color: ${(props) => props.theme.MainColor3};
      }
    }

    .checkBoxText {
      font-size: 20px;
      color: ${(props) => props.theme.GreyColor2};
    }
    .key {
      min-width: 80px;
      font-size: 22px;
      font-weight: 500;
      line-height: 1.32;
      letter-spacing: -0.22px;
      color: #bbbbbb;
    }
    .value {
      letter-spacing: -0.24px;
      color: #000000;
    }
  }
`;
```

## 사용

### eg01

```js
import React from "react";
import { useSelector } from "react-redux";
import ProfileAlarm from "../../commonSections/studyDetail/profiles/ProfileAlarm";
import ProfileNotice from "../../commonSections/studyDetail/profiles/ProfileNotice";
import ProfileThumb from "../../commonSections/studyDetail/profiles/ProfileThumb";
import StudyDetailModule from "../../commonSections/studyDetail/StudyDetailModule";
import StudyDetailTabAccess from "../../commonSections/studyDetail/tabs/StudyDetailTabAccess";
// import StudyDetail from '../../commonSections/studyDetail/StudyDetailMy'
import StudyDetailTabCycle from "../../commonSections/studyDetail/tabs/StudyDetailTabCycle";
import StudyDetailTabDetail from "../../commonSections/studyDetail/tabs/StudyDetailTabDetail";
// import StudyDetail from './studyDetail/StudyDetailMy'
import { Study } from "../../lib/study";

const MyPageDetailPresenter = (props) => {
  const { study } = useSelector((state) => state);
  const studySentence = new Study(study);

  return (
    <>
      {/* <StudyDetail study={study} studySentence={studySentence} /> */}

      <StudyDetailModule
        study={study}
        profileComponents={[
          <ProfileThumb key="1" studySentence={studySentence} />,
          <ProfileNotice key="2" />,
          <ProfileAlarm key="3" />,
        ]}
        tabNames={["스터디 기본 정보", " 신청 및 결제", "회차별 정보"]}
        tabComponents={[
          <StudyDetailTabDetail key="1" />,
          <StudyDetailTabAccess key="2" />,
          <StudyDetailTabCycle key="3" />,
        ]}
      />
    </>
  );
};

export default MyPageDetailPresenter;
```

### eg02

```js
import React, { useMemo, useCallback } from "react";
import StudyList from "./section/StudyList";
import { useSelector } from "react-redux";
import StudyDetailModule from "../../commonSections/studyDetail/StudyDetailModule";
import ProfileThumb from "../../commonSections/studyDetail/profiles/ProfileThumb";
import ProfileAlarm from "../../commonSections/studyDetail/profiles/ProfileAlarm";
import ProfileNotice from "../../commonSections/studyDetail/profiles/ProfileNotice";
import StudyDetailTabDetail from "../../commonSections/studyDetail/tabs/StudyDetailTabDetail";
import StudyDetailTabCycle from "../../commonSections/studyDetail/tabs/StudyDetailTabCycle";

const StudyPostPresenter = ({ history }) => {
  const { data } = useSelector((state) => state.studies);

  const setupDays = useCallback((periodType, days) => {
    const days_ko = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    let result = "";

    switch (periodType) {
      case "weekly":
        result = "매주";
        break;
      case "biWeekly":
        result = "격주";
        break;
      case "monthly":
        result = "매월";
        break;
      default:
        break;
    }
    days?.forEach(({ startTime, endTime, dayIndex }) => {
      const [startHour, startMin] = startTime.split(":");
      const [endHour, endMin] = endTime.split(":");
      result +=
        " / " + days_ko[dayIndex] + startHour > 12
          ? `${startHour - 12}:${startMin} PM ~ `
          : `${startHour}:${startMin} AM ~ ` + endHour > 12
          ? `${endHour - 12}:${endMin} PM`
          : `${endHour}:${endMin} AM`;
    });
  }, []);

  const studies = useMemo(() => {
    return data?.map(
      ({
        id,
        image,
        title,
        isRecommendation,
        periodType,
        status,
        createAt,
        level,
        days,
        tags,
      }) => {
        //TODO
        //1. 장소
        //2. 시간
        //3. 개요
        return {
          id,
          imgSrc: "/assets/cardImg2.png",
          recommand: isRecommendation && "👍🏼 추천",
          title,
          subTitle: setupDays(days),
          tag: "#tag",
          status,
          level: `Lv.${level} 이상 추천`,
        };
      }
    );
  }, [data]);

  const handleClick = useCallback((id) => {
    history.push(`/study/detail/${id}`);
  }, []);
  return (
    <>
      {/* 스터디 리스트 */}
      {/*<StudyList studies={studies} onClick={handleClick} />*/}

      {/* 스터디 상세정보 */}
      <StudyDetailModule
        profileComponents={[
          <ProfileThumb
            key="1"
            studySentence={{ getDays: () => "매주 금, 토 오후 3시 - 오후 6시" }}
          />,
          <ProfileNotice key="2" />,
          <ProfileAlarm key="3" />,
        ]}
        tabNames={["스터디 기본 정보", "회차별 정보"]}
        tabComponents={[
          <StudyDetailTabDetail key="1" />,
          <StudyDetailTabCycle key="1" />,
        ]}
      />

      {/* 스터디 등록 */}
      {/*<RegisterStudy />*/}
    </>
  );
};

export default StudyPostPresenter;
```

## 참조

https://daveceddia.com/pluggable-slots-in-react-components/
