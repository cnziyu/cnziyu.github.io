// 加密解密工具脚本

// 需要密钥的算法
const keyRequiredAlgorithms = [
    'AES', 'DES', 'TripleDES', 'Rabbit', 'RC4', 'RC4Drop',
    'HmacMD5', 'HmacSHA1', 'HmacSHA256', 'HmacSHA512'
];

// 哈希算法（单向，不可解密）
const hashAlgorithms = [
    'MD5', 'SHA1', 'SHA256', 'SHA512',
    'SHA3-224', 'SHA3-256', 'SHA3-384', 'SHA3-512',
    'RIPEMD160', 'HmacMD5', 'HmacSHA1', 'HmacSHA256', 'HmacSHA512'
];

// 编码算法
const encodingAlgorithms = ['Base64', 'Hex', 'Utf8', 'Utf16', 'Utf16LE', 'Latin1'];

// DOM 元素
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const algorithmSelect = document.getElementById('algorithm-select');
const operationSelect = document.getElementById('operation-select');
const secretKey = document.getElementById('secret-key');
const keyGroup = document.getElementById('key-group');
const executeBtn = document.getElementById('execute-btn');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const allEncryptBtn = document.getElementById('all-encrypt-btn');
const allResults = document.getElementById('all-results');
const allResultsContent = document.getElementById('all-results-content');

// 监听算法选择变化
algorithmSelect.addEventListener('change', updateUI);

function updateUI() {
    const algorithm = algorithmSelect.value;
    
    // 显示/隐藏密钥输入
    if (keyRequiredAlgorithms.includes(algorithm)) {
        keyGroup.style.display = 'block';
    } else {
        keyGroup.style.display = 'none';
    }
    
    // 哈希算法禁用解密选项
    if (hashAlgorithms.includes(algorithm)) {
        operationSelect.value = 'encrypt';
        operationSelect.querySelector('option[value="decrypt"]').disabled = true;
    } else {
        operationSelect.querySelector('option[value="decrypt"]').disabled = false;
    }
}

// 执行加密/解密
executeBtn.addEventListener('click', () => {
    const text = inputText.value.trim();
    if (!text) {
        alert('请输入要处理的内容');
        return;
    }
    
    const algorithm = algorithmSelect.value;
    const operation = operationSelect.value;
    const key = secretKey.value;
    
    // 检查是否需要密钥
    if (keyRequiredAlgorithms.includes(algorithm) && !key) {
        alert('该算法需要输入密钥');
        return;
    }
    
    try {
        let result;
        if (operation === 'encrypt') {
            result = encrypt(text, algorithm, key);
        } else {
            result = decrypt(text, algorithm, key);
        }
        outputText.value = result;
        allResults.style.display = 'none';
    } catch (error) {
        outputText.value = '错误: ' + error.message;
    }
});

// 加密函数
function encrypt(text, algorithm, key) {
    switch (algorithm) {
        // 哈希算法
        case 'MD5':
            return CryptoJS.MD5(text).toString();
        case 'SHA1':
            return CryptoJS.SHA1(text).toString();
        case 'SHA256':
            return CryptoJS.SHA256(text).toString();
        case 'SHA512':
            return CryptoJS.SHA512(text).toString();
        case 'SHA3-224':
            return CryptoJS.SHA3(text, { outputLength: 224 }).toString();
        case 'SHA3-256':
            return CryptoJS.SHA3(text, { outputLength: 256 }).toString();
        case 'SHA3-384':
            return CryptoJS.SHA3(text, { outputLength: 384 }).toString();
        case 'SHA3-512':
            return CryptoJS.SHA3(text, { outputLength: 512 }).toString();
        case 'RIPEMD160':
            return CryptoJS.RIPEMD160(text).toString();
        
        // HMAC 算法
        case 'HmacMD5':
            return CryptoJS.HmacMD5(text, key).toString();
        case 'HmacSHA1':
            return CryptoJS.HmacSHA1(text, key).toString();
        case 'HmacSHA256':
            return CryptoJS.HmacSHA256(text, key).toString();
        case 'HmacSHA512':
            return CryptoJS.HmacSHA512(text, key).toString();
        
        // 对称加密
        case 'AES':
            return CryptoJS.AES.encrypt(text, key).toString();
        case 'DES':
            return CryptoJS.DES.encrypt(text, key).toString();
        case 'TripleDES':
            return CryptoJS.TripleDES.encrypt(text, key).toString();
        case 'Rabbit':
            return CryptoJS.Rabbit.encrypt(text, key).toString();
        case 'RC4':
            return CryptoJS.RC4.encrypt(text, key).toString();
        case 'RC4Drop':
            return CryptoJS.RC4Drop.encrypt(text, key).toString();
        
        // 编码转换
        case 'Base64':
            return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
        case 'Hex':
            return CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(text));
        case 'Utf8':
            return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Utf8.parse(text));
        case 'Utf16':
            return CryptoJS.enc.Utf16.stringify(CryptoJS.enc.Utf8.parse(text));
        case 'Utf16LE':
            return CryptoJS.enc.Utf16LE.stringify(CryptoJS.enc.Utf8.parse(text));
        case 'Latin1':
            return CryptoJS.enc.Latin1.stringify(CryptoJS.enc.Utf8.parse(text));
        
        default:
            throw new Error('不支持的算法');
    }
}

