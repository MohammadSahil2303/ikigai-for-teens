/**
 * ============================================================
 * assessment.js — Adaptive Quiz Engine
 *
 * 📚 HOW THE ADAPTIVE QUIZ WORKS:
 * 1. User answers Phase 1 questions (broad interests)
 * 2. Based on THOSE answers, we pick Phase 2 follow-ups
 *    (e.g., if they love tech → ask about coding vs hardware)
 * 3. Phase 3 = Values questions (everyone gets these)
 * 4. We calculate Ikigai scores and redirect to results page
 *
 * 📚 DATA FLOW:
 * answers object → scoring function → localStorage → results page
 * ============================================================
 */

// ============================================================
// QUESTION BANK
// Each question has: id, text, subtitle, phase, type, options
// Types: 'mcq' (single choice), 'multi' (multi select), 'slider'
// ============================================================

const QUESTIONS = {

  // ── PHASE 1: BROAD INTEREST CATEGORIES ──
  phase1: [
    {
      id: 'p1_interest',
      text: '🎯 What do you enjoy most in your free time?',
      sub: 'Choose the option that feels most like YOU.',
      type: 'mcq',
      options: [
        { label: 'Building things (code, craft, hardware)', value: 'maker', emoji: '🔧' },
        { label: 'Helping people (caring, teaching, guiding)', value: 'helper', emoji: '💚' },
        { label: 'Creating things (art, music, stories, design)', value: 'creator', emoji: '🎨' },
        { label: 'Analyzing things (data, research, puzzles)', value: 'analyst', emoji: '🔬' },
      ]
    },
    {
      id: 'p1_school',
      text: '📚 Which school subject do you find most interesting?',
      sub: 'Even if you\'re not perfect at it — what INTERESTS you most?',
      type: 'mcq',
      options: [
        { label: '💻 Computers / Math / Physics', value: 'stem' },
        { label: '🎨 Art / Music / Literature', value: 'arts' },
        { label: '🔬 Biology / Chemistry', value: 'science' },
        { label: '📖 History / Social Studies / Languages', value: 'humanities' },
      ]
    },
    {
      id: 'p1_world',
      text: '🌍 What kind of IMPACT do you want to have on the world?',
      sub: 'Think about what really matters to you.',
      type: 'mcq',
      options: [
        { label: '💻 Build technology that changes how we live', value: 'tech_impact' },
        { label: '🏥 Improve people\'s health and wellbeing', value: 'health_impact' },
        { label: '🌱 Protect the environment and the planet', value: 'env_impact' },
        { label: '📚 Educate and inspire the next generation', value: 'edu_impact' },
        { label: '💰 Build a successful business or company', value: 'biz_impact' },
        { label: '🎨 Create art, culture, and beauty', value: 'art_impact' },
      ]
    },
  ],

  // ── PHASE 2: ADAPTIVE FOLLOW-UPS ──
  // These are triggered based on Phase 1 answers
  // Key = which Phase 1 value triggers this question

  adaptive_maker: [
    {
      id: 'p2_maker_type',
      text: '🔧 When you say you like "building things", what do you mean more?',
      sub: 'Get specific — this helps us match you better.',
      type: 'mcq',
      options: [
        { label: '💻 Writing code and building software/apps', value: 'software' },
        { label: '🤖 Physical things — robots, electronics, machines', value: 'hardware' },
        { label: '🏗️ Large structures — buildings, bridges, systems', value: 'engineering' },
        { label: '🎮 Games, animations, interactive media', value: 'game_dev' },
      ]
    },
    {
      id: 'p2_maker_team',
      text: '👥 Do you prefer working alone or with others?',
      sub: 'There\'s no wrong answer — it affects which roles suit you.',
      type: 'mcq',
      options: [
        { label: '🦅 Mostly alone — I do my best thinking solo', value: 'solo' },
        { label: '🤝 Small team of 2-5 people', value: 'small_team' },
        { label: '🏢 Large team with lots of collaboration', value: 'large_team' },
        { label: '🔀 Mix of both — depends on the task', value: 'mixed' },
      ]
    }
  ],

  adaptive_helper: [
    {
      id: 'p2_helper_type',
      text: '💚 How specifically do you want to help people?',
      sub: 'Narrowing this down reveals your ideal career.',
      type: 'mcq',
      options: [
        { label: '🩺 Heal their physical health (medicine, nursing)', value: 'medical' },
        { label: '🧠 Support their mental health (psychology, counseling)', value: 'mental_health' },
        { label: '📚 Teach and educate them (teaching, mentoring)', value: 'teaching' },
        { label: '⚖️ Protect their rights (law, social work)', value: 'legal_social' },
      ]
    }
  ],

  adaptive_creator: [
    {
      id: 'p2_creator_medium',
      text: '🎨 What\'s your creative medium of choice?',
      sub: 'The format you create in shapes your career path.',
      type: 'mcq',
      options: [
        { label: '✏️ Visual art — drawing, painting, illustration', value: 'visual_art' },
        { label: '💻 Digital design — UI/UX, graphics, branding', value: 'digital_design' },
        { label: '🎵 Music — composing, producing, performing', value: 'music' },
        { label: '✍️ Writing — stories, scripts, journalism', value: 'writing' },
        { label: '🎬 Video — filmmaking, photography, content', value: 'video' },
      ]
    }
  ],

  adaptive_analyst: [
    {
      id: 'p2_analyst_domain',
      text: '🔬 What kind of problems do you love analyzing?',
      sub: 'Different fields need different kinds of analytical minds.',
      type: 'mcq',
      options: [
        { label: '📊 Business and market data (trends, patterns)', value: 'business_analyst' },
        { label: '🧬 Scientific data (experiments, research)', value: 'scientist' },
        { label: '💻 Code and systems (debugging, optimization)', value: 'technical_analyst' },
        { label: '🌍 Social patterns (society, politics, behavior)', value: 'social_analyst' },
      ]
    }
  ],

  // ── PHASE 3: VALUES (Everyone gets these) ──
  phase3: [
    {
      id: 'p3_income',
      text: '💰 How important is financial income to you?',
      sub: 'Be honest — money matters are real!',
      type: 'slider',
      min: 1, max: 5,
      labels: ['Barely matters', 'Only somewhat', 'Balanced', 'Very important', 'Top priority'],
      emojis: ['😌', '🙂', '😊', '💪', '💰']
    },
    {
      id: 'p3_stability',
      text: '🏛️ How much do you value job stability?',
      sub: 'Some prefer security; others prefer exciting risk.',
      type: 'slider',
      min: 1, max: 5,
      labels: ['Love adventure & risk', '', 'Balanced', '', 'Need guaranteed security'],
      emojis: ['🚀', '🤙', '😊', '🏠', '🏛️']
    },
    {
      id: 'p3_leadership',
      text: '👑 Do you see yourself in a leadership role?',
      sub: 'Leaders aren\'t always born — they\'re made. But preference matters.',
      type: 'mcq',
      options: [
        { label: '👑 Yes — I want to lead teams and organizations', value: 'leader' },
        { label: '⚡ I prefer being the expert others come to', value: 'expert' },
        { label: '🤲 I love collaborating as equal peers', value: 'collaborator' },
        { label: '🦅 I\'d rather work independently & own my time', value: 'independent' },
      ]
    },
    {
      id: 'p3_creativity_level',
      text: '🎨 How much creativity do you want in your daily work?',
      sub: 'Some careers are highly creative; others are structured and methodical.',
      type: 'slider',
      min: 1, max: 5,
      labels: ['Structured & logical', '', 'Mix of both', '', 'Highly creative always'],
      emojis: ['📊', '🧩', '⚡', '🎭', '🎨']
    },
    {
      id: 'p3_skills',
      text: '💪 Which of these are you naturally good at?',
      sub: 'Select ALL that apply — don\'t be humble!',
      type: 'multi',
      options: [
        { label: 'Explaining things clearly', value: 'communication', emoji: '💬' },
        { label: 'Solving complex problems', value: 'problem_solving', emoji: '🧩' },
        { label: 'Organizing & planning', value: 'organization', emoji: '📋' },
        { label: 'Drawing / designing', value: 'design', emoji: '✏️' },
        { label: 'Building / making things', value: 'building', emoji: '🔧' },
        { label: 'Listening & empathy', value: 'empathy', emoji: '💚' },
        { label: 'Research & reading', value: 'research', emoji: '📚' },
        { label: 'Math & numbers', value: 'math', emoji: '🔢' },
      ]
    },
  ]
};

