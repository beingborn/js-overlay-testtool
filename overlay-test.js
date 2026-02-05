/* 
    행위 

    - 열려있는 페이지와 동일한 경로에 이미지가 있는 지 확인한다.
        - 현재 화면명을 초기 세팅 경로 화면명을 확인한다.
            - 초기 세팅의 폴더명         

            - 있을 경우 
                - 테스트용 이미지, 투명도 표시, 윈도우 사이즈 표시 요소를 만든다
                - 테스트용 이미지 구별용으로 클래스를 붙여주고 src를 지정한 경로로 넣어준다
                    - src : 초기 세팅의 폴더명 + 페이지명 + 초기 세팅 샘플 이미지 확장자
                - 화면에 생성된 테스트 요소들을 추가한다
                - 테스트 요소들의 스타일을 추가한다
                    - 스타일 : 위치 ... 불투명도는 초기세팅의 값 사용

            - 키보드 입력 시 
                - 초기 세팅의 토글 버튼에 해당 키가 포함되어 있을 경우          
                    - 테스트 요소의 visible을 일괄 적으로 토글한다 

                - 초기 세팅의 불투명도 조정 버튼에 해당 키가 포함되어 있을 경우 
                    - 테스트 이미지의 opacity를 위아래로 0.1씩 조정한다. 
                        - 0이하거나 1일경우 실행하지 않는다

                - 초기 세팅의 위아래 버튼에 해당 키가 포함되어 있을 경우 
                    - 테스트 이미지의 top 값을 1px 위아래로 방향키의 방향대로 조정한다

            - 리사이즈 시 
                - 현재 화면의 winSize를 업데이트한다.
                    - 초기에 저장한 PC 여부와 새로 감지한 PC 여부를 비교한다.             
                    - 만약 두개의 값이 다를 경우, testImg Src 를 확인 후 testImg.src를 다시 할당한다.
                    - 값을 업데이트해준다

    Skeleton 

    바디 = document.body 
    현재 위치 = window.location.href 
    HTML = 현재 위치 마지막 요소 
    페이지명 = test.html > .으로 분리 후 첫번째, 없을 경우 index.html로 지정 
    PC 여부 = 윈도우 > 초기세팅.breakPoint 
    접미어 = PC 여부 ? '' : 초기세팅.모바일 접미어
    테스트 이미지 경로 = 초기세팅.폴더명/페이지명/접미어/초기세팅.확장자 
*/


const CONFIG = {
    breakpoint : 768,    
    breakpointSuffix: "_mo",
    toggleKeys : ['t', 'T', 'ㅅ'],
    opacityKeys : [',', '.'],
    initOpacity : 0.5,
    include: "/test",
    extension: 'png',
}

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const currentPath = window.location.href;
    const [pageHtml] = currentPath.split('/').slice(-1);
    const pageName = pageHtml.split('.')[0] || "index";

    let isPc = window.innerWidth <= CONFIG.breakpoint ? false : true;
    let suffix = isPc ? '' : CONFIG.breakpointSuffix; 
    let testImgSrc = CONFIG.include + '/' + pageName + suffix + '.' + CONFIG.extension;
    
    const doesFileExist = (url) => {
        var xhr = new XMLHttpRequest();

        xhr.open('HEAD', url, false);
        xhr.send();

        if (xhr.status == "404") {
            console.log("시안 파일이 없습니다.")

            return false
        } else {
            return true
        }
    }

    const updateOpacity = (key, currentOpacity = CONFIG.initOpacity) => {
        let result; 
        
        if (key === ',') {
            result = Math.max(0, currentOpacity - 0.1);

            console.log(result)
        } else { 
            result = Math.min(1, currentOpacity + 0.1);
        }

        result = Number(result.toFixed(2));
        
        testElements.testImg.style.opacity = result;
        testElements.testOpacity.textContent = result;
    }

    const updateWinSize = () => {
        testElements.testWinSize.textContent = `현재 너비 : ${window.innerWidth}px`
    }

    const toggleTestUi = () => {
        for (key in testElements) {
            let visible = testElements[key].style.display === 'none' ? 'block' : 'none';
            testElements[key].style.display = visible;
        }
    }

    const createTestElements = () => ({
        testImg : document.createElement('img'),
        testOpacity : document.createElement('p'),
        testWinSize : document.createElement('p'),
    })

    const initTestImage = (img, src) => {
        img.src = src;
        img.classList.add('test-img');
    }

    const appendTestElements = (elements) => {
        for (key in elements) {
            body.append(elements[key])
        }
    }

    const initBodyStyle = () => {
        body.style.position = 'relative';
    }

    const setTestElementsStyle = elements => {
        for (key in elements) {
            if (key === 'testImg') {
                elements[key].style.cssText = `
                        position: absolute;
                        left : 50%;
                        top : 0;
                        transform : translateX(-50%);
                        opacity : ${CONFIG.initOpacity};
                        display : none;
                `
            }

            if (key === 'testOpacity') {
                elements[key].style.cssText = `
                    position : absolute;
                    top : 20px;
                    right : 100px;
                    color : red;
                    font-size : 20px;
                    font-weight : bold;
                    display: none;
                `
            }

            if (key === 'testWinSize') {
                elements[key].style.cssText = `
                    position : absolute;
                    top : 20px;
                    right : 140px;
                    color : red;
                    font-size : 20px;
                    font-weight : bold;
                    display: none;
                `
            }
        }
    }

    if (!doesFileExist(testImgSrc)) return;

    // 1. 테스트 요소들을 만든다
    const testElements = createTestElements();

    // 2. 테스트 요소 중 이미지를 세팅한다
    initTestImage(testElements.testImg, testImgSrc);

    // 3. 바디의 초기 스타일을 지정한다
    initBodyStyle();

    // 4. 테스트 요소들을 추가한다
    appendTestElements(testElements);

    // 5. 테스트 이미지에 스타일을 추가한다.
    setTestElementsStyle(testElements);

    // Init 
    updateWinSize();    
    updateOpacity();

    document.addEventListener('keydown', (event) => {
        const key = event.key;
        const currentOpacity = parseFloat(testElements.testImg) || 0;
        const isTestActive = testElements.testImg.style.display === 'block';

        if (CONFIG.toggleKeys.includes(key)) {
            toggleTestUi();
        }

        if (CONFIG.opacityKeys.includes(key) && isTestActive) {
            updateOpacity(key)
        }
    })

    window.addEventListener('resize', () => {
        updateWinSize();

        let curIsPC = window.innerWidth >= CONFIG.breakpoint;        

        if (isPc !== curIsPC) {
            let currentSuffix = curIsPC ? '' : CONFIG.breakpointSuffix;
            let currentTestImgSrc = CONFIG.include + '/' + pageName + currentSuffix + '.' + CONFIG.extension;

            suffix = currentSuffix;
            isPc = curIsPC; 

            testImgSrc = currentTestImgSrc;
            testElements.testImg.src = currentTestImgSrc;
        }
    })
})