// ===================== 全局通用函数 =====================
// 导航栏滚动吸顶
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('active', window.scrollY > 50);
    });
}

// 滚动渐入动画
const revealList = document.querySelectorAll('.reveal');
function checkReveal() {
    const winH = window.innerHeight;
    const point = 150;
    revealList.forEach(item => {
        const top = item.getBoundingClientRect().top;
        if (top < winH - point) {
            item.classList.add('active');
        }
    });
}
window.addEventListener('scroll', checkReveal);
window.addEventListener('load', checkReveal);

// 数字滚动动画（修复数字为0问题）
let numAnimated = false;
function animateNum(el) {
    const target = parseInt(el.dataset.target);
    let curr = 0;
    const step = target / 60;
    const timer = setInterval(() => {
        curr += step;
        if (curr >= target) {
            el.innerText = target;
            clearInterval(timer);
        } else {
            el.innerText = Math.floor(curr);
        }
    }, 30);
}

// 监听个人档案区域，触发数字动画
const aboutSection = document.getElementById('about');
if (aboutSection) {
    const aboutObs = new IntersectionObserver((e) => {
        if (e[0].isIntersecting && !numAnimated) {
            numAnimated = true;
            document.querySelectorAll('.stat-num').forEach(num => animateNum(num));
        }
    }, { threshold: 0.5 });
    aboutObs.observe(aboutSection);
}

// 进度条动画
function runProgress() {
    const lines = document.querySelectorAll('.p-line');
    lines.forEach(line => {
        const w = line.dataset.width;
        line.style.width = w + '%';
    });
}
const progressWrap = document.querySelector('.progress-wrap');
if (progressWrap) {
    const progressObs = new IntersectionObserver((e) => {
        e.forEach(item => {
            if (item.isIntersecting) {
                runProgress();
                progressObs.disconnect();
            }
        });
    }, { threshold: 0.3 });
    progressObs.observe(progressWrap);
}

// ===================== 粒子背景 =====================
const particleCanvas = document.getElementById('particleCanvas');
if (particleCanvas) {
    const pCtx = particleCanvas.getContext('2d');
    let particles = [];
    function resizeParticle() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
    resizeParticle();
    window.addEventListener('resize', resizeParticle);

    class Particle {
        constructor() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.r = Math.random() * 2 + 1;
            this.sx = (Math.random() - 0.5) * 0.8;
            this.sy = (Math.random() - 0.5) * 0.8;
        }
        update() {
            this.x += this.sx;
            this.y += this.sy;
            if (this.x < 0 || this.x > particleCanvas.width) this.sx *= -1;
            if (this.y < 0 || this.y > particleCanvas.height) this.sy *= -1;
        }
        draw() {
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.r, 0, Math.PI*2);
            pCtx.fillStyle = 'rgba(255,255,255,0.6)';
            pCtx.fill();
        }
    }

    for (let i = 0; i < 120; i++) {
        particles.push(new Particle());
    }

    function drawParticle() {
        pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        // 粒子连线
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 120) {
                    pCtx.beginPath();
                    pCtx.moveTo(particles[i].x, particles[i].y);
                    pCtx.lineTo(particles[j].x, particles[j].y);
                    pCtx.strokeStyle = `rgba(255,255,255,${(120 - dist)/120})`;
                    pCtx.lineWidth = 0.5;
                    pCtx.stroke();
                }
            }
        }
        requestAnimationFrame(drawParticle);
    }
    drawParticle();
}

// ===================== 项目详情弹窗 =====================
const projectModal = document.getElementById('projectModal');
function closeProjectModal() {
    projectModal.style.display = 'none';
}