// ============================================================
// CAREER DATABASE
// 📚 This is where the "Smart Logic" lives.
// Each career has: skills that match, values, and Ikigai scores
// ============================================================

const CAREERS = [
  {
    id: 'software_dev',
    title: 'Software Developer',
    emoji: '💻',
    category: 'technology',
    desc: 'Design, code, and maintain applications, websites, games, and systems. The backbone of the digital economy.',
    salary: '₹8–40 LPA (India) / $80k–$160k (Global)',
    growth: '+25% next decade',
    education: 'B.Tech CS / Self-taught + Portfolio',
    skills_needed: ['Problem-solving', 'Logic', 'Persistence', 'Teamwork'],
    roadmap: ['Learn Python/JavaScript', 'Build projects', 'Open source contributions', 'Get internship'],
    triggers: { interest: ['maker'], specific: ['software', 'game_dev'], skills: ['problem_solving', 'building', 'math'], values: ['tech_impact'] },
    ikigai: { love: 80, good_at: 85, world_needs: 90, paid_for: 95 }
  },
  {
    id: 'data_scientist',
    title: 'Data Scientist / AI Engineer',
    emoji: '📊',
    category: 'technology',
    desc: 'Extract insights from massive datasets and build AI/ML models that power products used by millions.',
    salary: '₹10–60 LPA (India) / $100k–$200k (Global)',
    growth: '+35% next decade',
    education: 'B.Tech / B.Sc Statistics + Python',
    skills_needed: ['Math', 'Statistics', 'Critical thinking', 'Python/R'],
    roadmap: ['Study statistics + Python', 'Learn ML libraries', 'Build ML projects', 'Kaggle competitions'],
    triggers: { interest: ['analyst'], specific: ['software', 'technical_analyst', 'scientist'], skills: ['math', 'research', 'problem_solving'], values: ['tech_impact'] },
    ikigai: { love: 75, good_at: 80, world_needs: 95, paid_for: 95 }
  },
  {
    id: 'ux_designer',
    title: 'UX / UI Designer',
    emoji: '🎨',
    category: 'creative',
    desc: 'Design beautiful, intuitive digital experiences. You sit at the intersection of art, psychology, and technology.',
    salary: '₹6–25 LPA (India) / $70k–$130k (Global)',
    growth: '+15% next decade',
    education: 'Design degree or self-taught + Portfolio',
    skills_needed: ['Empathy', 'Creativity', 'Visual thinking', 'Figma/Sketch'],
    roadmap: ['Learn Figma', 'Study UX principles', 'Build case studies', 'Get feedback from users'],
    triggers: { interest: ['creator', 'maker'], specific: ['digital_design', 'software', 'visual_art'], skills: ['design', 'empathy', 'problem_solving'], values: ['tech_impact', 'art_impact'] },
    ikigai: { love: 85, good_at: 80, world_needs: 80, paid_for: 85 }
  },
  {
    id: 'doctor',
    title: 'Medical Doctor / Physician',
    emoji: '🩺',
    category: 'healthcare',
    desc: 'Diagnose and treat illness, prevent disease, and be there for people in their most vulnerable moments.',
    salary: '₹8–50 LPA (India) / $200k+ (Global)',
    growth: '+7% next decade',
    education: 'MBBS → MD/MS (10–15 years)',
    skills_needed: ['Empathy', 'Attention to detail', 'Resilience', 'Science'],
    roadmap: ['Ace Biology/Chemistry', 'NEET preparation', 'MBBS', 'Specialization'],
    triggers: { interest: ['helper'], specific: ['medical'], skills: ['empathy', 'research', 'problem_solving'], values: ['health_impact'] },
    ikigai: { love: 85, good_at: 75, world_needs: 95, paid_for: 90 }
  },
  {
    id: 'psychologist',
    title: 'Psychologist / Counselor',
    emoji: '🧠',
    category: 'healthcare',
    desc: 'Help people understand and overcome mental health challenges. One of the most meaningful careers of our generation.',
    salary: '₹4–20 LPA (India) / $70k–$130k (Global)',
    growth: '+20% next decade',
    education: 'B.Sc / B.A Psychology → M.Sc → PhD',
    skills_needed: ['Active listening', 'Empathy', 'Patience', 'Analytical thinking'],
    roadmap: ['Study psychology', 'Internship at clinic', 'Masters degree', 'Get licensed'],
    triggers: { interest: ['helper'], specific: ['mental_health'], skills: ['empathy', 'research', 'communication'], values: ['health_impact', 'edu_impact'] },
    ikigai: { love: 90, good_at: 80, world_needs: 85, paid_for: 70 }
  },
  {
    id: 'teacher',
    title: 'Teacher / Educator',
    emoji: '📚',
    category: 'education',
    desc: 'Shape the minds and futures of the next generation. The profession that makes all other professions possible.',
    salary: '₹3–15 LPA (India) / $45k–$90k (Global)',
    growth: '+5% next decade',
    education: 'Bachelor\'s degree + B.Ed',
    skills_needed: ['Communication', 'Patience', 'Creativity', 'Subject expertise'],
    roadmap: ['Choose subject', 'Bachelor\'s degree', 'B.Ed', 'Teaching internship'],
    triggers: { interest: ['helper'], specific: ['teaching'], skills: ['communication', 'empathy', 'research'], values: ['edu_impact'] },
    ikigai: { love: 90, good_at: 85, world_needs: 90, paid_for: 60 }
  },
  {
    id: 'entrepreneur',
    title: 'Entrepreneur / Startup Founder',
    emoji: '🚀',
    category: 'business',
    desc: 'Build your own company from scratch. Turn a problem you\'ve noticed into a product that millions use.',
    salary: 'Unlimited potential — but uncertain early on',
    growth: 'N/A — you create your own growth',
    education: 'Any field + real-world experience',
    skills_needed: ['Resilience', 'Vision', 'Leadership', 'Execution'],
    roadmap: ['Learn a valuable skill', 'Find a problem', 'Build MVP', 'Find early customers'],
    triggers: { interest: ['maker', 'analyst'], specific: ['business_analyst', 'software'], skills: ['problem_solving', 'communication', 'organization'], values: ['biz_impact', 'tech_impact'], leadership: ['leader'] },
    ikigai: { love: 85, good_at: 70, world_needs: 80, paid_for: 85 }
  },
  {
    id: 'environmental_scientist',
    title: 'Environmental Scientist',
    emoji: '🌱',
    category: 'science',
    desc: 'Protect the planet by studying ecosystems, climate change, and developing solutions to environmental challenges.',
    salary: '₹4–15 LPA (India) / $60k–$100k (Global)',
    growth: '+10% next decade',
    education: 'B.Sc Environmental Science / Biology',
    skills_needed: ['Research', 'Data analysis', 'Field work', 'Report writing'],
    roadmap: ['Study environmental science', 'Internship with NGO', 'Field research', 'Masters / Policy work'],
    triggers: { interest: ['analyst', 'helper'], specific: ['scientist'], skills: ['research', 'problem_solving'], values: ['env_impact'] },
    ikigai: { love: 80, good_at: 75, world_needs: 95, paid_for: 65 }
  },
  {
    id: 'content_creator',
    title: 'Digital Content Creator',
    emoji: '🎬',
    category: 'creative',
    desc: 'Build an audience by creating videos, podcasts, or written content that educates, entertains, or inspires.',
    salary: 'Highly variable — can be $0 to $millions',
    growth: 'Exploding — creator economy is booming',
    education: 'No formal degree needed — skills + consistency',
    skills_needed: ['Storytelling', 'Video/writing skills', 'Consistency', 'Marketing'],
    roadmap: ['Pick a niche', 'Create consistently', 'Learn video/design tools', 'Grow audience'],
    triggers: { interest: ['creator'], specific: ['video', 'writing', 'music'], skills: ['communication', 'design', 'empathy'], values: ['art_impact', 'edu_impact'] },
    ikigai: { love: 90, good_at: 80, world_needs: 70, paid_for: 75 }
  },
  {
    id: 'civil_engineer',
    title: 'Civil / Mechanical Engineer',
    emoji: '🏗️',
    category: 'technology',
    desc: 'Design and build the infrastructure that holds society together — roads, bridges, buildings, water systems.',
    salary: '₹5–30 LPA (India) / $70k–$130k (Global)',
    growth: '+7% next decade',
    education: 'B.Tech Civil / Mechanical Engineering',
    skills_needed: ['Math', 'Physics', 'Problem-solving', 'CAD software'],
    roadmap: ['Strong Math & Physics base', 'B.Tech in engineering', 'Internship', 'Professional license'],
    triggers: { interest: ['maker', 'analyst'], specific: ['hardware', 'engineering'], skills: ['math', 'building', 'problem_solving'], values: ['env_impact', 'tech_impact'] },
    ikigai: { love: 75, good_at: 80, world_needs: 90, paid_for: 85 }
  },
  {
    id: 'graphic_designer',
    title: 'Graphic / Visual Designer',
    emoji: '✏️',
    category: 'creative',
    desc: 'Create visual communication — logos, branding, posters, packaging. Make businesses look their best.',
    salary: '₹3–20 LPA (India) / $45k–$100k (Global)',
    growth: '+3% next decade',
    education: 'BFA / Self-taught + Strong Portfolio',
    skills_needed: ['Visual creativity', 'Adobe Suite', 'Color theory', 'Typography'],
    roadmap: ['Learn Adobe Illustrator & Photoshop', 'Build design portfolio', 'Freelance projects', 'Land full-time role'],
    triggers: { interest: ['creator'], specific: ['visual_art', 'digital_design'], skills: ['design', 'communication'], values: ['art_impact', 'biz_impact'] },
    ikigai: { love: 90, good_at: 85, world_needs: 75, paid_for: 70 }
  },
  {
    id: 'lawyer',
    title: 'Lawyer / Legal Advocate',
    emoji: '⚖️',
    category: 'law',
    desc: 'Defend rights, argue cases, shape policy, and help ensure justice in society.',
    salary: '₹6–50 LPA (India) / $80k–$200k (Global)',
    growth: '+4% next decade',
    education: 'BA LLB / B.Com LLB (5 years)',
    skills_needed: ['Argumentation', 'Research', 'Writing', 'Confidence'],
    roadmap: ['Strong humanities background', 'LLB degree', 'Moot courts & internships', 'Bar exam / enrollment'],
    triggers: { interest: ['analyst', 'helper'], specific: ['legal_social', 'social_analyst'], skills: ['communication', 'research', 'problem_solving'], values: ['edu_impact', 'health_impact'] },
    ikigai: { love: 80, good_at: 75, world_needs: 90, paid_for: 85 }
  }
];

