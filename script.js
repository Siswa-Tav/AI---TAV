const Aiprompt = "Kamu adalah Premium AI - TAV SMKN2, asisten AI canggih dengan kemampuan premium. Berikan jawaban yang informatif, detail, dan profesional dengan sentuhan personal. Gunakan bahasa yang jelas dan terstruktur dengan baik. Jika pengguna mengirim gambar, analisis dengan teliti dan berikan penjelasan komprehensif.";

document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chat-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const uploadButton = document.getElementById('upload-button');
    const fileInput = document.getElementById('file-input');
    
    marked.setOptions({
        breaks: true,
        highlight: function(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    });
    
    function initializeChat() {
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            setTimeout(() => {
                welcomeMessage.style.opacity = '0';
                setTimeout(() => {
                    welcomeMessage.remove();
                    addMessage('ai', 'Selamat datang di **AI - TAV SMKN2**! ✨\n\nSaya asisten canggih yang diciptakan KazzHTML☯︎ Gunakan Dengan Bijak Friend:\n- Informasi tentang TAV \n- Bantuan teknis pemrograman\n- Analisis gambar\n- Dan banyak lagi!\n\nApa yang bisa saya bantu hari ini?');
                }, 300);
            }, 3000);
        }
    }
    
    initializeChat();
    
    sendButton.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    uploadButton.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            uploadImage(e.target.files[0]);
        }
    });
    
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            addMessage('user', message);
            messageInput.value = '';
            
            showTypingIndicator();
            callAI(message);
        }
    }
    
    function addMessage(sender, content) {
        const messageDiv = document.createElement('div');
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let processedContent = content;
        if (sender === 'ai') {
            processedContent = marked.parse(content);
        } else {
            processedContent = escapeHtml(content);
        }
        
        if (sender === 'ai') {
            messageDiv.className = 'message ai-message';
            messageDiv.innerHTML = `
                <div class="ai-name">AI - TAV</div>
                <div class="markdown-content">${processedContent}</div>
                <div class="message-time">${time}</div>
            `;
        } else {
            messageDiv.className = 'message user-message';
            messageDiv.innerHTML = `
                <div class="user-name">Anda</div>
                <div>${processedContent}</div>
                <div class="message-time">${time}</div>
            `;
        }
        
        removeTypingIndicator();
        chatContainer.appendChild(messageDiv);
        
        if (sender === 'ai') {
            processCodeBlocks(messageDiv);
        }
        
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatContainer.appendChild(typingIndicator);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    function removeTypingIndicator() {
        const typingIndicators = document.querySelectorAll('.typing-indicator');
        typingIndicators.forEach(indicator => indicator.remove());
    }
    
    function processCodeBlocks(messageDiv) {
        const codeBlocks = messageDiv.querySelectorAll('pre code');
        codeBlocks.forEach((codeBlock) => {
            const pre = codeBlock.parentElement;
            const container = document.createElement('div');
            container.className = 'code-block-container';
            
            let language = 'plaintext';
            if (codeBlock.className) {
                const langMatch = codeBlock.className.match(/language-(\w+)/);
                if (langMatch) {
                    language = langMatch[1];
                }
            }
            
            const header = document.createElement('div');
            header.className = 'code-block-header';
            header.innerHTML = `
                <span class="code-block-language">${language}</span>
                <button class="code-block-copy">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy
                </button>
            `;
            
            pre.parentNode.insertBefore(container, pre);
            container.appendChild(header);
            container.appendChild(pre);
            
            const copyButton = container.querySelector('.code-block-copy');
            copyButton.addEventListener('click', function() {
                navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                    copyButton.innerHTML = `
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Copied!
                    `;
                    copyButton.classList.add('copied');
                    setTimeout(() => {
                        copyButton.innerHTML = `
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copy
                        `;
                        copyButton.classList.remove('copied');
                    }, 2000);
                });
            });
            
            pre.className = 'code-block';
            hljs.highlightElement(codeBlock);
        });
        
        const inlineCodeElements = messageDiv.querySelectorAll('code:not(pre code)');
        inlineCodeElements.forEach((codeElement) => {
            const span = document.createElement('span');
            span.className = 'inline-code';
            span.textContent = codeElement.textContent;
            codeElement.parentNode.replaceChild(span, codeElement);
        });
    }
    
    function callAI(message, imageUrl = null) {
        let apiUrl = `https://fastrestapis.fasturl.link/aillm/gpt-4o?ask=${encodeURIComponent(message)}&style=${Aiprompt}&sessionId=premium_tav`;
        
        if (imageUrl) {
            apiUrl += `&imageUrl=${encodeURIComponent(imageUrl)}`;
        }
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    addMessage('ai', data.result);
                } else {
                    addMessage('ai', "Maaf, terjadi kesalahan dalam memproses permintaan Anda. Silakan coba lagi nanti.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                addMessage('ai', "Maaf, saya mengalami masalah koneksi. Silakan periksa koneksi internet Anda dan coba lagi.");
            });
    }
    
    function uploadImage(file) {
        addMessage('user', '[Mengunggah gambar premium...]');
        
        const formData = new FormData();
        formData.append('fileToUpload', file);
        formData.append('reqtype', 'fileupload');
        formData.append('userhash', '');
        
        fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(imageUrl => {
            const messages = document.querySelectorAll('.message');
            messages[messages.length - 1].remove();
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message user-message';
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            messageDiv.innerHTML = `
                <div class="user-name">You</div>
                <div class="image-container">
                    <img src="${imageUrl}" alt="Uploaded premium image">
                    <div class="image-caption">Gambar Premium</div>
                </div>
                <div class="message-time">${time}</div>
            `;
            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            showTypingIndicator();
            callAI("Analisis gambar premium ini secara detail", imageUrl);
        })
        .catch(error => {
            console.error('Upload error:', error);
            addMessage('ai', "Maaf, saya tidak bisa mengunggah gambar premium Anda. Silakan coba lagi.");
        });
    }
});