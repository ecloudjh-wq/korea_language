const app=document.getElementById('app');
const persistentNav=document.getElementById('persistentNav');
const toastEl=document.getElementById('toast');
const routeLabel=document.getElementById('routeLabel');
const state={model:'chan',category:'전체',collectionTab:'photo',language:'한국어',saved:false,runStep:0,runPaused:false,recorded:false,notifications:[true,true,false,true,true],shopCategory:'추천',points:2450,shopOwned:false,previewPlaying:false,currentEpisode:'cafe'};
const routes=[];let current='home',historyStack=[];
function mi(name,cls=''){return `<span class="material-symbols-rounded ${cls}" aria-hidden="true">${name}</span>`}
const navItems=[['home','home','홈'],['episodes','movie','에피소드'],['play','sports_esports','플레이'],['collection','collections_bookmark','컬렉션'],['my','person','마이']];
const screenNames={home:'홈',episodes:'에피소드',introHangang:'EP.01 한강 상세',introFood:'EP.02 전통 맛집 상세',introSeongsu:'EP.03 성수동 상세',intro:'EP.04 카페 상세',expressions:'오늘의 표현',speak:'말해보기',mission:'상황 미션',clear:'에피소드 완료',play:'플레이',run:'CHAN RUN',result:'게임 결과',collection:'컬렉션',series:'시리즈',photo:'포토카드 상세',voice:'보이스',special:'스페셜',shop:'샵',shopDetail:'샵 상품 상세',my:'마이',activity:'활동 기록',language:'언어 설정',notifications:'알림 설정',settings:'설정'};
const menuOrder=['home','episodes','introHangang','introFood','introSeongsu','intro','expressions','speak','mission','clear','play','run','result','collection','series','photo','voice','special','shop','shopDetail','my','activity','language','notifications','settings'];
const guideData={
  home:{cat:'HOME',desc:'AI 모델과 신규 콘텐츠를 중심으로 보여주는 첫 화면',purpose:'학습 진도나 점수보다 AI 모델과 오늘 즐길 콘텐츠를 먼저 보여주어 서비스의 엔터테인먼트 성격을 전달합니다.',components:['AI 모델 전환 및 메인 비주얼','이어하기 / 신규 에피소드','오늘의 플레이와 컬렉션','샵 진입 버튼'],interactions:['AI 모델 2명 전환','에피소드 카드 선택','플레이·컬렉션·샵 이동'],flow:['홈','에피소드','플레이/컬렉션'],note:'대표 시연 시 “공부하러 들어오는 홈이 아니라, 오늘 AI 모델과 무엇을 할지 고르는 홈”이라는 점을 설명합니다.'},
  episodes:{cat:'EPISODE',desc:'한국의 장소·음식·트렌드를 콘텐츠처럼 탐색하는 에피소드 목록',purpose:'기존 학습 단원을 에피소드 형태로 재구성하고, 카테고리와 모델별로 다양한 한국 문화 경험을 확장할 수 있는 구조를 보여줍니다.',components:['모델 필터','카테고리 필터','추천 에피소드','한강 / 전통 맛집 / 성수동 / 카페 에피소드'],interactions:['필터 선택','각 에피소드 상세 진입','완료/진행 상태 확인'],flow:['에피소드 목록','상세','오늘의 표현'],note:'에피소드는 향후 장소·계절·이벤트·K-컬처 테마로 계속 확장할 수 있습니다.'},
  introHangang:{cat:'EPISODE',desc:'한강을 소재로 한 에피소드 상세 및 시작 화면',purpose:'한강 산책·자전거·피크닉 상황을 하나의 이야기로 보여주고, 관련 한국어 표현을 자연스럽게 연결합니다.',components:['한강 메인 비주얼','AI 모델 대사','오늘의 미션','완료 보상 미리보기'],interactions:['에피소드 시작','관련 흐름 확인'],flow:['한강 상세','오늘의 표현','말해보기','상황 미션'],note:'같은 학습 구조라도 장소가 바뀌면 완전히 다른 콘텐츠처럼 느껴지도록 구성합니다.'},
  introFood:{cat:'EPISODE',desc:'전통 맛집을 소재로 한 에피소드 상세 및 시작 화면',purpose:'한국 음식을 고르고 추천을 묻는 상황을 통해 음식 문화와 실사용 표현을 함께 경험하게 합니다.',components:['맛집 비주얼','AI 모델 02 안내','주문 미션','K-푸드 보상'],interactions:['에피소드 시작','다음 장면 이동'],flow:['전통 맛집 상세','표현','주문 미션','완료'],note:'AI 모델 02 콘텐츠 예시로, 모델별 에피소드 확장 가능성을 보여줍니다.'},
  introSeongsu:{cat:'EPISODE',desc:'성수동 팝업스토어를 소재로 한 트렌드형 에피소드',purpose:'관광 명소뿐 아니라 현재 한국에서 유행하는 팝업·굿즈 문화까지 콘텐츠화할 수 있음을 보여줍니다.',components:['성수동 팝업 비주얼','굿즈 찾기 미션','관련 표현','수집 보상'],interactions:['에피소드 시작','상황 미션 연결'],flow:['성수동 상세','표현','굿즈 위치 묻기','완료'],note:'전통 문화뿐 아니라 최신 한국 트렌드도 에피소드로 빠르게 확장할 수 있습니다.'},
  intro:{cat:'EPISODE',desc:'찬이 좋아하는 카페를 소재로 한 대표 에피소드 상세',purpose:'찬과 카페에 간다는 이야기 안에 단어·문장·상황 대화를 숨겨 기존 학습 구조를 콘텐츠 경험으로 바꿉니다.',components:['찬 메인 비주얼','오늘의 미션','카페 상황 설명','포토카드 보상'],interactions:['에피소드 시작','보상 미리보기'],flow:['카페 상세','오늘의 표현','말해보기','상황 미션'],note:'대표 시연용 기본 에피소드입니다.'},
  expressions:{cat:'EPISODE',desc:'에피소드 안에서 필요한 표현을 장면처럼 확인하는 화면',purpose:'“단어 학습” 대신 에피소드에 필요한 표현을 미리 만나는 장면으로 보여줍니다.',components:['AI 모델 안내','오늘의 표현 카드','뜻·음성 확인','다음 장면 CTA'],interactions:['표현 음성 듣기','다음으로 이동'],flow:['오늘의 표현','말해보기'],note:'교육 기능은 유지하지만 사용자에게는 학습 메뉴처럼 보이지 않도록 포장합니다.'},
  speak:{cat:'EPISODE',desc:'AI 모델과 함께 직접 문장을 말해보는 발화 화면',purpose:'점수 중심 평가보다 모델의 반응을 통해 말하기를 가볍고 재미있게 반복하게 합니다.',components:['대표 문장','마이크 버튼','AI 모델 리액션','다음 미션 CTA'],interactions:['마이크 클릭','발화 성공 피드백','상황 미션 이동'],flow:['말해보기','상황 미션'],note:'실제 음성 인식 대신 프로토타입에서는 클릭으로 성공 경험을 시연합니다.'},
  mission:{cat:'EPISODE',desc:'실제 상황처럼 역할을 수행하는 에피소드 핵심 미션',purpose:'배운 표현을 문제 풀이가 아니라 실제 상황에서 사용하도록 구성해 콘텐츠의 클라이맥스를 만듭니다.',components:['상황 배경','상대방 대사','힌트','마이크 입력','AI 모델 성공 반응'],interactions:['마이크 클릭','미션 성공','완료 화면 자동 이동'],flow:['상황 미션','에피소드 완료'],note:'대표님 시연 시 마이크 버튼을 눌러 성공 → 완료 전환을 보여주세요.'},
  clear:{cat:'EPISODE',desc:'에피소드 완료와 수집 보상을 연결하는 화면',purpose:'학습 결과표 대신 AI 모델의 축하 반응과 포토카드 획득을 중심으로 마무리합니다.',components:['AI 모델 축하 메시지','에피소드 완료','포토카드 보상','다음 행동 CTA'],interactions:['컬렉션에 저장','다시 플레이','다음 에피소드 이동'],flow:['에피소드 완료','컬렉션'],note:'완료 자체보다 “무엇을 얻었는가”가 기억에 남도록 구성합니다.'},
  play:{cat:'PLAY',desc:'에피소드에서 만난 표현을 게임으로 다시 사용하는 플레이 화면',purpose:'복습 메뉴 대신 미니게임을 제공하여 공부한다는 느낌 없이 표현을 자연스럽게 반복하게 합니다.',components:['CHAN RUN 대표 배너','게임 설명','최근 플레이 기록'],interactions:['게임 시작','기록 확인'],flow:['플레이','CHAN RUN','게임 결과'],note:'MVP에서는 게임 1종에 집중합니다.'},
  run:{cat:'PLAY',desc:'실제 게임처럼 보이도록 구성한 CHAN RUN 플레이 화면',purpose:'사용자가 표현을 말하면 찬이 장애물을 넘는 구조로, 음성 입력과 캐릭터 반응을 게임 경험으로 연결합니다.',components:['러닝 카메라 보빙·도로 러시','찬 캐릭터 보폭 애니메이션','다가오는 보이스 게이트','표현 미션 HUD','마이크 버튼'],interactions:['마이크 클릭 또는 Space/Enter','캐릭터 점프·게이트 통과','도로/전경 패럴랙스 러닝 연출','NICE 리액션','5단계 완료 후 결과 이동'],flow:['CHAN RUN','장애물 통과','완주'],note:'실제 게임 엔진이 아닌 HTML 인터랙션 목업이지만 플레이 감각을 확인할 수 있습니다.'},
  result:{cat:'PLAY',desc:'게임 완료 결과와 컬렉션 보상을 보여주는 화면',purpose:'점수표보다 성공한 미션 수와 보상을 강조하여 게임 후 다음 행동을 유도합니다.',components:['완주 결과','AI 모델 리액션','보상 카드','다시 플레이 CTA'],interactions:['보상 확인','다시 플레이','컬렉션 이동'],flow:['게임 결과','컬렉션'],note:'게임도 컬렉션을 확장하는 주요 수단으로 연결됩니다.'},
  collection:{cat:'COLLECTION',desc:'AI 모델과 함께 모은 사진·음성·스페셜 콘텐츠를 확인하는 화면',purpose:'학습 진도 대신 좋아하는 모델의 콘텐츠가 하나씩 쌓이는 경험을 핵심 보상으로 제공합니다.',components:['모델 필터','포토카드 / 보이스 / 스페셜 탭','수집 현황','샵 연결'],interactions:['탭 전환','포토카드 상세','샵 이동'],flow:['컬렉션','시리즈/상세','샵'],note:'수집은 재방문과 향후 상품 구매로 이어지는 핵심 팬덤 자산입니다.'},
  series:{cat:'COLLECTION',desc:'포토카드를 테마별 시리즈 단위로 모으는 화면',purpose:'개별 카드 획득에서 끝나지 않고 시리즈 완성 목표를 만들어 지속적인 콘텐츠 참여를 유도합니다.',components:['시리즈 진행률','획득/잠금 카드','완성 보상','관련 에피소드'],interactions:['관련 에피소드 이동'],flow:['시리즈','에피소드'],note:'시리즈 완성 → 특별 음성 공개 구조를 보여줍니다.'},
  photo:{cat:'COLLECTION',desc:'획득한 디지털 포토카드를 크게 확인하는 상세 화면',purpose:'보상을 교육 배지가 아닌 실제 팬덤 디지털 굿즈처럼 소장하고 싶은 형태로 보여줍니다.',components:['포토카드 이미지','모델·시리즈 정보','획득 조건','관련 에피소드'],interactions:['이미지 크게 보기','관련 에피소드 이동'],flow:['포토카드 상세','에피소드'],note:'향후 한정판·실물 포토카드 BM으로 확장 가능한 구조입니다.'},
  voice:{cat:'COLLECTION',desc:'에피소드와 시리즈에서 획득한 AI 모델 음성을 다시 듣는 화면',purpose:'사진뿐 아니라 모델의 목소리도 수집 자산으로 확장합니다.',components:['모델별 보이스 리스트','재생 버튼','잠금 콘텐츠'],interactions:['보이스 재생','잠금 조건 확인'],flow:['보이스','시리즈/샵'],note:'스페셜 보이스는 수집 보상과 샵 상품 양쪽으로 확장 가능합니다.'},
  special:{cat:'COLLECTION',desc:'한정 이미지·비하인드 등 특별 콘텐츠를 모아보는 화면',purpose:'일반 포토카드 외에도 팬덤을 위한 한정 콘텐츠 확장 가능성을 보여줍니다.',components:['스페셜 이미지','한정 포토','비하인드','이벤트 콘텐츠'],interactions:['콘텐츠 열람','잠금 상태 확인'],flow:['스페셜','컬렉션'],note:'초기에는 무료/잠금형 콘텐츠 중심으로 검증합니다.'},
  shop:{cat:'SHOP',desc:'좋아하는 AI 모델의 디지털 콘텐츠와 향후 굿즈를 발견하는 팬덤형 샵',purpose:'일반 쇼핑몰이 아니라 컬렉션을 더 확장하고 싶은 팬을 위한 콘텐츠 스토어로 구성합니다.',components:['모델·카테고리 필터','추천 상품','디지털 콘텐츠','한정 포토카드','굿즈'],interactions:['상품 상세 진입','포인트 상품 선택','컬렉션 연계'],flow:['샵','상품 상세','컬렉션'],note:'샵은 하단 메뉴가 아니라 홈·컬렉션에서 자연스럽게 진입합니다.'},
  shopDetail:{cat:'SHOP',desc:'스페셜 보이스 상품을 미리 듣고 포인트로 획득하는 상세 화면',purpose:'디지털 상품의 소장 경험과 컬렉션 연결 방식을 시연합니다.',components:['찬 상품 비주얼','미리듣기','관련 컬렉션','트랙 리스트','500P 획득 CTA'],interactions:['미리듣기','500P로 열기','컬렉션에서 보기'],flow:['상품 상세','포인트 획득','컬렉션'],note:'획득 시 보유 포인트가 실제로 감소하도록 프로토타입 상태값이 연결되어 있습니다.'},
  my:{cat:'MY',desc:'사용자 프로필과 서비스 활동을 간단히 확인하는 화면',purpose:'교육 성적표가 아닌 서비스 활동과 개인 설정 중심으로 구성합니다.',components:['프로필','활동 요약','활동 기록','언어·알림·설정'],interactions:['각 설정 화면 이동'],flow:['마이','활동/언어/알림/설정'],note:'학습 리포트 메뉴는 전면에 노출하지 않습니다.'},
  activity:{cat:'MY',desc:'에피소드·게임·수집 활동을 타임라인으로 확인하는 화면',purpose:'학습 리포트가 아니라 사용자가 서비스에서 무엇을 즐겼는지 기록합니다.',components:['활동 필터','오늘/어제 타임라인','에피소드·플레이·컬렉션 기록'],interactions:['필터 선택'],flow:['활동 기록','마이'],note:'성과보다 경험 히스토리 관점으로 보여줍니다.'},
  language:{cat:'MY',desc:'서비스 표시 언어를 선택하는 설정 화면',purpose:'글로벌 확장을 고려한 다국어 구조를 보여주되 대표 시연 기본 언어는 한국어로 유지합니다.',components:['한국어 기본 선택','영어·일본어·동남아 언어·중국어'],interactions:['언어 선택'],flow:['언어 설정','마이'],note:'프로토타입에서는 선택 상태만 변경합니다.'},
  notifications:{cat:'MY',desc:'새 콘텐츠와 서비스 알림을 사용자가 직접 설정하는 화면',purpose:'에피소드·모델 콘텐츠·컬렉션 등 재방문을 유도하는 알림 항목을 선택하게 합니다.',components:['에피소드 알림','모델 콘텐츠 알림','컬렉션·이벤트·서비스 알림'],interactions:['토글 ON/OFF'],flow:['알림 설정','마이'],note:'실제 시스템 푸시는 연결하지 않은 UI 프로토타입입니다.'},
  settings:{cat:'MY',desc:'계정·약관·문의 등 기본 서비스 설정 화면',purpose:'프로토타입의 전체 서비스 완성도를 보여주는 기본 설정 구조입니다.',components:['계정 관리','이용약관','개인정보 처리방침','문의','앱 버전','로그아웃/탈퇴'],interactions:['각 항목 안내 토스트'],flow:['설정','마이'],note:'실제 계정 변경 기능은 프로토타입 범위에서 제외합니다.'}
};
function renderGuide(){
  const g=guideData[current]||guideData.home;
  const no=menuOrder.indexOf(current)+1;
  const q=id=>document.getElementById(id);
  if(!q('guideTitle')) return;
  q('guideCategory').textContent=g.cat;
  q('guideScreenNo').textContent=`SCREEN ${String(no).padStart(2,'0')}`;
  q('guideTitle').textContent=screenNames[current];
  q('guideDescription').textContent=g.desc;
  q('guidePurpose').textContent=g.purpose;
  q('guideComponents').innerHTML=g.components.map(v=>`<li>${v}</li>`).join('');
  q('guideInteractions').innerHTML=g.interactions.map(v=>`<li>${v}</li>`).join('');
  q('guideFlow').innerHTML=g.flow.map((v,i)=>`<span class="flow-step"><span class="flow-pill">${v}</span>${i<g.flow.length-1?'<span class="material-symbols-rounded flow-arrow">arrow_forward</span>':''}</span>`).join('');
  q('guideNote').textContent=g.note||'';
}
function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>toastEl.classList.remove('show'),1300)}
function go(id,push=true){if(!screenNames[id])return;if(push&&current!==id)historyStack.push(current);current=id;render()}
function back(){const p=historyStack.pop();if(p){current=p;render()}else go('home',false)}
function topbar(title='K.Bias',backable=false){return `<header class="topbar"><button class="icon-btn" data-action="${backable?'back':'menu'}">${mi(backable?'arrow_back':'menu')}</button><div class="brand-title">${title}</div><button class="icon-btn" data-action="notice">${mi('notifications')}</button></header>`}
function bottomNav(active){return `<nav class="bottom-nav">${navItems.map(([id,icon,label])=>`<button class="nav-item ${active===id?'active':''}" data-go="${id}"><span class="nav-icon">${mi(icon)}</span><span>${label}</span></button>`).join('')}</nav>`}
function shell(content,active='home',opts={}){window.__navActive=opts.noNav?null:active;return `<section class="screen ${opts.noNav?'no-nav':''}">${content}</section>`}
function modelSwitch(){return `<div class="model-switch"><button class="${state.model==='chan'?'active':''}" data-model="chan">찬 (Chan)</button><button class="${state.model==='model2'?'active':''}" data-model="model2">AI 모델 02</button></div>`}
function modelData(){return state.model==='chan'?{name:'찬',hero:'assets/chan_home.jpg',line:'오늘 뭐 하고 싶어?',sub:'새로운 서울 이야기가 기다리고 있어'}:{name:'AI 모델 02',hero:'assets/special_model2.jpg',line:'오늘은 어떤 한국을 만나볼까?',sub:'새로운 에피소드와 컬렉션이 열렸어요'}}
const episodeData={
  hangang:{key:'hangang',route:'introHangang',ep:'EP.01',title:'한강 공원 산책',category:'여행',model:'찬',modelKey:'chan',hero:'assets/ep1.jpg',avatar:'assets/chan_avatar.jpg',speakAvatar:'assets/chan_silver.jpg',icon:'park',line:'“날씨 좋은데 한강 같이 걸을래?”',mission:'찬과 한강에서 하고 싶은 활동 말하기',missionSub:'산책 · 자전거 · 피크닉 표현을 사용해요',expressionSub:'한강에서 사용할 수 있는 표현',words:[['한강','Han River'],['공원','Park'],['산책','Walk'],['자전거','Bicycle'],['좋아요','Sounds good']],speak:'한강 공원에서 같이 산책해요.',prompt:'찬: “자전거 탈래, 산책할래?”',counterpart:'찬',hint:'저는 한강 공원에서 산책하고 싶어요.',reaction:'좋아! 그럼 천천히 걸어보자.',reward:'한강 데이 시리즈 #01',clearQuote:'“오늘 한강 진짜 좋았다. 다음엔 야경도 같이 보자!”',points:40,affinity:12},
  food:{key:'food',route:'introFood',ep:'EP.02',title:'전통 맛집 탐방',category:'음식점',model:'AI 모델 02',modelKey:'model2',hero:'assets/ep2.jpg',avatar:'assets/special_model2.jpg',speakAvatar:'assets/special_model2.jpg',icon:'restaurant',line:'“진짜 한국 음식 먹어보고 싶지 않아?”',mission:'전통 맛집에서 먹고 싶은 메뉴 주문하기',missionSub:'추천을 묻고 메뉴를 주문해요',expressionSub:'전통 맛집에서 사용할 수 있는 표현',words:[['비빔밥','Bibimbap'],['불고기','Bulgogi'],['추천','Recommendation'],['맛있어요','Delicious'],['주세요','Please give me']],speak:'불고기 하나 추천해 주세요.',prompt:'직원: “어떤 메뉴로 드릴까요?”',counterpart:'직원',hint:'불고기 하나 추천해 주세요.',reaction:'좋아! 주문 완벽했어.',reward:'K-푸드 시리즈 #02',clearQuote:'“잘했어! 다음에는 더 매운 메뉴에도 도전해 볼까?”',points:50,affinity:10},
  seongsu:{key:'seongsu',route:'introSeongsu',ep:'EP.03',title:'성수동 팝업스토어',category:'일상',model:'찬',modelKey:'chan',hero:'assets/ep3.jpg',avatar:'assets/chan_avatar.jpg',speakAvatar:'assets/chan_silver.jpg',icon:'storefront',line:'“성수동에 재미있는 팝업 열렸대. 같이 가볼래?”',mission:'팝업스토어에서 원하는 굿즈 위치 물어보기',missionSub:'상품 위치를 묻고 원하는 것을 골라요',expressionSub:'팝업스토어에서 사용할 수 있는 표현',words:[['팝업스토어','Pop-up store'],['굿즈','Goods'],['어디예요','Where is it?'],['이거','This one'],['주세요','Please give me']],speak:'이 굿즈는 어디에 있어요?',prompt:'직원: “찾으시는 상품 있으세요?”',counterpart:'직원',hint:'이 굿즈는 어디에 있어요?',reaction:'찾았다! 이거 꽤 인기 많대.',reward:'성수 팝업 시리즈 #03',clearQuote:'“오늘 득템했네! 다음 팝업도 같이 가자.”',points:50,affinity:14},
  cafe:{key:'cafe',route:'intro',ep:'EP.04',title:'찬이 좋아하는 카페',category:'카페',model:'찬',modelKey:'chan',hero:'assets/chan_episode.jpg',avatar:'assets/chan_avatar.jpg',speakAvatar:'assets/chan_silver.jpg',icon:'local_cafe',line:'“내가 좋아하는 카페가 있는데 같이 가볼래?”',mission:'찬과 함께 한국어로 음료 주문하기',missionSub:'음성 인식 기반 카페 롤플레잉',expressionSub:'카페에서 사용할 수 있는 표현',words:[['아메리카노','Americano'],['라떼','Latte'],['아이스','Iced'],['한 잔','One cup'],['주세요','Please give me']],speak:'아이스 아메리카노 한 잔 주세요.',prompt:'직원: “주문하시겠어요?”',counterpart:'직원',hint:'아이스 아메리카노 한 잔 주세요.',reaction:'오, 완벽한데?',reward:'서울 카페 시리즈 #04',clearQuote:'“잘했어! 이제 혼자서도 주문할 수 있겠는데?”',points:50,affinity:15}
};
function currentEpisode(){return episodeData[state.currentEpisode]||episodeData.cafe}
function setEpisode(key){if(episodeData[key]){state.currentEpisode=key;state.recorded=false;state.saved=false}}
function bindCommon(){
  app.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
  app.querySelectorAll('[data-action="back"]').forEach(b=>b.onclick=back);
  app.querySelectorAll('[data-action="menu"]').forEach(b=>b.onclick=()=>toast('화면 메뉴는 좌측 프로토타입 패널에서 확인할 수 있어요.'));
  app.querySelectorAll('[data-action="notice"]').forEach(b=>b.onclick=()=>toast('새로운 알림이 2개 있어요.'));
  app.querySelectorAll('[data-model]').forEach(b=>b.onclick=()=>{state.model=b.dataset.model;render()});
  app.querySelectorAll('[data-toast]').forEach(b=>b.onclick=()=>toast(b.dataset.toast));
}
function viewHome(){const m=modelData();return shell(`${topbar()}<div class="page">${modelSwitch()}<div class="shop-entry-row"><button class="shop-shortcut" data-go="shop">${mi('storefront')}<span><b>샵</b><small>모델의 특별 콘텐츠 보기</small></span>${mi('chevron_right')}</button></div><section class="hero-card"><img src="${m.hero}" alt="${m.name}"><div class="hero-content"><span class="hero-kicker">${m.name}의 메시지</span><h1 class="hero-title">${m.line}</h1><p class="hero-sub">${m.sub}</p><button class="primary-btn" data-episode-go="cafe">같이 가기</button></div></section><section class="section"><h2 class="section-title">이어하기</h2><button class="continue-card" data-episode-go="seongsu" style="width:100%;text-align:left"><img class="thumb" src="assets/ep3.jpg"><div><span class="eyebrow">EP.03</span><div class="card-title">성수동 팝업스토어</div><span class="muted">미션 2까지 완료</span></div><span class="arrow-pill">${mi('arrow_forward')}</span></button></section><section class="section"><h2 class="section-title">새로운 에피소드</h2><div class="feature-card"><img src="assets/cafe_feature.jpg"><div class="feature-info"><span class="tag">EP.04</span><h3>찬이 좋아하는 카페</h3><button class="primary-btn" data-episode-go="cafe">에피소드 보기</button></div></div></section><section class="section"><div class="two-card-grid"><button class="mini-feature" data-go="play" style="text-align:left"><span class="eyebrow">오늘의 플레이</span><h3>CHAN RUN :<br>SEOUL</h3><span class="round-icon">${mi('sports_esports')}</span></button><button class="mini-feature collection-card" data-go="collection" style="text-align:left"><span class="eyebrow">새로운 컬렉션</span><h3>서울 카페 시리즈</h3><span class="muted">포토카드 #02</span><span class="round-icon" style="background:#fff;color:var(--purple)">${mi('collections_bookmark')}</span></button></div></section></div>`,'home')}
function viewEpisodes(){
  const list=['hangang','food','seongsu','cafe'].map(k=>episodeData[k]);
  const filtered=list.filter(d=>state.category==='전체'||d.category===state.category);
  return shell(`${topbar()}<div class="page"><div class="page-head"><h1>에피소드</h1><p>두 모델과 함께 새로운 한국을 경험해 보세요</p></div>${modelSwitch()}<div class="chip-row" style="margin-bottom:22px">${['전체','카페','음식점','여행','일상'].map(c=>`<button class="chip ${state.category===c?'active':''}" data-category="${c}">${c}</button>`).join('')}</div><div class="feature-card"><img src="assets/episode_feature.jpg"><div class="feature-info"><span class="tag">EP.04</span><span class="tag ghost">카페</span><h3>찬이 좋아하는 카페</h3><button class="primary-btn" data-episode-go="cafe">시작하기</button></div></div><section class="section"><div class="episode-section-head"><h2 class="section-title">모든 에피소드</h2><span class="episode-open-note">카드를 눌러 상세 보기</span></div><div class="episode-list">${filtered.length?filtered.map(d=>`<button class="episode-row episode-openable" data-episode-go="${d.key}" style="width:100%;text-align:left"><img src="${d.hero}"><div><div class="episode-meta"><span class="eyebrow">${d.ep}</span><span class="episode-category">${d.category}</span></div><div class="card-title">${d.title}</div><div class="model-line"><span class="model-dot">${mi('person')}</span>${d.model}</div><span class="episode-open-link">상세 보기 ${mi('arrow_forward')}</span></div></button>`).join(''):`<div class="episode-empty">${mi('search_off')}<b>해당 카테고리의 에피소드가 아직 없어요.</b><span>다른 카테고리를 선택해 주세요.</span></div>`}<div class="episode-row lock-row"><div class="lock-placeholder">${mi('lock')}</div><div><span class="eyebrow">EP.05</span><div class="card-title">잠금 해제 필요</div><span class="muted">이전 에피소드를 완료하세요</span></div></div></div></section></div>`,'episodes')
}
function viewIntro(){const d=currentEpisode();return shell(`<div class="intro-hero episode-hero-${d.key}"><img src="${d.hero}" alt="${d.title}"><button class="back-float" data-action="back">${mi('arrow_back')}</button><div class="episode-model-badge">${mi(d.modelKey==='chan'?'person':'auto_awesome')} ${d.model}</div><div class="intro-overlay"><div><span class="tag">${d.ep}</span><span class="tag ghost">${d.category}</span></div><h2>${d.title}</h2><p>${d.line}</p></div></div><div class="page"><section class="section"><h2 class="section-title">오늘의 미션</h2><div class="mission-card"><div class="mission-row"><div class="mission-icon">${mi(d.icon)}</div><div><div class="card-title">${d.mission}</div><span class="muted"><span class="inline-icon">${mi('mic')}</span>${d.missionSub}</span></div></div><button class="primary-btn" data-go="expressions" style="margin-top:18px">에피소드 시작 <span class="inline-icon">${mi('arrow_forward')}</span></button></div></section><section class="section"><h2 class="section-title">에피소드 흐름</h2><div class="episode-flow-mini"><span>오늘의 표현</span>${mi('chevron_right')}<span>말해보기</span>${mi('chevron_right')}<span>상황 미션</span>${mi('chevron_right')}<span>완료</span></div></section><section class="section"><h2 class="section-title">완료 보상</h2><div class="reward-preview"><div class="reward-lock">${mi('lock')}</div><div><span class="tag" style="background:#eee4ff;color:var(--purple)">포토카드</span><div class="card-title">${d.reward}</div><span class="muted">에피소드를 완료하고 해당 테마의 디지털 포토카드를 잠금 해제하세요.</span></div></div></section><div class="stat-grid"><div class="stat-card">${mi('favorite')}<span class="muted">예상 호감도</span><b>+${d.affinity}</b></div><div class="stat-card">${mi('paid')}<span class="muted">획득 포인트</span><b style="color:#076fb5">${d.points}P</b></div></div></div>`,'episodes')}
function viewExpressions(){const d=currentEpisode();return shell(`<div class="lesson"><div class="progress-head"><button data-action="back">×</button><div class="dots"><i class="dot active"></i><i class="dot"></i><i class="dot"></i></div></div><div class="character-bubble"><img class="avatar" src="${d.avatar}"><div class="speech">“먼저 오늘 필요한 표현부터 볼까?”</div></div><div class="lesson-episode-label">${d.ep} · ${d.title}</div><h1>오늘의 표현</h1><p class="muted">${d.expressionSub}</p><div class="expression-list">${d.words.map(([ko,en])=>`<div class="expression-card"><div><strong>${ko}</strong><span>${en}</span></div><button class="speaker" data-toast="‘${ko}’ 음성을 재생합니다">${mi('volume_up')}</button></div>`).join('')}</div><div class="sticky-action"><button class="primary-btn" data-go="speak">다음</button></div></div>`,null,{noNav:true})}
function viewSpeak(){const d=currentEpisode();const phrase=d.speak.replace(/\s(?=[^\s]+$)/,'<br>');return shell(`${topbar('말해보기',true)}<div class="speak-screen"><div class="speak-episode-pill">${d.ep} · ${d.title}</div><img class="speak-avatar" src="${d.speakAvatar}"><div><span class="model-quote">${d.model==='찬'?'이번에는 한 번 말해볼래?':'이번 표현을 직접 말해볼까요?'}</span></div><div class="big-phrase">“${phrase}”</div><div class="muted">마이크를 누르고 또박또박 말해보세요</div><div class="mic-wrap ${state.recorded?'recording':''}" id="speakMicWrap"><button class="mic-button" id="speakMic">${mi('mic')}</button></div><div class="reaction-chips"><span class="reaction-chip">${state.recorded?'좋아!':'준비'}</span><span class="reaction-chip blue">${state.recorded?'Nice!':'말해보기'}</span></div><button class="primary-btn speak-next" data-go="mission">상황 미션으로 이동 ${mi('arrow_forward')}</button></div>`,null,{noNav:true})}
function viewMission(){const d=currentEpisode();const prompt=d.prompt.replace(`${d.counterpart}: `,'');return shell(`<div class="mission-screen"><img class="mission-photo" src="${d.hero}" alt="${d.title}"><button class="mission-close" data-action="back">${mi('close')}</button><span class="mission-count">미션 1 / 5</span><div class="mission-title">상황 미션<span class="mission-subtitle">${d.mission}</span></div><div class="staff-bubble">${prompt}<small>${d.counterpart}</small></div><div class="chan-hint"><img src="${d.avatar}">${d.model==='찬'?'이번에는 직접 말해볼까?':'지금 표현을 사용해 보세요.'}</div><div class="mission-panel"><div class="hint-box">${mi('lightbulb')}<div class="hint-copy"><b>힌트</b><span>${d.hint}</span></div></div><div class="mission-mic"><button id="missionMic">${mi('mic')}</button></div><div class="muted" style="text-align:center">마이크를 눌러 말해보세요</div><div class="mission-success" id="missionSuccess">${mi('check_circle','mi-fill')} ${d.reaction}</div></div></div>`,null,{noNav:true})}
function viewClear(){const d=currentEpisode();const dots=Array.from({length:13},(_,i)=>`<i style="left:${5+i*7}%;animation-delay:${(i%5)*.25}s"></i>`).join('');return shell(`<div class="clear-screen"><div class="confetti">${dots}</div><div class="clear-episode-pill">${d.ep} · ${d.title}</div><h1 class="clear-title">에피소드 완료</h1><div class="clear-sub">EPISODE CLEAR</div><img class="clear-avatar" src="${d.avatar}"><div class="quote-box">${d.clearQuote}</div><h2 style="font-size:20px;margin:28px 0 5px">새로운 포토카드를 획득했어요</h2><div class="muted">${d.reward}</div><img class="photo-reward" src="${d.hero}"><button class="primary-btn" id="saveReward">${mi(state.saved?'bookmark_added':'bookmark_add')} ${state.saved?'컬렉션에 저장됨':'컬렉션에 저장'}</button><div class="btn-row" style="margin-top:10px"><button class="secondary-btn" data-episode-go="${d.key}">다시 플레이</button><button class="secondary-btn" data-go="episodes" style="background:#f0e4ff;color:var(--purple);border-color:transparent">다음 에피소드</button></div></div>`,null,{noNav:true})}
function viewPlay(){return shell(`${topbar()}<div class="page"><div class="page-head"><h1>플레이</h1><p>AI 모델과 함께 미션에 도전해 보세요</p></div><div class="play-hero"><img src="assets/run_hero.jpg"><div class="feature-info"><span class="tag ghost">${mi('sports_esports')} NEW EVENT</span><h3>CHAN RUN : SEOUL</h3><p style="font-size:14px;line-height:1.5">말하면 점프! 오늘의 표현으로 장애물을 넘어보세요.</p><button class="primary-btn" data-go="run">게임 시작</button></div></div><div class="play-stat-grid"><div class="play-stat"><div class="big-icon">${mi('emoji_events','mi-fill')}</div><p class="muted">오늘 최고 기록</p><div class="card-title">7개의 장애물 통과</div></div><div class="play-stat"><div class="big-icon">${mi('stars','mi-fill')}</div><p class="muted">컬렉션 보상</p><div class="progress-bar"><span></span></div><div class="card-title">1/3</div></div></div></div>`,'play')}
function viewRun(){
  const words=['주세요','한 잔','아메리카노','감사합니다','포장해 주세요'];
  const word=words[Math.min(state.runStep,words.length-1)];
  const pct=Math.min(100,(state.runStep/words.length)*100);
  const combo=state.runStep>0?`COMBO × ${state.runStep}`:'VOICE GATE';
  return `<section class="screen no-nav run-screen"><div class="game-screen premium-run ${state.runPaused?'is-paused':''}" id="gameScreen">
    <div class="premium-scene" id="gameScene" aria-hidden="true">
      <img src="assets/run_hero.jpg" alt="">
      <div class="scene-vignette"></div>
      <div class="run-depth-road"><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <div class="run-side-rush run-side-left"><i></i><i></i><i></i><i></i></div>
      <div class="run-side-rush run-side-right"><i></i><i></i><i></i><i></i></div>
      <div class="scene-speed-lines"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <div class="scene-orbs"><i></i><i></i><i></i><i></i></div>
    </div>
    <div class="runner-focus" id="runnerFocus" aria-hidden="true">
      <div class="runner-image"></div>
      <div class="runner-motion-shadow"></div>
      <div class="runner-dust"><i></i><i></i><i></i><i></i></div>
    </div>

    <div class="run-hud premium-hud">
      <button class="hud-icon" id="runPause" aria-label="일시정지">${mi(state.runPaused?'play_arrow':'pause')}</button>
      <div class="hud-progress-wrap">
        <div class="hud-label"><b>CHAN RUN · SEOUL</b><span>${state.runStep+1} / ${words.length}</span></div>
        <div class="game-progress"><span style="width:${pct}%"></span></div>
      </div>
      <div class="coin-pill">${mi('diamond','mi-fill')}<b>120</b></div>
    </div>

    <div class="game-status-row">
      <span class="speed-badge">${mi('speed')} SPEED 1.4×</span>
      <span class="combo-badge">${combo}</span>
    </div>

    <div class="premium-mission-card">
      <small>VOICE MISSION</small>
      <strong>${word}</strong>
      <span>정확히 말하면 보이스 게이트를 통과해요</span>
    </div>

    <div class="voice-gate-zone" id="voiceGate">
      <div class="gate-glow"></div>
      <div class="gate-post gate-left"><i></i></div>
      <div class="gate-beam"><span>${word}</span></div>
      <div class="gate-post gate-right"><i></i></div>
      <div class="gate-floor"></div>
    </div>

    <div class="run-feedback premium-feedback" id="gameFeedback"><b>NICE!</b><span>좋았어! +1 COMBO</span></div>

    <div class="premium-voice-panel">
      <div class="voice-live-dot"></div>
      <div class="voice-copy"><b>${state.runStep?'다음 게이트 준비 완료':'목소리로 게이트를 넘으세요'}</b><span>마이크를 눌러 발음 성공을 시뮬레이션</span></div>
      <div class="voice-wave premium-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      <button class="game-mic premium-mic" id="gameMic" aria-label="말하기">${mi('mic')}</button>
    </div>
    <div class="run-tip premium-tip">${mi('graphic_eq')} <span>“${word}”</span> 를 말하면 통과!</div>
  </div></section>`
}
function viewResult(){return shell(`<div class="result-screen"><div class="result-star">${mi('emoji_events','mi-fill')}</div><h1 class="result-title">완주 성공!</h1><div style="font-size:20px">5개의 보이스 게이트 클리어</div><img class="victory-img" src="assets/victory_chan.jpg"><div class="quote-box">“좋았어! 다음에는 더 빠르게 달려보자.”<div style="color:var(--purple);font-size:13px;margin-top:8px">- Chan -</div></div><div class="muted">획득한 보상</div><div class="result-rewards"><div class="result-reward"><div class="result-icon result-art"><img src="assets/reward_star.png" alt="스페셜 포토카드 보상"></div><div class="card-title">스페셜<br>포토카드</div></div><div class="result-reward"><div class="result-icon result-art"><img src="assets/reward_points.png" alt="시리즈 진행 보상"></div><div class="card-title">시리즈 진행</div><div style="color:var(--purple);font-size:19px">+1</div></div></div><button class="primary-btn" data-go="collection">보상 받기 ${mi('check')}</button><button class="secondary-btn" data-go="run" style="margin-top:9px">다시 플레이 ${mi('replay')}</button></div>`,null,{noNav:true})}
function viewCollection(){const photoTab=state.collectionTab==='photo';const voiceTab=state.collectionTab==='voice';const specialTab=state.collectionTab==='special';let content='';if(photoTab){content=`<div class="photo-grid"><button class="photo-card" data-go="photo"><img src="assets/collection_chan.jpg"><div class="photo-card-info"><span class="tag ghost">서울 카페 시리즈</span><div class="card-title">카페 데이트 #02</div></div></button><button class="photo-card" data-go="photo"><img src="assets/collection_model2.jpg"><div class="photo-card-info"><span class="tag ghost">여름 화보</span><div class="card-title">AI 모델 02 #012</div></div></button><div class="photo-card locked"></div><div class="photo-card locked"></div></div><button class="secondary-btn" data-go="series" style="margin-top:16px">시리즈 보기</button>`}else if(voiceTab){content=`<div class="voice-list"><div class="voice-row"><img class="voice-avatar" src="assets/chan_avatar.jpg"><div><div class="card-title">모닝 메시지</div><span class="muted">좋은 아침. 오늘도 같이 해볼까?</span></div><button class="play-voice" data-toast="보이스를 재생합니다">${mi('play_arrow','mi-fill')}</button></div><div class="voice-row"><img class="voice-avatar" src="assets/chan_avatar.jpg"><div><div class="card-title">카페 에피소드</div><span class="muted">내가 좋아하는 카페가 있는데 같이 가볼래?</span></div><button class="play-voice" data-toast="보이스를 재생합니다">${mi('play_arrow','mi-fill')}</button></div><div class="locked-panel">${mi('lock')} 서울 카페 시리즈 완료 후 공개</div></div>`}else{content=`<div class="special-grid"><button class="special-card" data-go="special"><img src="assets/special_model2.jpg"><div class="cap"><b>스페셜 이미지</b><div class="muted">가을밤의 산책</div></div></button><div class="special-card locked"><img src="assets/collection_model2.jpg"><div class="cap"><b>한정 포토</b><div class="muted">시크릿 다이어리</div></div></div><button class="special-card" data-go="special"><img src="assets/special_bts.jpg"><div class="cap"><b>비하인드 콘텐츠</b><div class="muted">촬영장 스케치</div></div></button><div class="special-card locked"><img src="assets/cafe_feature.jpg"><div class="cap"><b>이벤트 콘텐츠</b><div class="muted">100일 기념 영상</div></div></div></div>`}
return shell(`${topbar()}<div class="page"><div class="page-head"><h1>컬렉션</h1><p>두 모델과 함께 모은 순간들</p></div>${modelSwitch()}<button class="collection-shop-link" data-go="shop">${mi('storefront')}<span><b>샵에서 특별 콘텐츠 보기</b><small>내 컬렉션과 연결된 보이스·포토카드를 확인해 보세요.</small></span>${mi('arrow_forward')}</button><div class="collection-summary"><div class="summary-main"><div style="font-size:25px;color:var(--purple)">▱</div><div class="muted">포토카드</div><div class="summary-number" style="color:var(--purple)">12/30</div><div class="progress-bar"><span style="width:40%;background:var(--purple)"></span></div></div><div><div class="summary-small"><span>▥ 보이스</span><b>4/10</b></div><div class="summary-small"><span>☆ 스페셜</span><b>2/8</b></div></div></div><div class="collection-tabs"><button class="${photoTab?'active':''}" data-coltab="photo">포토카드</button><button class="${voiceTab?'active':''}" data-coltab="voice">보이스</button><button class="${specialTab?'active':''}" data-coltab="special">스페셜</button></div>${content}</div>`,'collection')}
function viewSeries(){const items=[['01 모닝 커피',true],['02 카페 데이트',true],['03 디저트 타임',true],['04 비 오는 날의 카페',false],['05 시크릿 포토',false]];return shell(`${topbar('시리즈')}<div class="page"><div class="section" style="margin-top:18px"><div class="feature-card" style="height:220px"><img src="assets/series_hero.jpg"><div class="feature-info"><span class="muted" style="color:#eee">시리즈 (3/5)</span><h3>찬 - 서울 카페 시리즈</h3></div></div><div class="progress-bar"><span style="width:60%"></span></div><div class="series-list">${items.map(([t,done])=>`<div class="series-item ${done?'done':'locked'}"><span>${t}</span><span>${done?mi('check_circle','mi-fill'):mi('lock')}</span></div>`).join('')}</div></div><div class="special-voice"><span class="gift">${mi('redeem')}</span><div><div class="card-title">스페셜 보이스</div><span class="muted">모든 카드를 모으면 공개됩니다.</span></div></div><button class="primary-btn" data-go="episodes" style="margin-top:22px">관련 에피소드 보기</button></div>`,'collection')}
function viewPhoto(){return shell(`${topbar('컬렉션',true)}<div class="photo-detail"><div class="eyebrow">포토카드 상세</div><div class="photo-detail-card"><img src="assets/clear_card.jpg"></div><h2 style="margin:8px 0 4px">카페 데이트</h2><div class="muted">서울 카페 시리즈 · CARD #02</div><div class="info-list"><div class="info-row"><span>AI 모델</span><b>찬</b></div><div class="info-row"><span>획득일</span><b>2026.08.10</b></div><div class="info-row"><span>획득 조건</span><b style="color:var(--purple)">EP.04 완료</b></div></div><button class="primary-btn" data-toast="포토카드를 크게 표시합니다">${mi('zoom_in')} 이미지 크게 보기</button><button class="secondary-btn" data-go="intro" style="margin-top:8px">관련 에피소드 보기</button></div>`,null,{noNav:true})}
function viewVoice(){return shell(`${topbar()}<div class="page"><div class="page-head"><h1>보이스</h1><p>두 모델과 함께했던 순간을 다시 들어보세요</p></div><div class="chip-row"><button class="chip active">전체</button><button class="chip">찬</button><button class="chip">AI 모델 02</button></div><div class="voice-list"><div class="voice-row"><img class="voice-avatar" src="assets/chan_avatar.jpg"><div><div class="card-title">모닝 메시지</div><span class="muted">좋은 아침. 오늘도 같이 해볼까?</span></div><button class="play-voice" data-toast="보이스를 재생합니다">${mi('play_arrow','mi-fill')}</button></div><div class="voice-row"><img class="voice-avatar" src="assets/ep2.jpg"><div><div class="card-title">카페 에피소드</div><span class="muted">내가 좋아하는 카페가 있는데 같이 가볼래?</span></div><button class="play-voice" data-toast="보이스를 재생합니다">${mi('play_arrow','mi-fill')}</button></div><div class="locked-panel">${mi('lock')} 서울 카페 시리즈 완료 후 공개</div></div></div>`,'collection')}
function viewSpecial(){return shell(`${topbar('스페셜')}<div class="page"><div class="chip-row" style="margin:18px 0"><button class="chip active">전체 보기</button><button class="chip">찬</button><button class="chip">AI 모델 02</button></div><div class="special-grid"><div class="special-card"><img src="assets/special_model2.jpg"><div class="cap"><b>스페셜 이미지</b><div class="muted">가을밤의 산책</div></div></div><div class="special-card locked"><img src="assets/collection_model2.jpg"><div class="cap"><b>한정 포토</b><div class="muted">시크릿 다이어리</div></div></div><div class="special-card"><img src="assets/special_bts.jpg"><div class="cap"><b>비하인드 콘텐츠</b><div class="muted">촬영장 스케치</div></div></div><div class="special-card locked"><img src="assets/cafe_feature.jpg"><div class="cap"><b>이벤트 콘텐츠</b><div class="muted">100일 기념 영상</div></div></div></div></div>`,'collection')}