// ============================================================
// STATE — Current quiz state variables
// 📚 "state" means all the data about what's happening right now
// ============================================================

let state = {
  userName: '',
  userAge: '',
  answers: {},              // Stores all answers: { questionId: answer }
  currentQuestion: 0,       // Index of current question
  questionSequence: [],      // Array of question ids in order
  phase: 1,                 // Current phase (1, 2, or 3)
  selectedOptions: [],       // For multi-select questions
};

// ============================================================
// BUILD QUESTION SEQUENCE
// This is the ADAPTIVE LOGIC — decides which questions to ask
// ============================================================

function buildQuestionSequence() {
  const sequence = [];

  // Phase 1: Always ask these 3
  QUESTIONS.phase1.forEach(q => sequence.push({ ...q, phaseNum: 1 }));

  // Phase 2: Based on Phase 1 answers (we pick after they answer)
  // We'll add adaptive questions dynamically when we reach them

  // Phase 3: Always ask these value questions
  QUESTIONS.phase3.forEach(q => sequence.push({ ...q, phaseNum: 3 }));

  return sequence;
}

function insertAdaptiveQuestions() {
  // Look at the Phase 1 answers and insert appropriate Phase 2 questions
  const interest = state.answers['p1_interest'];
  const adaptiveKey = `adaptive_${interest}`;
  const adaptiveQuestions = QUESTIONS[adaptiveKey] || [];

  // Find where phase 3 starts and insert before it
  const phase3Start = state.questionSequence.findIndex(q => q.phaseNum === 3);

  const toInsert = adaptiveQuestions.map(q => ({ ...q, phaseNum: 2 }));
  state.questionSequence.splice(phase3Start, 0, ...toInsert);
}

