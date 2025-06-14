// DOM 요소 선택
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
const header = document.querySelector('.site-header');
const scrollElements = document.querySelectorAll('.section, .feature-card, .gallery-item, .tech-card');

// 갤러리 탭 기능
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// 갤러리 모달 기능
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('gallery-modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');
const modalClose = document.querySelector('.modal-close');

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 모든 요소에 초기 클래스 적용
    scrollElements.forEach(element => {
        element.classList.add('reveal');
    });

    // 초기 화면에 보이는 요소들 애니메이션 실행
    handleScrollAnimation();

    // 갤러리 이미지 로드 완료 후 애니메이션 적용
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });

    const teamCards = document.querySelectorAll('.team-card');

    // 터치 이벤트 처리
    teamCards.forEach(card => {
        card.addEventListener('touchstart', function () {
            // 다른 카드의 터치 클래스 제거
            teamCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('touched');
                }
            });

            // 현재 카드의 터치 클래스 토글
            this.classList.toggle('touched');
        });
    });

    // 다크 모드 제거 - 항상 라이트 모드 사용
    document.body.classList.remove('dark-mode');

    // 갤러리 탭 이벤트 리스너 설정
    setupGalleryTabs();

    // 갤러리 모달 이벤트 리스너 설정
    setupGalleryModal();
});

// 모바일 메뉴 토글 기능
mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

// 모바일 메뉴 링크 클릭 시 메뉴 닫기
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// 스크롤 이벤트 핸들링
window.addEventListener('scroll', throttle(handleScrollAnimation, 100));

// 스크롤 애니메이션 처리 함수
function handleScrollAnimation() {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    // 헤더 스타일 변경 (스크롤 시 불투명도 증가)
    if (scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // 요소들 등장 애니메이션
    scrollElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top + scrollY;
        const elementVisible = 150; // 요소가 화면에 얼마나 보여야 애니메이션이 시작될지 설정

        if (scrollY + windowHeight > elementTop + elementVisible) {
            element.classList.add('active');
        }
    });
}

// 갤러리 탭 기능 설정
function setupGalleryTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 활성 탭 버튼 업데이트
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 활성 탭 컨텐츠 업데이트
            const tabId = button.getAttribute('data-tab');
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabId}-tab`).classList.add('active');

            // 새 탭의 이미지들에 loaded 클래스 추가
            const newTabImages = document.querySelectorAll(`#${tabId}-tab .gallery-image`);
            newTabImages.forEach(img => {
                if (img.complete) {
                    img.classList.add('loaded');
                } else {
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                }
            });
        });
    });
}

// 갤러리 모달 기능 설정
function setupGalleryModal() {
    // 갤러리 아이템 클릭 시 모달 열기
    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
            const img = this.querySelector('.gallery-image');
            const caption = this.querySelector('.gallery-caption').textContent;

            modal.style.display = 'block';
            modalImg.src = img.src;
            modalCaption.textContent = caption;

            // 모달 열릴 때 스크롤 방지
            document.body.style.overflow = 'hidden';
        });
    });

    // 닫기 버튼 클릭 시 모달 닫기
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // 모달 외부 클릭 시 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // ESC 키 눌렀을 때 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// 스로틀 함수 (성능 최적화)
function throttle(callback, limit) {
    let waiting = false;
    return function () {
        if (!waiting) {
            callback.apply(this, arguments);
            waiting = true;
            setTimeout(() => {
                waiting = false;
            }, limit);
        }
    };
}

// 스크롤 부드럽게 처리
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.site-header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
