 # 너굴마켓

 ## 🦝 프로젝트 소개 
 ![너굴마켓 로고](https://github.com/user-attachments/assets/dc5c6bb7-5a15-4538-ad7e-bed0cfd09ee8)

 **너굴마켓**은 경제적 효율성을 높이는 중고거래 플랫폼입니다.
 원하는 상품을 쉽게 검색하여 구매하고 판매하여 사용자 편의성을 높이고 실시간 채팅으로 구매자와 판매자 간의 소통을 원활하게 합니다.
 
 [너굴마켓 바로가기](http://13.124.228.250:8080/ "너굴마켓 바로가기")
<br></br>
 ## 📆 프로젝트 기간
 2024/11/26 ~ 2024/12/27
 
 - 기획 및 설계: 24.11.26~24.12.02
 - 기능 구현: 24.12.03~24.12.20
 - 테스트 및 오류 수정:24.12.21~24.12.23
<br></br>
 ## 👩🏻‍💻 팀원![Image](https://github.com/user-attachments/assets/a42a7de4-5925-4b66-9c94-180eab6a9d0d)
| **이름**   | **담당** |
|:-----------------:|:------------------------------|
| **김용수L** <br> [Qortn4925](https://github.com/Qortn4925) | • 채팅 CRUD (실시간 채팅) <br> • 지도 (카카오 API) - 카테고리별 검색, 장소 검색 |
| **김민경** <br> [keaimk](https://github.com/keaimk) | • 관리자 - 회원 관리, 문의 관리 <br> • 1:1 문의 CRUD <br> • 마이페이지 (가계부) <br> • 결제 (카카오페이) |
| **김수민** <br> [soomni01](https://github.com/soomni01) | • 메인페이지 <br> • 상품 CRUD, 찜 CRUD <br> • 소셜 로그인 (카카오, 네이버) <br> • 후기 CRUD <br> • 마이페이지 (구매/판매/찜/후기 내역 조회) |
| **이석민** <br> [seokminlee24](https://github.com/seokminlee24) | • 회원가입, 로그인 <br> • 게시판 CRUD, 댓글 CRUD <br> • 마이페이지 (회원 정보 조회/수정) |

<br>

## 📚 기술스택
 ### frontend
 <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/chakra--ui-319795?style=for-the-badge&logo=chakra-ui&logoColor=white"> <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white"> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white">

 
 ### backend
<img src="https://img.shields.io/badge/java-007396?style=for-the-badge&logo=java&logoColor=white"> <img src="https://img.shields.io/badge/mariaDB-003545?style=for-the-badge&logo=mariaDB&logoColor=white"> <img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"> <img src="https://img.shields.io/badge/Spring Security-6DB33F?style=for-the-badge&logo=Spring Security&logoColor=white"> <img src="https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=amazon-ec2&logoColor=white"> <img src="https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=amazon-s3&logoColor=white"> <img src="https://img.shields.io/badge/stomp-010101?style=for-the-badge&logo=stomp&logoColor=white"> <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/MyBatis-000000?style=for-the-badge&logo=MyBatis&logoColor=white">
 
 ### tools
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"> <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"> <img src="https://img.shields.io/badge/IntelliJ%20IDEA-000000?style=for-the-badge&logo=intellij-idea&logoColor=white">

<details><summary><b>버전</b></summary>
 
| **기술스택**   | **버전** |
|-----------------|-------------------------|
| Java | 21 |
| SpringBoot| 3.3.6 |
| React  | 18.3.1 |
| MariaDB  | 11.5.2 |
| Docker  | 27.2.0 |
| ChakraUI  | 3.2.1 |
| MyBatis  | 3.0.3 |
| stopmp  | 2.3.3-1 |
| IntelliJ  | 24.2.2 |

</details>

<br>

 ## 🗂️ ERD
 ![KakaoTalk_20241223_190733002](https://github.com/user-attachments/assets/7f5009e2-87ba-49e0-b55d-96165de058c5)
<br></br>
## 🖇 작품 흐름도
 ![Image](https://github.com/user-attachments/assets/b51b85dc-0877-44ed-beef-f4d1aef21b3f)
<br></br>
 ## 🖥 화면구현
<details><summary><b>회원가입/로그인</b></summary> 
 
 ![회원가입](https://github.com/user-attachments/assets/91e00145-defb-4214-8734-14751948f6e9)

 ![로그인](https://github.com/user-attachments/assets/cf3b6a01-5473-43b9-81c5-6086a2104320)

 ##### 소셜 로그인 성공 시 추가 정보 작성 페이지로 이동
 ![소셜 로그인](https://github.com/user-attachments/assets/2da38baf-3b5c-452c-85df-ce4c6ab7ec8f)
</details>
<details><summary><b>중고거래/나눔</b></summary>
 
#### 상품 목록
![상품 목록](https://github.com/user-attachments/assets/a3e2fd74-8490-47d2-95b3-17697f61a6d5)
![상품 목록 나눔](https://github.com/user-attachments/assets/129a070a-5644-48f8-9774-fb4c831074fc)

#### 상품 상세 페이지
![상품 상세](https://github.com/user-attachments/assets/2c5e9547-b695-461c-878f-e47576276aec)

#### 상품 등록
![상품 등록](https://github.com/user-attachments/assets/bd71f704-5fb5-4a06-b2e8-27e55a073059)

![상품 등록2](https://github.com/user-attachments/assets/71061bca-754f-4766-b219-d66db095dd5a)
</details>
<details><summary><b>채팅 & 결제</b></summary>

 ##### 상세 페이지에서 채팅하기를 통해 판매자와 채팅
![채팅1](https://github.com/user-attachments/assets/aed500fa-afa4-4437-afaf-15398b7ba36a)

##### 구매자가 결제하기 버튼을 통해 카카오페이로 결제 (판매자가 거래완료 버튼을 통해 거래 확정 가능)
![채팅2](https://github.com/user-attachments/assets/5f19ac8f-e548-4267-857b-422fe3b030e6)

##### 결제완료 후 판매자는 거래완료 표시로 변경되며 구매자는 후기 작성 버튼을 통해 후기 작성 가능
![채팅3](https://github.com/user-attachments/assets/ebb8f19e-3ff0-4290-b574-57b7ee85e1f5)

![채팅4](https://github.com/user-attachments/assets/b03d6416-8879-40b5-8a00-ff0476dfe4f8)

##### 상품 정보 보기 버튼을 통해 해당 상품의 정보를 한눈에 확인
![채팅5](https://github.com/user-attachments/assets/3f516637-0fc9-4704-ac48-0ebef1b8a7e5)

</details>
<details><summary><b>게시판/지도</b></summary>

#### 게시판
![게시판 목록](https://github.com/user-attachments/assets/8023793b-1c65-4d57-9313-6f76e2676d5a)

![게시판 상세](https://github.com/user-attachments/assets/c78c5fd8-83a3-47ad-bcc2-96a6edeb3782)

![게시판 작성](https://github.com/user-attachments/assets/91844281-d333-4049-9929-ad6779d894e8)

#### 지도(장소 검색, 주변 카테고리 검색)
![지도](https://github.com/user-attachments/assets/58e9f58d-6d70-4c0b-a89b-4d3d1bbfeffa)

![지도2](https://github.com/user-attachments/assets/9e77a05d-369d-4d76-bb4b-a130478a1db5)

</details>

<details><summary><b>마이페이지</b></summary>

#### 내 정보
 ![마이페이지1](https://github.com/user-attachments/assets/35ab04e8-341a-458e-ada1-ef817547295d)

 #### 내가 쓴 글
![마이페이지2](https://github.com/user-attachments/assets/2f7660a0-87a4-4359-852e-d7a366b81f7b)

#### 관심 목록
![마이페이지3](https://github.com/user-attachments/assets/f6a39181-c780-445a-bcf9-ec4e7ba8a8e2)

#### 판매 상품
![마이페이지4](https://github.com/user-attachments/assets/4f5dbbba-69e3-485e-8d14-b56d067e43b4)

#### 구매 상품
![마이페이지5](https://github.com/user-attachments/assets/90c2ba61-de7b-417c-932d-969c098b2d0b)

#### 구매 상품(후기 작성 버튼을 통해 후기 작성)
![마이페이지52](https://github.com/user-attachments/assets/356505d9-6019-45e0-968b-5e722af92cf4)

#### 가계부
![마이페이지6](https://github.com/user-attachments/assets/e9b940ad-3ca2-46b9-8de9-a19ab67b963a)

#### 후기
![마이페이지7](https://github.com/user-attachments/assets/d4dc72c4-0d07-4d69-881b-ba83562ff264)

</details>

<details><summary><b>1:1 문의</b></summary>

 #### 문의 작성
![문의](https://github.com/user-attachments/assets/5617e9cf-f85d-4761-8ece-90446a4aeea1)

 #### 문의 상세 페이지(관리자만 답변 가능)
![문의33](https://github.com/user-attachments/assets/084562bb-9503-4ccc-b9af-4f86990a8c8d)

 #### 내 문의 내역 확인(답변 대기, 답변 완료 상태로 확인)
![문의4](https://github.com/user-attachments/assets/02573313-cc8a-42e7-b096-51edfb178dce)

</details>

<details><summary><b>관리자</b></summary>
 
 ##### 회원 관리
![관리자](https://github.com/user-attachments/assets/6b5dca47-21c0-435e-a99e-c08aaf24085c)

 ##### 특정 회원의 판매, 구매 상품 확인(관리자가 상품 삭제 가능)
![관리자2](https://github.com/user-attachments/assets/22bd7b24-543d-44fb-abd7-dcc0f5362a45)

 ##### 문의
![관리자3](https://github.com/user-attachments/assets/590e43bf-00ce-4e87-8f4f-6fa6652621d7)

 ##### 관리자 문의 작성 페이지
![문의2](https://github.com/user-attachments/assets/f12171a3-f751-461e-8f38-c8fac5baa957)
</details>

[시연 영상 보기](https://youtu.be/5vmswO2LkcI)

 ## 🛠 트러블 슈팅
<details><summary><b>회원 탈퇴, 상품 삭제 시 데이터 보존</b></summary>
 <br>
<b>1. 문제 식별</b><br>
회원이 탈퇴하거나 상품을 삭제할 경우, 해당 사용자가 올린 상품 정보도 삭제되어 구매자의 상품 구매 기록이 사라지는 문제가 발생<br>
 <br>
<b>2. 문제 해결 접근 방법</b><br>
구매자에게 보여 줄 최소 상품 정보 컬럼을 추가하여 회원 탈퇴 시, 상품 번호와 회원 아이디는 NULL 처리하여 최소한의 상품 정보는 삭제되지 않고 데이터 보존<br>
 <br>
<b>3. 결과 및 교훈</b><br>
회원 탈퇴와 같은 데이터 삭제는 복구가 어려우므로 데이터 보존의 필요성을 사전에 인지하고 구매자와 판매자 모두의 관점을 반영하여 신중하게 설계하는 것이 중요하다는 결과를 얻음
</details>
<details><summary><b>실시간으로 프로필 설정 전체 적용</b></summary>
 <br>
<b>1. 문제 식별</b><br>
 사용자 프로필을 마이페이지에서 변경할 경우 navbar의 사용자 프로필 이미지는 실시간으로 반영되지 않는 문제가 발생<br> 
 <br>
<b>2. 문제 해결 접근 방법</b><br>
 상단 AuthenticalProvider 컴포넌트에서 Context를 이용하여 이미지 변경 요청이 발생하면 응답하여 같이 변경하도록 구현<br>
 <br>
<b>3. 결과 및 교훈</b><br>
 컴포넌트의 계층 구조를 잘 이해하는 것이 중요하고 상황에 따라 컴포넌트의 구조를 활용해서 사용하는 것에 익숙해져야 겠다는 생각을 함
</details>