// ============================================================
// ASSESSMENT START
// ============================================================

document.getElementById('startAssessmentBtn')?.addEventListener('click', function() {
  // Validate intro fields
  const nameInput = document.getElementById('userName');
  const ageSelect = document.getElementById('userAge');
  let valid = true;

  if (!nameInput.value.trim()) {
    document.getElementById('nameError').classList.add('show');
    nameInput.classList.add('error');
    valid = false;
  } else {
    document.getElementById('nameError').classList.remove('show');
    nameInput.classList.remove('error');
  }

  if (!ageSelect.value) {
    document.getElementById('ageError').classList.add('show');
    ageSelect.classList.add('error');
    valid = false;
  } else {
    document.getElementById('ageError').classList.remove('show');
    ageSelect.classList.remove('error');
  }

  if (!valid) return;

  // Store user info
  state.userName = nameInput.value.trim();
  state.userAge = ageSelect.value;

  // Build initial question sequence
  state.questionSequence = buildQuestionSequence();
  state.currentQuestion = 0;
  state.answers = {};

  // Show quiz screen
  document.getElementById('screen-intro').classList.add('hidden');
  document.getElementById('screen-quiz').classList.remove('hidden');

  // Render first question
  renderQuestion();
});

// ============================================================
// RENDER QUESTION
// Displays the current question on screen
// ============================================================

