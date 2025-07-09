// utils/secure-message.js
export class SecurePopupMessenger {
    constructor(allowedOrigins = []) {
        this.allowedOrigins = allowedOrigins;
        this.messageHandlers = new Map();
    }
    
    // 메시지 핸들러 등록
    on(messageType, handler) {
        this.messageHandlers.set(messageType, handler);
    }
    
    // 메시지 핸들러 제거
    off(messageType) {
        this.messageHandlers.delete(messageType);
    }
    
    // 메시지 리스너 시작
    startListening() {
        window.addEventListener('message', this.handleMessage.bind(this));
    }
    
    // 메시지 리스너 종료
    stopListening() {
        window.removeEventListener('message', this.handleMessage.bind(this));
    }
    
    // 메시지 처리
    handleMessage(event) {
        // Origin 검증
        if (this.allowedOrigins.length > 0 && !this.allowedOrigins.includes(event.origin)) {
            console.warn('허용되지 않은 origin:', event.origin);
            return;
        }
        
        // 메시지 구조 검증
        if (!event.data || typeof event.data !== 'object' || !event.data.type) {
            console.warn('잘못된 메시지 형식:', event.data);
            return;
        }
        
        // 핸들러 실행
        const handler = this.messageHandlers.get(event.data.type);
        if (handler) {
            handler(event.data.payload, event);
        }
    }
    
    // 안전한 메시지 전송
    sendMessage(targetWindow, type, payload, targetOrigin = '*') {
        if (!targetWindow || targetWindow.closed) {
            console.warn('대상 창이 닫혔습니다');
            return false;
        }
        
        const message = {
            type,
            payload,
            timestamp: Date.now()
        };
        
        targetWindow.postMessage(message, targetOrigin);
        return true;
    }
}

// 사용 예제
export function createPopupMessenger() {
    const messenger = new SecurePopupMessenger([
        'http://localhost:5173',
        'https://yourdomain.com'
    ]);
    
    return messenger;
}