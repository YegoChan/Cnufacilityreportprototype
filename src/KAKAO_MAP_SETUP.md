# 카카오맵 API 설정 가이드

카카오맵을 정상적으로 사용하려면 카카오 개발자 계정에서 JavaScript 키를 발급받아야 합니다.

## 1. 카카오 개발자 계정 생성

1. [카카오 개발자 사이트](https://developers.kakao.com/)에 접속
2. 카카오 계정으로 로그인
3. "내 애플리케이션" 메뉴로 이동

## 2. 애플리케이션 등록

1. "애플리케이션 추가하기" 버튼 클릭
2. 앱 이름 입력 (예: "충남대 제보 앱")
3. 사업자명 입력 (개인은 이름 입력)
4. 저장

## 3. JavaScript 키 발급

1. 생성한 애플리케이션 선택
2. "앱 키" 메뉴에서 **JavaScript 키** 복사
3. "플랫폼" 메뉴로 이동
4. "Web 플랫폼 등록" 클릭
5. 사이트 도메인 등록:
   - 개발 중: `http://localhost:3000`
   - 배포 시: 실제 도메인 주소

## 4. API 키 설정

`/components/KakaoMapScript.tsx` 파일을 열고 다음 부분을 수정:

```typescript
// 이 부분을 찾아서
script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_APP_KEY&autoload=false';

// YOUR_KAKAO_APP_KEY를 발급받은 JavaScript 키로 교체
script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=발급받은키&autoload=false';
```

## 5. 좌표 조정 (선택사항)

충남대학교 정문 기준 좌표가 설정되어 있습니다:
- 위도: 36.3684
- 경도: 127.3448

다른 위치를 기준으로 하고 싶다면 `ReportMap.tsx`와 `LocationPickerMap.tsx`의 `baseLatLng` 값을 수정하세요.

## 6. 지도 마커 클릭 기능 디버깅

현재 지도 마커를 클릭하면 제보 상세보기가 표시됩니다.

### 작동하지 않을 때 확인 사항:

1. **브라우저 콘솔 확인** (F12 → Console 탭):
   - "✅ 메시지 리스너 등록됨" 메시지가 보이는지 확인
   - 마커 클릭 시 "🖱️ 마커 클릭됨!" 메시지가 보이는지 확인
   - "✅ 부모 창에 메시지 전송 성공" 메시지가 보이는지 확인
   - "🗺️ 마커 클릭 메시지 수신!" 메시지가 보이는지 확인

2. **iframe 샌드박스 설정**:
   - ReportMap.tsx에서 iframe의 `sandbox` 속성 확인
   - `allow-scripts allow-same-origin` 권한이 필요

3. **GitHub Pages 배포**:
   - `github-pages-map.html` 파일이 GitHub Pages에 배포되어 있어야 함
   - iframe src가 올바른 GitHub Pages URL을 가리키는지 확인

4. **메시지 형식 확인**:
   ```javascript
   {
     type: 'markerClick',
     reportId: '1',  // 문자열 형태의 ID
     reportTitle: '...'
   }
   ```

### 문제 해결:

- **메시지가 전송되지 않음**: GitHub Pages 배포 확인
- **메시지가 수신되지 않음**: 브라우저의 보안 정책 확인
- **제보를 찾을 수 없음**: reportId가 일치하는지 확인 (1~8)

## 주의사항

- JavaScript 키는 클라이언트 사이드에서 사용되므로 보안에 민감한 작업에는 적합하지 않습니다
- 실제 서비스 배포 시에는 도메인 제한을 반드시 설정하세요
- 무료 쿼터: 하루 300,000회 (일반적인 사용에는 충분)