function renderQuestion() {
  const q = state.questionSequence[state.currentQuestion];
  const total = state.questionSequence.length;
  const current = state.currentQuestion + 1;

  // Update progress
  document.getElementById('questionNumber').textContent = `QUESTION ${current}`;
  document.getElementById('questionText').textContent = q.text;
  document.getElementById('questionSub').textContent = q.sub || '';
  document.getElementById('progressLabel').textContent = `Question ${current} of ${total}`;
  document.getElementById('progressFill').style.width = `${((current - 1) / total) * 100}%`;

  // Update phase indicator
  const phaseNames = { 1: 'Interests', 2: 'Skills & Passions', 3: 'Values' };
  document.getElementById('progressPhase').textContent = `Phase: ${phaseNames[q.phaseNum] || ''}`;
  updatePhaseDots(q.phaseNum);

  // Update prev button
  const prevBtn = document.getElementById('prevBtn');
  prevBtn.style.visibility = state.currentQuestion > 0 ? 'visible' : 'hidden';

  // Update next button
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.textContent = current === total ? '✅ Finish' : 'Next →';

  // Render question options based on type
  const area = document.getElementById('optionsArea');
  area.innerHTML = '';

  if (q.type === 'mcq') {
    renderMCQ(q, area);
  } else if (q.type === 'multi') {
    renderMultiSelect(q, area);
  } else if (q.type === 'slider') {
    renderSlider(q, area);
  }

  // Animate card entrance
  const card = document.getElementById('questionCard');
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  requestAnimationFrame(() => {
    card.style.transition = 'all 0.3s ease';
    card.style.opacity = '1';
    card.style.transform = 'none';
  });

  // Reset selected options for multi questions
  if (q.type === 'multi') {
    state.selectedOptions = state.answers[q.id] || [];
    updateMultiSelectUI();
  }
}

