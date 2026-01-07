document.addEventListener("DOMContentLoaded", function () {
    const regexInput = document.getElementById("regex-input");
    const regexFlags = document.getElementById("regex-flags");
    const testInput = document.getElementById("test-input");
    const resultOutput = document.getElementById("result-output");
    const matchCount = document.getElementById("match-count");
    const matchDetails = document.getElementById("match-details");
    const clearBtn = document.getElementById("clear-btn");
    const copyBtn = document.getElementById("copy-btn");
    const maximizeBtn = document.getElementById("maximize-btn");
    const restoreBtn = document.getElementById("restore-btn");
    const templateBtns = document.querySelectorAll(".template-btn");
    const flagItems = document.querySelectorAll(".flag-item");

    // 防抖函数
    function debounce(fn, delay) {
        let timer = null;
        return function (...args) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // 执行正则匹配
    function executeRegex() {
        const pattern = regexInput.value;
        const flags = regexFlags.value;
        const text = testInput.value;

        // 清空结果
        resultOutput.innerHTML = "";
        matchDetails.innerHTML = "";
        matchCount.textContent = "";

        if (!pattern) {
            resultOutput.textContent = text;
            matchDetails.innerHTML = '<div class="no-match">请输入正则表达式</div>';
            return;
        }

        if (!text) {
            matchDetails.innerHTML = '<div class="no-match">请输入测试文本</div>';
            return;
        }

        try {
            const regex = new RegExp(pattern, flags);
            const matches = [];
            let match;

            // 收集所有匹配
            if (flags.includes("g")) {
                while ((match = regex.exec(text)) !== null) {
                    matches.push({
                        value: match[0],
                        index: match.index,
                        groups: match.slice(1)
                    });
                    // 防止无限循环
                    if (match.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }
                }
            } else {
                match = regex.exec(text);
                if (match) {
                    matches.push({
                        value: match[0],
                        index: match.index,
                        groups: match.slice(1)
                    });
                }
            }

            // 显示匹配数量
            matchCount.textContent = `(${matches.length} 个匹配)`;

            // 高亮显示结果
            if (matches.length > 0) {
                let highlightedText = "";
                let lastIndex = 0;

                matches.forEach((m) => {
                    // 添加未匹配部分
                    highlightedText += escapeHtml(text.slice(lastIndex, m.index));
                    // 添加高亮匹配部分
                    highlightedText += `<span class="match-highlight">${escapeHtml(m.value)}</span>`;
                    lastIndex = m.index + m.value.length;
                });

                // 添加剩余部分
                highlightedText += escapeHtml(text.slice(lastIndex));
                resultOutput.innerHTML = highlightedText;

                // 显示匹配详情
                renderMatchDetails(matches);
            } else {
                resultOutput.textContent = text;
                matchDetails.innerHTML = '<div class="no-match">没有找到匹配项</div>';
            }
        } catch (e) {
            resultOutput.innerHTML = `<div class="regex-error">正则表达式错误: ${e.message}</div>`;
            matchDetails.innerHTML = "";
            matchCount.textContent = "";
        }
    }

    // 渲染匹配详情
    function renderMatchDetails(matches) {
        let html = "";

        matches.forEach((m, index) => {
            html += `
                <div class="match-item">
                    <div class="match-item-header">
                        <span>匹配 #${index + 1}</span>
                        <span>位置: ${m.index} - ${m.index + m.value.length}</span>
                    </div>
                    <div class="match-item-value">${escapeHtml(m.value)}</div>
                    ${m.groups.length > 0 ? renderGroups(m.groups) : ""}
                </div>
            `;
        });

        matchDetails.innerHTML = html;
    }

    // 渲染捕获组
    function renderGroups(groups) {
        let html = '<div class="match-groups">';
        groups.forEach((g, i) => {
            html += `
                <div class="group-item">
                    <span class="group-label">组 ${i + 1}:</span>
                    <span class="group-value">${g !== undefined ? escapeHtml(g) : "(未匹配)"}</span>
                </div>
            `;
        });
        html += "</div>";
        return html;
    }

    // HTML 转义
    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    // 更新 flag 按钮状态
    function updateFlagButtons() {
        const currentFlags = regexFlags.value;
        flagItems.forEach((item) => {
            const flag = item.dataset.flag;
            if (currentFlags.includes(flag)) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
    }

    // 防抖后的执行函数
    const debouncedExecuteRegex = debounce(executeRegex, 150);

    // 事件监听
    regexInput.addEventListener("input", debouncedExecuteRegex);
    regexFlags.addEventListener("input", () => {
        updateFlagButtons();
        debouncedExecuteRegex();
    });
    testInput.addEventListener("input", debouncedExecuteRegex);

    // Flag 按钮点击
    flagItems.forEach((item) => {
        item.addEventListener("click", () => {
            const flag = item.dataset.flag;
            let currentFlags = regexFlags.value;

            if (currentFlags.includes(flag)) {
                currentFlags = currentFlags.replace(flag, "");
            } else {
                currentFlags += flag;
            }

            regexFlags.value = currentFlags;
            updateFlagButtons();
            executeRegex();
        });
    });

    // 模板按钮点击
    templateBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            regexInput.value = btn.dataset.regex;
            regexFlags.value = btn.dataset.flags || "g";
            updateFlagButtons();
            executeRegex();
        });
    });

    // 清空按钮
    clearBtn.addEventListener("click", () => {
        regexInput.value = "";
        regexFlags.value = "g";
        testInput.value = "";
        resultOutput.innerHTML = "";
        matchDetails.innerHTML = '<div class="no-match">请输入正则表达式和测试文本</div>';
        matchCount.textContent = "";
        updateFlagButtons();
    });

    // 复制正则
    copyBtn.addEventListener("click", () => {
        const pattern = regexInput.value;
        const flags = regexFlags.value;
        const fullRegex = `/${pattern}/${flags}`;

        navigator.clipboard.writeText(fullRegex).then(
            () => alert("已复制: " + fullRegex),
            () => alert("复制失败")
        );
    });

    // 最大化功能
    maximizeBtn.addEventListener("click", () => {
        document.body.classList.add("maximized");
        maximizeBtn.style.display = "none";
        restoreBtn.style.display = "inline-block";
    });

    restoreBtn.addEventListener("click", () => {
        document.body.classList.remove("maximized");
        maximizeBtn.style.display = "inline-block";
        restoreBtn.style.display = "none";
    });

    // ESC 键恢复
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && document.body.classList.contains("maximized")) {
            document.body.classList.remove("maximized");
            maximizeBtn.style.display = "inline-block";
            restoreBtn.style.display = "none";
        }
    });

    // 初始化
    updateFlagButtons();
    matchDetails.innerHTML = '<div class="no-match">请输入正则表达式和测试文本</div>';
});