// 解密函数
function decrypt(text, algorithm, key) {
    switch (algorithm) {
        // 对称加密解密
        case 'AES':
            return CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
        case 'DES':
            return CryptoJS.DES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
        case 'TripleDES':
            return CryptoJS.TripleDES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
        case 'Rabbit':
            return CryptoJS.Rabbit.decrypt(text, key).toString(CryptoJS.enc.Utf8);
        case 'RC4':
            return CryptoJS.RC4.decrypt(text, key).toString(CryptoJS.enc.Utf8);
        case 'RC4Drop':
            return CryptoJS.RC4Drop.decrypt(text, key).toString(CryptoJS.enc.Utf8);
        
        // 编码解码
        case 'Base64':
            return CryptoJS.enc.Base64.parse(text).toString(CryptoJS.enc.Utf8);
        case 'Hex':
            return CryptoJS.enc.Hex.parse(text).toString(CryptoJS.enc.Utf8);
        case 'Utf16':
            return CryptoJS.enc.Utf16.parse(text).toString(CryptoJS.enc.Utf8);
        case 'Utf16LE':
            return CryptoJS.enc.Utf16LE.parse(text).toString(CryptoJS.enc.Utf8);
        case 'Latin1':
            return CryptoJS.enc.Latin1.parse(text).toString(CryptoJS.enc.Utf8);
        
        default:
            throw new Error('该算法不支持解密');
    }
}

// 一键全部加密
allEncryptBtn.addEventListener('click', () => {
    const text = inputText.value.trim();
    if (!text) {
        alert('请输入要处理的内容');
        return;
    }
    
    const key = secretKey.value || 'default_key';
    const results = [];
    
    // 哈希算法
    const algorithms = [
        { name: 'MD5', fn: () => CryptoJS.MD5(text).toString() },
        { name: 'SHA1', fn: () => CryptoJS.SHA1(text).toString() },
        { name: 'SHA256', fn: () => CryptoJS.SHA256(text).toString() },
        { name: 'SHA512', fn: () => CryptoJS.SHA512(text).toString() },
        { name: 'SHA3-224', fn: () => CryptoJS.SHA3(text, { outputLength: 224 }).toString() },
        { name: 'SHA3-256', fn: () => CryptoJS.SHA3(text, { outputLength: 256 }).toString() },
        { name: 'SHA3-384', fn: () => CryptoJS.SHA3(text, { outputLength: 384 }).toString() },
        { name: 'SHA3-512', fn: () => CryptoJS.SHA3(text, { outputLength: 512 }).toString() },
        { name: 'RIPEMD160', fn: () => CryptoJS.RIPEMD160(text).toString() },
        { name: 'HmacMD5', fn: () => CryptoJS.HmacMD5(text, key).toString() },
        { name: 'HmacSHA1', fn: () => CryptoJS.HmacSHA1(text, key).toString() },
        { name: 'HmacSHA256', fn: () => CryptoJS.HmacSHA256(text, key).toString() },
        { name: 'HmacSHA512', fn: () => CryptoJS.HmacSHA512(text, key).toString() },
        { name: 'AES', fn: () => CryptoJS.AES.encrypt(text, key).toString() },
        { name: 'DES', fn: () => CryptoJS.DES.encrypt(text, key).toString() },
        { name: 'TripleDES', fn: () => CryptoJS.TripleDES.encrypt(text, key).toString() },
        { name: 'Rabbit', fn: () => CryptoJS.Rabbit.encrypt(text, key).toString() },
        { name: 'RC4', fn: () => CryptoJS.RC4.encrypt(text, key).toString() },
        { name: 'RC4Drop', fn: () => CryptoJS.RC4Drop.encrypt(text, key).toString() },
        { name: 'Base64', fn: () => CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text)) },
        { name: 'Hex', fn: () => CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(text)) },
        { name: 'Latin1', fn: () => CryptoJS.enc.Latin1.stringify(CryptoJS.enc.Utf8.parse(text)) },
        { name: 'Utf8', fn: () => text },
        { name: 'Utf16', fn: () => CryptoJS.enc.Utf16.stringify(CryptoJS.enc.Utf8.parse(text)) },
        { name: 'Utf16LE', fn: () => CryptoJS.enc.Utf16LE.stringify(CryptoJS.enc.Utf8.parse(text)) }
    ];
    
    algorithms.forEach(algo => {
        try {
            results.push({ name: algo.name, value: algo.fn() });
        } catch (e) {
            results.push({ name: algo.name, value: '错误: ' + e.message });
        }
    });
    
    // 显示结果
    displayAllResults(results);
});

function displayAllResults(results) {
    allResultsContent.innerHTML = '';
    
    results.forEach(result => {
        const item = document.createElement('div');
        item.className = 'result-item';
        item.innerHTML = `
            <span class="result-label">${result.name}</span>
            <span class="result-value">${result.value}</span>
            <button class="result-copy" onclick="copyToClipboard('${escapeHtml(result.value)}')">复制</button>
        `;
        allResultsContent.appendChild(item);
    });
    
    allResults.style.display = 'block';
    outputText.value = JSON.stringify(
        results.reduce((obj, item) => { obj[item.name] = item.value; return obj; }, {}),
        null, 2
    );
}

function escapeHtml(text) {
    return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// 复制到剪贴板
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('已复制到剪贴板');
    }).catch(() => {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('已复制到剪贴板');
    });
}

// 复制结果按钮
copyBtn.addEventListener('click', () => {
    const text = outputText.value;
    if (!text) {
        alert('没有可复制的内容');
        return;
    }
    copyToClipboard(text);
});

// 清空按钮
clearBtn.addEventListener('click', () => {
    inputText.value = '';
    outputText.value = '';
    secretKey.value = '';
    allResults.style.display = 'none';
});

// Toast 提示
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 9999;
        animation: fadeInUp 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translate(-50%, 20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// 初始化UI
updateUI();
