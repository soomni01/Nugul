 # 너굴마켓

 ### 🦝 프로젝트 소개 
 - - - 
 **너굴마켓**은 경제적 효율성을 높이는 중고거래 플랫폼입니다.
 원하는 상품을 쉽게 검색하여 구매하고 판매하여 사용자 편의성을 높이고 실시간 채팅으로 구매자와 판매자 간의 소통을 원활하게 합니다. 
 [nugul](http://13.124.228.250:8080/ "너굴마켓 바로가기")
 
 ### 📆 프로젝트 기간
 - - - 
 2024/11/26 ~ 2024/12/27

 ### 🧑‍💻팀원
 - - - 
 | 김용수L | 김민경 | 김수민 | 이석민 |
 | :--- | :--- | :--- | :--- |
 | [kys](https://github.com/Qortn4925 "Qortn4925") | [kmk](https://github.com/keaimk "keaimk") | [ksm](https://github.com/soomni01 "soomni01") | [lsm](https://github.com/seokminlee24 "seokminlee24") |
 | • 채팅 CRUD<br> －실시간 채팅<br> • 지도(카카오 Api)<br> －카테고리별 검색, 장소 검색 | • 관리자<br> －회원 관리<br> -문의 관리<br> • 1:1 문의 CRUD<br> • 마이페이지<br> -가계부<br> • 결제(카카오페이)<br> －카테고리별 검색, 장소 검색 | • 메인페이지<br>  • 상품<br> －상품 CRUD<br> -찜 CRUD<br> • SNS 로그인(카카오, 네이버)<br> • 후기 CRUD<br> <br> • 마이페이지<br> －구매, 판매 / 찜 / 후기 내역 조회 | • 게시판<br>－게시판 CRUD<br> -댓글 CRUD<br> • 회원<br> -회원가입<br> -로그인<br> • 마이페이지<br> －회원 정보 조회/수정 |
 
 ### 📚 기술스택
 - - -
 ## frontend
 <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> 
 ## backend
 <img src="https://img.shields.io/badge/java-007396?style=for-the-badge&logo=java&logoColor=white"> 
 <img src="https://img.shields.io/badge/mariaDB-003545?style=for-the-badge&logo=mariaDB&logoColor=white">
 <img src="https://img.shields.io/badge/spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white">
 <img src="https://img.shields.io/badge/amazonaws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white"> 
 ## tools
 <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
 <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
 ++ stomp, intellij 
 
 ### 🗂️ ERD
 - - -
 
 ### ⇆ 서비스 아키텍쳐
 - - -
 
 ### ⚙ 주요기능
 - - -
<details><summary>회원가입/로그인</summary> 회원가입, 로그인, 소셜 로그인 이미지</details>
<details><summary>중고거래/나눔</summary>사용자들이 원하는 방식과 위치에서 편리하게 원하는 상품을 판매하고 나누며 거래 !!!!거래 리스트, 작성 페이지, 상세 페이지, </details>
<details><summary>채팅 & 결제</summary>구매자와 판매자가 실시간으로 소통할 수 있는 채팅 기능, 거래 일정 조율 및 결제 기능을 제공 !!!!채팅 페이지 결제화면</details>
<details><summary>게시판/지도</summary>여러 회원과 소통할 수 있는 게시판과 특정 위치의 주변 카테고리 검색을 통해 사용자 편의성 증대 !!!게시판 페이지, 지도 페이지</details>
<details><summary>관리자</summary>회원들이 편하게 문의하고 안전하게 이용할 수 있도록 관리자가 전체 회원과 상품을 관리 !!! 관리자 페이지</details>

 
 ### ⁉ 트러블 슈팅
 - - -
 <details><summary>### 회원 탈퇴, 상품 삭제 시 데이터 보존</summary> **1. 문제 식별** <br> - 회원이 탈퇴하거나 상품을 삭제할 경우, 해당 사용자가 올린 상품 정보도 삭제되어 구매자의 상품 구매 기록이 사라지는 문제가 발생<br> 2. 문제 해결 접근 방법<br> - 구매자에게 보여 줄 최소 상품 정보 컬럼을 추가하여 회원 탈퇴 시, 상품 번호와 회원 아이디는 NULL 처리하여 최소한의 상품 정보는 삭제되지 않고 데이터 보존<br> 3. 결과 및 교훈<br> - 회원 탈퇴와 같은 데이터 삭제는 복구가 어려우므로 데이터 보존의 필요성을 사전에 인지하고 구매자와 판매자 모두의 관점을 반영하여 신중하게 설계하는 것이 중요하다는 생각이 들었다.</details>
 <details><summary>### 실시간으로 프로필 설정 전체 적용</summary>1. 문제 식별<br> - 사용자 프로필을 마이페이지에서 변경할 경우 navbar의 사용자 프로필 이미지는 실시간으로 반영되지 않는 문제가 발생<br> 2. 문제 해결 접근 방법<br> 상단 AuthenticalProvider 컴포넌트에서 Context를 이용하여 이미지 변경 요청이 발생하면 응답하여 같이 변경하도록 구현</details>