function updatePhaseDots(currentPhase) {
  document.getElementById('phase-1').className = `phase-dot ${currentPhase === 1 ? 'active' : currentPhase > 1 ? 'done' : ''}`;
  document.getElementById('phase-2').className = `phase-dot ${currentPhase === 2 ? 'active' : currentPhase > 2 ? 'done' : ''}`;
  document.getElementById('phase-3').className = `phase-dot ${currentPhase === 3 ? 'active' : ''}`;
}

// ── MCQ Rendering ──
function renderMCQ(q, area) {
  const grid = document.createElement('div');
  grid.className = 'options-grid';

  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const savedAnswer = state.answers[q.id];

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = `option-btn ${savedAnswer === opt.value ? 'selected' : ''}`;
    btn.setAttribute('data-value', opt.value);
    btn.innerHTML = `
      <span class="option-letter">${letters[i]}</span>
      <span>${opt.emoji ? opt.emoji + ' ' : ''}${opt.label}</span>
    `;

    btn.addEventListener('click', () => {
      // Deselect all
      grid.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
      // Select this one
      btn.classList.add('selected');
      // Save answer
      state.answers[q.id] = opt.value;
    });

    grid.appendChild(btn);
  });

  area.appendChild(grid);
}

// ── Multi-Select Rendering ──
function renderMultiSelect(q, area) {
  const hint = document.createElement('p');
  hint.style.cssText = 'color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 14px;';
  hint.textContent = '✅ Select all that apply. Pick at least one.';
  area.appendChild(hint);

  const grid = document.createElement('div');
  grid.className = 'multi-select-grid';
  grid.id = 'multiGrid';

  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'tag-option';
    btn.setAttribute('data-value', opt.value);
    btn.innerHTML = `<span class="tag-icon">${opt.emoji}</span><span>${opt.label}</span>`;

    btn.addEventListener('click', () => {
      const idx = state.selectedOptions.indexOf(opt.value);
      if (idx === -1) {
        state.selectedOptions.push(opt.value);
        btn.classList.add('selected');
      } else {
        state.selectedOptions.splice(idx, 1);
        btn.classList.remove('selected');
      }
      state.answers[q.id] = [...state.selectedOptions];
    });

    grid.appendChild(btn);
  });

  area.appendChild(grid);
}