// 点击外部关闭弹窗
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// 项目详情数据
const projectData = {
    1: {
        title: "动态可视化网页",
        desc: "本项目为个人可视化作品集主站，采用原生HTML+CSS+JS开发，集成粒子连线背景、滚动渐入、卡片hover效果、Canvas图表等高级动效。整体采用深色可视化风格，适配主流浏览器，实现导航吸顶、弹窗交互、路由跳转等完整功能。",
        tag: ["HTML/CSS", "JavaScript", "Canvas", "动效交互"]
    },
    2: {
        title: "数据雷达图系统",
        desc: "基于原生Canvas实现交互式技能雷达图，支持多组数据切换、鼠标悬浮提示、渐变填充、网格绘制。可用于能力评估、数据统计、可视化大屏等场景，代码模块化，可直接复用至各类项目。",
        tag: ["Canvas", "数据可视化", "原生JS"]
    },
    3: {
        title: "Python综合作业系统",
        desc: "基于Python开发的后台数据处理系统，包含数据录入、处理、统计、导出功能，配合简单界面交互，完成课程作业需求。实现了数据校验、异常处理、结果可视化等完整流程。",
        tag: ["Python", "数据处理", "系统开发"]
    }
};

function openProjectDetail(id) {
    const data = projectData[id];
    const box = document.getElementById('projectDetailBox');
    let tagHtml = data.tag.map(t => `<span class="project-detail-tag">${t}</span>`).join('');
    box.innerHTML = `
        <h3 class="project-detail-title">${data.title}</h3>
        <div class="project-detail-desc">${data.desc}</div>
        <div class="project-detail-tags">${tagHtml}</div>
    `;
    projectModal.style.display = 'flex';
}

// ===================== 动态雷达图（修复文字位置） =====================
const radarCanvas = document.getElementById('radarCanvas');
if (radarCanvas) {
    const rctx = radarCanvas.getContext('2d');
    radarCanvas.width = 400;
    radarCanvas.height = 400;
    const centerX = 200;
    const centerY = 200;
    const maxR = 140;

    // 三组数据
    const dataSets = {
        all: {
            labels: ['前端基础', 'Canvas可视化', '网页动效', 'Python开发', '交互设计', '代码规范'],
            data: [9, 8.5, 8, 7.5, 7, 8]
        },
        code: {
            labels: ['前端基础', 'Python开发', '代码规范', '算法基础', '数据结构', '调试能力'],
            data: [9, 7.5, 8, 6.5, 6, 7]
        },
        view: {
            labels: ['Canvas可视化', '网页动效', '交互设计', '视觉审美', '动效实现', '响应式设计'],
            data: [8.5, 8, 7, 7.5, 7, 8]
        }
    };
    let currentType = 'all';
    let currentData = [...dataSets[currentType].data];

    // 绘制雷达图（修复文字位置）
    function drawRadar(type = 'all') {
        rctx.clearRect(0,0,400,400);
        const set = dataSets[type];
        const angleStep = Math.PI * 2 / set.labels.length;

        // 网格
        rctx.strokeStyle = 'rgba(22, 93, 255, 0.2)';
        for (let r = 20; r <= maxR; r += 28) {
            rctx.beginPath();
            for (let i = 0; i <= set.labels.length; i++) {
                const angle = i * angleStep;
                const x = centerX + Math.cos(angle) * r;
                const y = centerY + Math.sin(angle) * r;
                i === 0 ? rctx.moveTo(x, y) : rctx.lineTo(x, y);
            }
            rctx.closePath();
            rctx.stroke();
        }
        // 轴线
        rctx.strokeStyle = 'rgba(22, 93, 255, 0.3)';
        set.labels.forEach((_, i) => {
            const angle = i * angleStep;
            const x = centerX + Math.cos(angle) * maxR;
            const y = centerY + Math.sin(angle) * maxR;
            rctx.beginPath();
            rctx.moveTo(centerX, centerY);
            rctx.lineTo(x, y);
            rctx.stroke();
        });
        // 数据（动画过渡）
        rctx.beginPath();
        set.data.forEach((val, i) => {
            const target = (val / 10) * maxR;
            const r = currentData[i] || target;
            const angle = i * angleStep;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            i === 0 ? rctx.moveTo(x, y) : rctx.lineTo(x, y);
        });
        rctx.closePath();
        const grad = rctx.createLinearGradient(centerX, centerY, centerX + maxR, centerY);
        grad.addColorStop(0, 'rgba(22, 93, 255, 0.4)');
        grad.addColorStop(1, 'rgba(64, 128, 255, 0.2)');
        rctx.fillStyle = grad;
        rctx.fill();
        rctx.strokeStyle = '#165DFF';
        rctx.lineWidth = 2;
        rctx.stroke();
        // 标签（修复文字位置）
        rctx.fillStyle = '#fff';
        rctx.font = '14px Microsoft YaHei';
        set.labels.forEach((text, i) => {
            const angle = i * angleStep;
            const r = maxR + 30;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            // 文字对齐优化
            let align = 'center';
            if (angle > Math.PI / 2 && angle < Math.PI * 1.5) align = 'right';
            if (angle < Math.PI / 2 || angle > Math.PI * 1.5) align = 'left';
            rctx.textAlign = align;
            rctx.textBaseline = 'middle';
            rctx.fillText(text, x, y);
        });
    }

    // 动画过渡
    function animateRadar(type) {
        const set = dataSets[type];
        const steps = 30;
        let step = 0;
        const timer = setInterval(() => {
            step++;
            currentData = currentData.map((val, i) => {
                const target = (set.data[i] / 10) * maxR;
                return val + (target - val) / steps;
            });
            drawRadar(type);
            if (step >= steps) {
                clearInterval(timer);
                currentData = set.data.map(v => (v / 10) * maxR);
            }
        }, 30);
    }

    // 按钮切换
    const skillBtns = document.querySelectorAll('.skill-btn');
    skillBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            skillBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const type = btn.dataset.type;
            animateRadar(type);
        });
    });

    drawRadar('all');
}