function viewShop(){
  const cats=['추천','보이스','디지털','포토카드','굿즈'];
  return shell(`
    <header class="shop-topbar">
      <div><div class="shop-title">${mi('storefront')}<span>Shop</span></div><p>좋아하는 모델의 특별한 콘텐츠를 만나보세요.</p></div>
      <div class="shop-actions"><button data-toast="장바구니는 다음 단계에서 연결합니다">${mi('shopping_bag')}</button><button data-action="notice">${mi('notifications')}</button></div>
    </header>
    <div class="page shop-page">
      <div class="shop-points">${mi('stars','mi-fill')}<b>${state.points.toLocaleString()} P</b></div>
      <div class="shop-model-tabs"><button class="active">전체</button><button>찬</button><button>AI 모델 02</button></div>
      <div class="chip-row shop-category-row">${cats.map(c=>`<button class="chip ${state.shopCategory===c?'active':''}" data-shopcat="${c}">${c}</button>`).join('')}</div>

      <button class="shop-feature" data-go="shopDetail">
        <img src="assets/shop_hero.jpg" alt="찬 스페셜 보이스">
        <div class="shop-feature-shade"></div>
        <div class="shop-feature-copy">
          <span class="tag">추천</span>
          <h2>찬의 스페셜 보이스</h2>
          <p>“오늘은 조금 특별한 이야기를 들려줄게.”<br>스페셜 보이스 패키지</p>
          <span class="shop-feature-cta">${mi(state.shopOwned?'check_circle':'diamond','mi-fill')} ${state.shopOwned?'보유 중':'포인트로 열기'}</span>
        </div>
      </button>

      <section class="section shop-section">
        <h2 class="section-title">나를 위한 추천</h2>
        <div class="shop-reco-scroller">
          <button class="shop-reco-card" data-go="shopDetail">
            <span class="reco-icon">${mi('volume_up')}</span><span class="reco-badge">내 컬렉션과 연결된 상품</span>
            <b>찬 - 카페 데이트 스페셜 보이스</b><em>500 P</em>
          </button>
          <button class="shop-reco-card" data-toast="AI 모델 02 상품 상세는 다음 단계에서 확장합니다">
            <span class="reco-icon">${mi('image')}</span><span class="reco-badge ghost">AI 모델 02</span>
            <b>AI 모델 02 - 스페셜 포토</b><em>400 P</em>
          </button>
        </div>
      </section>

      <section class="section shop-section">
        <h2 class="section-title">디지털 콘텐츠</h2>
        <div class="shop-product-grid">
          <button class="shop-product-card" data-go="shopDetail">
            <img src="assets/shop_digital_voice.jpg" alt="굿모닝 스페셜 보이스">
            <div class="shop-product-copy"><b>찬 - 굿모닝 스페셜 보이스</b><em>500 P</em><span>포인트로 열기</span></div>
          </button>
          <button class="shop-product-card" data-toast="서울 야경 스페셜 포토 상세">
            <img src="assets/shop_digital_hangang.jpg" alt="서울 야경 스페셜 포토">
            <div class="shop-product-copy"><b>찬 - 서울 야경 스페셜 포토</b><em>300 P</em><span>포인트로 열기</span></div>
          </button>
          <button class="shop-product-card" data-toast="AI 모델 02 스페셜 보이스 상세">
            <img src="assets/shop_digital_model2.jpg" alt="AI 모델 02 스페셜 보이스">
            <div class="shop-product-copy"><b>AI 모델 02 - 스페셜 보이스 01</b><em>500 P</em><span>포인트로 열기</span></div>
          </button>
        </div>
      </section>

      <section class="section shop-section">
        <h2 class="section-title">포토카드</h2>
        <button class="limited-card limited-card-image" data-toast="한정 포토카드는 샵 전용 컬렉션으로 확장 가능합니다">
          <img src="assets/shop_limited_card.jpg" alt="찬 서울 카페 시리즈 한정 포토카드">
          <span class="limited-label">LIMITED</span><span class="limited-star">${mi('star','mi-fill')}</span>
          <div><b>찬 - 서울 카페 시리즈 시크릿 포토</b><small>한정 디지털 포토카드</small></div>
        </button>
      </section>

      <section class="section shop-section">
        <h2 class="section-title">굿즈</h2>
        <div class="goods-list goods-image-list">
          <button data-toast="실물 굿즈는 판매 예정입니다"><img src="assets/goods_photocard_set.jpg" alt="찬 포토카드 세트"><div><b>찬 포토카드 세트</b><small>판매 예정</small></div></button>
          <button data-toast="실물 굿즈는 판매 예정입니다"><img src="assets/goods_acrylic_stand.jpg" alt="찬 아크릴 스탠드"><div><b>찬 아크릴 스탠드</b><small>판매 예정</small></div></button>
          <button data-toast="실물 굿즈는 판매 예정입니다"><img src="assets/goods_keyring.jpg" alt="찬 키링"><div><b>찬 키링</b><small>판매 예정</small></div></button>
        </div>
      </section>
    </div>
  `,'collection')
}
function viewShopDetail(){
  const owned=state.shopOwned;
  return shell(`
    <div class="shop-detail">
      <div class="shop-detail-hero">
        <img src="assets/shop_detail_hero.jpg" alt="카페에서의 찬">
        <div class="shop-detail-shade"></div>
        <button class="detail-float detail-back" data-action="back">${mi('arrow_back')}</button>
        <button class="detail-float detail-more" data-toast="상품 옵션">${mi('more_vert')}</button>
        <button class="preview-btn" id="shopPreview">${mi(state.previewPlaying?'pause_circle':'play_circle','mi-fill')} ${state.previewPlaying?'재생 중':'미리듣기'}</button>
      </div>
      <div class="shop-detail-body">
        <div class="detail-tags"><span>스페셜 보이스</span><span>Chan</span></div>
        <h1>카페 데이트<br>스페셜 보이스</h1>
        <p class="detail-desc">서울 카페 에피소드에서 만났던 찬의 특별한 보이스를 소장해 보세요. 부드러운 목소리로 당신의 하루를 응원합니다.</p>

        <section class="detail-section">
          <div class="detail-section-head"><h2>관련 컬렉션</h2><b>3 / 5 달성</b></div>
          <div class="progress-bar"><span style="width:60%"></span></div>
          <button class="related-collection" data-go="series"><img src="assets/cafe_feature.jpg"><div><b>서울 카페 시리즈</b><small>찬과 함께하는 주말의 여유</small></div>${mi('chevron_right')}</button>
        </section>

        <section class="detail-section">
          <h2>트랙 리스트</h2>
          <button class="track-row" id="trackOne"><span class="track-icon">${mi(state.previewPlaying?'pause':'play_arrow','mi-fill')}</span><div><b>Track 01. 아메리카노 좋아해?</b><small>01:42</small></div></button>
          <div class="track-row disabled"><span class="track-icon">${mi('lock')}</span><div><b>Track 02. 너를 위해 준비했어</b><small>02:15</small></div></div>
        </section>
      </div>

      <div class="purchase-panel">
        <div class="purchase-price"><span>${owned?'보유 상태':'소장 가격'}</span><b>${owned?`${mi('check_circle','mi-fill')} 보유 중`:`${mi('stars','mi-fill')} 500 P`}</b></div>
        <button class="purchase-btn ${owned?'owned':''}" id="${owned?'openCollection':'unlockShop'}">${mi(owned?'collections_bookmark':'lock_open')} ${owned?'컬렉션에서 보기':'포인트로 열기'}</button>
        ${!owned?`<small>현재 보유 포인트 ${state.points.toLocaleString()} P</small>`:''}
      </div>
    </div>
  `,null,{noNav:true})
}
function viewMy(){return shell(`${topbar()}<div class="page"><div class="profile-card"><div class="profile-top"><img src="assets/my_profile.jpg"><div><div style="font-size:24px;font-weight:600">채우리 대리님</div><span class="language-pill">${state.language}</span></div></div><div class="profile-stats"><div class="profile-stat"><b>8</b><span class="muted">에피소드 완료</span></div><div class="profile-stat"><b>12</b><span class="muted">플레이 횟수</span></div><div class="profile-stat"><b>12</b><span class="muted">컬렉션</span></div></div></div><div class="settings-card"><button class="settings-row" data-toast="프로필 수정 화면은 다음 단계에서 확장 가능합니다"><span class="set-icon">${mi('person')}</span><span>프로필</span><span class="chev">${mi('chevron_right')}</span></button><button class="settings-row" data-go="activity"><span class="set-icon">${mi('history')}</span><span>활동 기록</span><span class="chev">${mi('chevron_right')}</span></button><button class="settings-row" data-go="language"><span class="set-icon">${mi('language')}</span><span>언어 설정</span><span class="chev">${mi('chevron_right')}</span></button><button class="settings-row" data-go="notifications"><span class="set-icon">${mi('notifications')}</span><span>알림 설정</span><span class="chev">${mi('chevron_right')}</span></button><button class="settings-row" data-go="settings"><span class="set-icon">${mi('settings')}</span><span>설정</span><span class="chev">${mi('chevron_right')}</span></button></div><button class="secondary-btn logout" data-toast="로그아웃은 데모에서 실행하지 않습니다">로그아웃</button></div>`,'my')}
function viewActivity(){const items=[['movie','EP.04 찬이 좋아하는 카페 완료','포토카드 #04를 획득했어요','오전 10:24'],['collections_bookmark','포토카드 #04 획득','서울 카페 시리즈에 저장했어요','오전 10:23'],['sports_esports','CHAN RUN 플레이','8개의 미션을 성공했어요','오전 10:20'],['movie','EP.03 서울에서 뭐 먹지? 완료','다음 에피소드가 열렸어요','어제']];return shell(`${topbar()}<div class="page"><div class="page-head"><h1>활동 기록</h1><p>내가 경험한 에피소드와 플레이를 한눈에 확인해요</p></div><div class="chip-row activity-filters"><button class="chip active">전체</button><button class="chip">에피소드</button><button class="chip">플레이</button><button class="chip">컬렉션</button></div><div class="timeline"><div class="timeline-day">오늘</div>${items.map(([i,t,s,tm])=>`<div class="activity-card"><div class="activity-icon">${mi(i)}</div><div><div class="card-title">${t}</div><div class="muted">${s}</div><div class="activity-time">${tm}</div></div></div>`).join('')}</div></div>`,'my')}
function viewLanguage(){const langs=['한국어','English','日本語','ไทย','Tiếng Việt','Bahasa Indonesia','中文'];return shell(`${topbar('언어 설정',true)}<div class="page"><div class="page-head"><h1 style="font-size:22px">언어 설정</h1><p>서비스에서 사용할 언어를 선택해 주세요.</p></div><div class="form-list">${langs.map(l=>`<button class="radio-row" data-lang="${l}" style="border-left:0;border-right:0;border-top:0;background:#fff;width:100%"><span>${l}</span><span class="radio ${state.language===l?'active':''}"></span></button>`).join('')}</div></div>`,null,{noNav:true})}
function viewNotifications(){const labels=['새로운 에피소드','AI 모델의 새로운 콘텐츠','새로운 컬렉션','이벤트','서비스 알림'];return shell(`${topbar('알림 설정',true)}<div class="page"><div class="page-head"><h1 style="font-size:22px">알림 설정</h1><p>받고 싶은 알림을 선택해 주세요.</p></div><div class="form-list">${labels.map((l,i)=>`<button class="toggle-row" data-toggle-index="${i}" style="border-left:0;border-right:0;border-top:0;background:#fff;width:100%"><div style="text-align:left"><b>${l}</b><div class="muted" style="font-size:11px;margin-top:3px">${i===0?'새 에피소드가 공개될 때 알려드려요':i===1?'모델의 새로운 메시지와 콘텐츠 알림':'원하는 정보만 선택해서 받을 수 있어요'}</div></div><span class="switch ${state.notifications[i]?'on':''}"></span></button>`).join('')}</div><p class="muted" style="font-size:11px;line-height:1.6;margin-top:16px">알림은 기기의 시스템 설정에 따라 제한될 수 있습니다.</p></div>`,null,{noNav:true})}
function viewSettings(){const rows=[['manage_accounts','계정 관리'],['description','서비스 이용약관'],['shield','개인정보 처리방침'],['help','문의하기'],['info','앱 버전 · v1.2.4']];return shell(`${topbar('설정',true)}<div class="page"><div class="profile-card" style="margin-top:20px"><div class="profile-top"><img src="assets/my_profile.jpg"><div><div class="card-title">사용자 닉네임</div><span class="muted">demo@kbias.app</span></div></div></div><div class="settings-card">${rows.map(([i,t])=>`<button class="settings-row" data-toast="${t} 화면은 프로토타입 범위에서 안내만 제공합니다"><span class="set-icon">${mi(i)}</span><span>${t}</span><span class="chev">${mi('chevron_right')}</span></button>`).join('')}</div><button class="secondary-btn" style="margin-top:22px" data-toast="로그아웃은 데모에서 실행하지 않습니다">로그아웃</button><button style="width:100%;border:0;background:transparent;color:var(--danger);padding:14px" data-toast="회원 탈퇴는 데모에서 실행하지 않습니다">회원 탈퇴</button></div>`,null,{noNav:true})}