function updateMultiSelectUI() {
  document.querySelectorAll('#multiGrid .tag-option').forEach(btn => {
    const val = btn.getAttribute('data-value');
    btn.classList.toggle('selected', state.selectedOptions.includes(val));
  });
}

// ── Slider Rendering ──
function renderSlider(q, area) {
  const savedVal = state.answers[q.id] || 3;

  const container = document.createElement('div');
  container.className = 'slider-container';
  container.innerHTML = `
    <div class="slider-value" id="sliderDisplay">${q.emojis ? q.emojis[savedVal - 1] : savedVal}</div>
    <input type="range" min="${q.min}" max="${q.max}" value="${savedVal}" id="sliderInput">
    <div class="slider-labels">
      ${q.labels.map(l => `<span>${l}</span>`).join('')}
    </div>
  `;

  const input = container.querySelector('#sliderInput');
  const display = container.querySelector('#sliderDisplay');

  input.addEventListener('input', () => {
    const val = parseInt(input.value);
    state.answers[q.id] = val;
    display.textContent = q.emojis ? q.emojis[val - 1] : val;
  });

  // Save initial value
  state.answers[q.id] = savedVal;
  area.appendChild(container);
}

// ============================================================
// NAVIGATION — Next / Previous
// ============================================================

function nextQuestion() {
  const q = state.questionSequence[state.currentQuestion];

  // Validate: ensure user answered
  if (q.type === 'mcq') {
    if (!state.answers[q.id]) {
      showToast('Please select an option to continue.', 'error');
      // Shake the question card
      const card = document.getElementById('questionCard');
      card.style.animation = 'none';
      card.offsetHeight; // trigger reflow
      card.style.animation = 'shake 0.4s ease';
      return;
    }
  }

  if (q.type === 'multi') {
    if (!state.answers[q.id] || state.answers[q.id].length === 0) {
      showToast('Please select at least one option.', 'error');
      return;
    }
  }

  // After Phase 1 is complete (q index = 2), insert adaptive questions
  if (state.currentQuestion === 2 && state.questionSequence.filter(q => q.phaseNum === 2).length === 0) {
    insertAdaptiveQuestions();
  }

  // Check if we're at the last question
  if (state.currentQuestion >= state.questionSequence.length - 1) {
    finishAssessment();
    return;
  }

  state.currentQuestion++;
  renderQuestion();
}

function prevQuestion() {
  if (state.currentQuestion > 0) {
    state.currentQuestion--;
    renderQuestion();
  }
}

// ============================================================
// FINISH — Score and complete
// ============================================================

function finishAssessment() {
  // Calculate Ikigai profile scores
  const scores = calculateIkigaiScores();

  // Match careers
  const matches = matchCareers(scores);

  // Save everything to localStorage for results page
  setStorage('ikigai_assessment', {
    userName: state.userName,
    userAge: state.userAge,
    answers: state.answers,
    scores: scores,
    matches: matches,
    completedAt: new Date().toISOString()
  });

  // Show completion screen
  showLoading('Calculating your Ikigai profile...');

  setTimeout(() => {
    hideLoading();
    document.getElementById('screen-quiz').classList.add('hidden');
    document.getElementById('screen-complete').classList.remove('hidden');

    // Show scores on completion screen
    document.getElementById('completionMsg').textContent =
      `Great job, ${state.userName}! We've analyzed your profile and found ${matches.length} career matches for you.`;

    displayCompletionScores(scores);
  }, 2000);
}