// ===================== 留言表单（优化细化版） =====================
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formTip = document.getElementById('formTip');
const messageList = document.getElementById('messageList');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nickname = document.getElementById('nickname').value.trim();
        const message = document.getElementById('message').value.trim();

        // 表单验证
        if (!nickname || !message) {
            formTip.textContent = '请填写完整昵称和留言内容';
            formTip.style.color = '#ff4d4f';
            return;
        }

        // 提交动画
        submitBtn.disabled = true;
        submitBtn.textContent = '发送中...';
        submitBtn.style.opacity = '0.7';

        // 模拟提交
        setTimeout(() => {
            // 添加新留言
            const newMsg = document.createElement('div');
            newMsg.className = 'message-item';
            newMsg.innerHTML = `
                <div class="message-name">${nickname}</div>
                <div class="message-text">${message}</div>
            `;
            messageList.insertBefore(newMsg, messageList.firstChild);

            // 重置表单
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = '发送留言';
            submitBtn.style.opacity = '1';

            // 成功提示
            formTip.textContent = '留言发送成功！';
            formTip.style.color = '#73D13D';
        }, 800);
    });
}
// ===================== 数字统计弹窗 =====================
const statModal = document.getElementById('statModal');
const statDetailBox = document.getElementById('statDetailBox');

// 数字详情数据
const statData = {
    project: {
        title: "完成项目统计",
        desc: "在学习过程中，我已完成20个大小项目，涵盖前端页面开发、数据可视化、Python系统开发等方向。这些项目不仅提升了我的代码能力，也让我掌握了从需求分析到上线部署的完整流程。",
        tags: ["前端开发", "数据可视化", "Python项目", "课程作业"]
    },
    skill: {
        title: "技术栈统计",
        desc: "我目前掌握8项核心技术栈，包括HTML/CSS、JavaScript、Canvas、Python、数据处理、响应式设计、动效交互、版本控制。这些技术覆盖了前端、后端和数据处理多个领域，让我能应对不同类型的开发需求。",
        tags: ["HTML/CSS", "JavaScript", "Canvas", "Python"]
    },
    code: {
        title: "代码行数统计",
        desc: "截至目前，我累计编写了超过1000行有效代码，主要用于项目开发、课程作业和练习。这些代码不仅帮助我巩固了语法知识，也让我养成了良好的编码习惯，如模块化设计、注释规范和错误处理。",
        tags: ["代码规范", "模块化开发", "错误处理", "注释编写"]
    }
};

function openStatModal(type) {
    const data = statData[type];
    let tagHtml = data.tags.map(t => `<span class="project-detail-tag">${t}</span>`).join('');
    statDetailBox.innerHTML = `
        <h3 class="project-detail-title">${data.title}</h3>
        <div class="project-detail-desc">${data.desc}</div>
        <div class="project-detail-tags">${tagHtml}</div>
    `;
    statModal.style.display = 'flex';
}

// 通用关闭弹窗函数
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// 点击外部关闭弹窗
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});