const views={home:viewHome,episodes:viewEpisodes,introHangang:()=>{setEpisode('hangang');return viewIntro()},introFood:()=>{setEpisode('food');return viewIntro()},introSeongsu:()=>{setEpisode('seongsu');return viewIntro()},intro:()=>{setEpisode('cafe');return viewIntro()},expressions:viewExpressions,speak:viewSpeak,mission:viewMission,clear:viewClear,play:viewPlay,run:viewRun,result:viewResult,collection:viewCollection,series:viewSeries,photo:viewPhoto,voice:viewVoice,special:viewSpecial,shop:viewShop,shopDetail:viewShopDetail,my:viewMy,activity:viewActivity,language:viewLanguage,notifications:viewNotifications,settings:viewSettings};
function bindPage(){
  bindCommon();
  app.querySelectorAll('[data-episode-go]').forEach(b=>b.onclick=()=>{const key=b.dataset.episodeGo;setEpisode(key);go(episodeData[key].route)});
  app.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{state.category=b.dataset.category;render()});
  app.querySelectorAll('[data-coltab]').forEach(b=>b.onclick=()=>{state.collectionTab=b.dataset.coltab;render()});
  app.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{state.language=b.dataset.lang;toast(`${state.language}로 설정했어요`);render()});
  app.querySelectorAll('[data-toggle-index]').forEach(b=>b.onclick=()=>{const i=+b.dataset.toggleIndex;state.notifications[i]=!state.notifications[i];render()});
  const speakMic=document.getElementById('speakMic'); if(speakMic)speakMic.onclick=()=>{state.recorded=true;document.getElementById('speakMicWrap').classList.add('recording');toast('좋아요! 발음이 자연스러워요.');setTimeout(render,700)};
  const missionMic=document.getElementById('missionMic'); if(missionMic)missionMic.onclick=()=>{const success=document.getElementById('missionSuccess'); if(success)success.classList.add('show'); toast('미션 성공!');setTimeout(()=>go('clear'),1200)};
  const runPause=document.getElementById('runPause');if(runPause)runPause.onclick=()=>{state.runPaused=!state.runPaused;render()};
  const gameMic=document.getElementById('gameMic'); if(gameMic)gameMic.onclick=()=>{if(state.runPaused)return;const scene=document.getElementById('gameScene');const runner=document.getElementById('runnerFocus');const gate=document.getElementById('voiceGate');const feedback=document.getElementById('gameFeedback');const screen=document.getElementById('gameScreen');scene?.classList.add('jump-pulse');runner?.classList.add('jumping');gate?.classList.add('cleared');feedback?.classList.add('show');screen?.classList.add('success-flash');gameMic.classList.add('listening');toast('NICE! 보이스 게이트 클리어');state.runStep++;setTimeout(()=>{if(state.runStep>=5){state.runStep=0;state.runPaused=false;go('result')}else render()},900)};
  const saveReward=document.getElementById('saveReward');if(saveReward)saveReward.onclick=()=>{state.saved=true;toast('컬렉션에 저장했어요');setTimeout(()=>go('collection'),550)};
  app.querySelectorAll('[data-shopcat]').forEach(b=>b.onclick=()=>{state.shopCategory=b.dataset.shopcat;render()});
  const shopPreview=document.getElementById('shopPreview');if(shopPreview)shopPreview.onclick=()=>{state.previewPlaying=!state.previewPlaying;toast(state.previewPlaying?'미리듣기를 재생합니다':'미리듣기를 일시정지했습니다');render()};
  const trackOne=document.getElementById('trackOne');if(trackOne)trackOne.onclick=()=>{state.previewPlaying=!state.previewPlaying;toast(state.previewPlaying?'Track 01 재생':'재생 일시정지');render()};
  const unlockShop=document.getElementById('unlockShop');if(unlockShop)unlockShop.onclick=()=>{if(state.points<500){toast('포인트가 부족합니다');return;}state.points-=500;state.shopOwned=true;toast('스페셜 보이스를 획득했어요');setTimeout(render,500)};
  const openCollection=document.getElementById('openCollection');if(openCollection)openCollection.onclick=()=>{state.collectionTab='voice';go('collection')};
}