function calculateIkigaiScores() {
  const answers = state.answers;
  const scores = { love: 50, good_at: 50, world_needs: 50, paid_for: 50 };

  // ── LOVE score ──
  // High if they have strong interests in things they're passionate about
  if (answers.p1_interest) scores.love += 20;
  if (answers.p2_creator_medium || answers.p2_maker_type) scores.love += 15;
  const creativeLevel = answers.p3_creativity_level || 3;
  scores.love += (creativeLevel - 3) * 7;

  // ── GOOD AT score ──
  const skills = answers.p3_skills || [];
  scores.good_at += skills.length * 5;
  if (answers.p2_maker_team === 'small_team' || answers.p2_maker_team === 'large_team') scores.good_at += 10;

  // ── WORLD NEEDS score ──
  if (answers.p1_world) scores.world_needs += 25;
  if (['health_impact', 'env_impact', 'edu_impact'].includes(answers.p1_world)) scores.world_needs += 10;

  // ── PAID FOR score ──
  const incomeImportance = answers.p3_income || 3;
  scores.paid_for += (incomeImportance - 1) * 8;
  const stability = answers.p3_stability || 3;
  scores.paid_for += (stability - 3) * 5;

  // Clamp all scores to 0-100 range
  Object.keys(scores).forEach(key => {
    scores[key] = Math.min(100, Math.max(0, Math.round(scores[key])));
  });

  return scores;
}

function matchCareers(userScores) {
  const answers = state.answers;
  const interest = answers.p1_interest;
  const world_value = answers.p1_world;
  const specific = answers.p2_maker_type || answers.p2_helper_type || answers.p2_creator_medium || answers.p2_analyst_domain || '';
  const skills = answers.p3_skills || [];
  const leadership = answers.p3_leadership;

  return CAREERS.map(career => {
    let score = 0;
    const t = career.triggers;

    // Interest match
    if (t.interest && t.interest.includes(interest)) score += 30;
    // Specific follow-up match
    if (t.specific && t.specific.includes(specific)) score += 25;
    // World values match
    if (t.values && t.values.includes(world_value)) score += 20;
    // Skills match
    if (t.skills) {
      const matched = skills.filter(s => t.skills.includes(s));
      score += matched.length * 8;
    }
    // Leadership match
    if (t.leadership && t.leadership.includes(leadership)) score += 10;

    // Cap at 100
    score = Math.min(100, score);

    return { ...career, matchScore: score };
  })
  .sort((a, b) => b.matchScore - a.matchScore)  // Sort highest match first
  .slice(0, 8);  // Top 8 matches
}

function displayCompletionScores(scores) {
  const container = document.getElementById('ikigaiScoreDisplay');
  if (!container) return;

  const pillars = [
    { key: 'love', label: '❤️ Love', color: 'var(--accent-purple)' },
    { key: 'good_at', label: '💪 Skill', color: 'var(--accent-pink)' },
    { key: 'world_needs', label: '🌍 Mission', color: 'var(--accent-cyan)' },
    { key: 'paid_for', label: '💰 Vocation', color: 'var(--accent-green)' },
  ];

  container.innerHTML = pillars.map(p => `
    <div style="text-align: left;">
      <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 6px;">${p.label}</div>
      <div style="height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden; margin-bottom: 4px;">
        <div style="height: 100%; width: ${scores[p.key]}%; background: ${p.color}; border-radius: 4px; transition: width 1.2s ease 0.5s;"></div>
      </div>
      <div style="font-size: 0.82rem; color: var(--text-muted);">${scores[p.key]}%</div>
    </div>
  `).join('');
}

function viewResults() {
  showLoading('Taking you to your results...');
  setTimeout(() => { window.location.href = 'results.html'; }, 800);
}

function retakeAssessment() {
  // Clear saved data and reload
  localStorage.removeItem('ikigai_assessment');
  window.location.reload();
}

// CSS animation for shake effect
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-6px); }
    80% { transform: translateX(6px); }
  }
`;
document.head.appendChild(style);