function initMotion(){
  // 1) 스크롤 진입 모션
  const revealSelector=[
    '.page-head','.hero-card','.model-switch','.shop-shortcut','.continue-card','.feature-card','.mini-feature',
    '.episode-row','.mission-card','.reward-preview','.stat-card','.expression-card','.play-hero','.play-stat',
    '.collection-summary','.collection-tabs','.photo-card','.voice-row','.special-card','.profile-card','.settings-card',
    '.shop-feature','.shop-section','.shop-product-card','.shop-reco-card','.limited-card','.goods-list button',
    '.detail-collection-card','.track-list','.result-reward','.quote-box','.photo-reward'
  ].join(',');
  const els=[...app.querySelectorAll(revealSelector)];
  els.forEach((el,i)=>{
    el.classList.add('motion-reveal');
    el.style.setProperty('--reveal-delay',`${Math.min(i%8,7)*42}ms`);
  });
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('motion-visible');io.unobserve(entry.target)}
      })
    },{root:app,threshold:.09,rootMargin:'0px 0px -6% 0px'});
    els.forEach(el=>io.observe(el));
  }else{els.forEach(el=>el.classList.add('motion-visible'))}

  // 2) 클릭 리플
  app.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('pointerdown',e=>{
      if(btn.disabled)return;
      const r=btn.getBoundingClientRect();
      const d=Math.max(r.width,r.height)*1.8;
      const dot=document.createElement('span');
      dot.className='ui-ripple';
      dot.style.width=dot.style.height=d+'px';
      dot.style.left=(e.clientX-r.left)+'px';
      dot.style.top=(e.clientY-r.top)+'px';
      btn.appendChild(dot);
      setTimeout(()=>dot.remove(),620);
    },{passive:true});
  });

  // 3) 수집 카드 3D tilt - 마우스 환경에서만
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    app.querySelectorAll('.photo-card,.photo-detail-card,.limited-card').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect();
        const px=(e.clientX-r.left)/r.width-.5;
        const py=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`perspective(700px) rotateX(${(-py*7).toFixed(2)}deg) rotateY(${(px*8).toFixed(2)}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave',()=>card.style.transform='');
    });
  }

  // 4) 오른쪽 가이드가 화면 전환을 따라 자연스럽게 갱신
  const guide=document.querySelector('.review-guide-inner');
  if(guide){guide.classList.remove('guide-refresh');void guide.offsetWidth;guide.classList.add('guide-refresh')}
}

function render(){window.__navActive=null;app.innerHTML=views[current]();persistentNav.innerHTML=window.__navActive?bottomNav(window.__navActive):'';routeLabel.textContent=screenNames[current];app.scrollTop=0;bindPage();persistentNav.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));document.querySelectorAll('.panel-screen').forEach(x=>x.classList.toggle('active',x.dataset.id===current));renderGuide();initMotion()}

const menu=document.getElementById('prototypeMenu');menuOrder.forEach((id,i)=>{const b=document.createElement('button');b.className='panel-screen';b.dataset.id=id;b.innerHTML=`<span>${screenNames[id]}</span><small>${String(i+1).padStart(2,'0')}</small>`;b.onclick=()=>go(id);menu.appendChild(b)});
document.getElementById('browserBack').onclick=back;document.getElementById('resetPrototype').onclick=()=>{historyStack=[];state.runStep=0;go('home',false)};document.getElementById('toggleFrame').onclick=()=>{document.body.classList.toggle('frame-hidden');document.getElementById('toggleFrame').textContent=document.body.classList.contains('frame-hidden')?'프레임 보이기':'프레임 숨기기'};document.getElementById('presentationMode').onclick=()=>{if(!document.fullscreenElement){document.documentElement.requestFullscreen?.()}else document.exitFullscreen?.()};window.addEventListener('popstate',()=>{});window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.fullscreenElement)back();if(e.key==='ArrowLeft')back();if((e.code==='Space'||e.key==='Enter')&&current==='run'){e.preventDefault();document.getElementById('gameMic')?.click()}});
render();
