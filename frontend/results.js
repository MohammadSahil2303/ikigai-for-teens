/**
 * ============================================================
 * results.js — Results Page Logic
 *
 * 📚 HOW RESULTS PAGE WORKS:
 * 1. Check localStorage for saved assessment data
 * 2. If found → show personalized results
 * 3. If NOT found → show sample/demo results
 * 4. Render career cards with match scores
 * ============================================================
 */

// ============================================================
// SAMPLE CAREERS (shown when no assessment data exists)
// ============================================================
const SAMPLE_CAREERS = [
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
    matchScore: 92,
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
    matchScore: 85,
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
    matchScore: 78,
    ikigai: { love: 85, good_at: 80, world_needs: 80, paid_for: 85 }
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
    matchScore: 71,
    ikigai: { love: 85, good_at: 70, world_needs: 80, paid_for: 85 }
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
    matchScore: 64,
    ikigai: { love: 90, good_at: 80, world_needs: 70, paid_for: 75 }
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
    matchScore: 55,
    ikigai: { love: 80, good_at: 75, world_needs: 95, paid_for: 65 }
  }
];

const SAMPLE_SCORES = { love: 78, good_at: 72, world_needs: 85, paid_for: 80 };

// ============================================================
// DETAILED ROADMAP DATA — Keyed by career id
// Each phase has a label + array of steps with title + desc
// ============================================================
const DETAILED_ROADMAPS = {
  software_dev: {
    overview: 'Software development is the craft of solving real-world problems with code. You\'ll design, build, test, and ship software used by millions.',
    phases: [
      {
        phase: '🌱 Foundation (Age 13–16)',
        steps: [
          { title: 'Learn the basics of programming', desc: 'Start with Python — it reads like English. Build small projects: a calculator, a quiz game, a to-do list.' },
          { title: 'Understand how the web works', desc: 'Learn HTML & CSS. Build your first webpage. Understand what a browser, server, and URL actually are.' },
          { title: 'Get comfortable with math & logic', desc: 'Focus on algebra, number systems, and logical thinking — the backbone of all programming.' },
        ]
      },
      {
        phase: '🚀 Skill Building (Age 16–18)',
        steps: [
          { title: 'Learn JavaScript and build web apps', desc: 'JavaScript makes websites interactive. Build a weather app, a portfolio website, a simple game.' },
          { title: 'Explore one specialization', desc: 'Choose a path: Web Dev, App Dev, AI/ML, Game Dev, or Cybersecurity. Go deep in one area.' },
          { title: 'Create your GitHub profile', desc: 'Start uploading your projects. Employers & colleges look at your GitHub to see what you\'ve actually built.' },
          { title: 'Contribute to open source', desc: 'Find a beginner-friendly project on GitHub and fix a small bug or write documentation. Real-world experience!' },
        ]
      },
      {
        phase: '🎓 Education & Entry (Age 18–22)',
        steps: [
          { title: 'Pursue B.Tech CS / BCA or self-study', desc: 'A degree opens doors. Alternatively, top bootcamps + strong portfolio can replace degrees at many companies.' },
          { title: 'Build 3–5 substantial projects', desc: 'Create a full-stack app, a machine learning model, or a mobile app. These become your portfolio evidence.' },
          { title: 'Get an internship', desc: 'Apply for summer internships in Year 2. Companies like Infosys, Wipro, and startups actively hire student interns.' },
          { title: 'Clear coding interviews', desc: 'Practice Data Structures & Algorithms on LeetCode/HackerRank. Most big tech interviews test these heavily.' },
        ]
      },
      {
        phase: '💼 Career Launch (Age 22+)',
        steps: [
          { title: 'Land your first job as a junior developer', desc: 'Target product companies, startups, or service companies. Your first job is about learning — not the salary.' },
          { title: 'Level up to mid-level in 2–3 years', desc: 'Take on ownership of features. Mentor juniors. Build deeper expertise in your chosen stack.' },
          { title: 'Explore senior / lead roles or entrepreneurship', desc: 'Lead teams, build architecture, or use your skills to start your own product company.' },
        ]
      }
    ],
    skills: ['Python', 'JavaScript', 'Data Structures', 'Algorithms', 'System Design', 'Git/GitHub', 'Problem Solving'],
    resources: [
      { icon: '📺', text: 'CS50 by Harvard (free on edX) — best intro to CS ever made' },
      { icon: '📖', text: 'The Odin Project — free full-stack web dev curriculum' },
      { icon: '💻', text: 'LeetCode & HackerRank — coding interview prep' },
      { icon: '🎓', text: 'freeCodeCamp.org — free certifications + projects' },
    ]
  },
  data_scientist: {
    overview: 'Data Scientists extract insights from massive datasets to solve real problems — from predicting diseases to personalizing Netflix recommendations.',
    phases: [
      {
        phase: '🌱 Foundation (Age 13–16)',
        steps: [
          { title: 'Fall in love with math and statistics', desc: 'Work hard on algebra, probability, and statistics. These are NOT optional — they are the core of data science.' },
          { title: 'Learn Python basics', desc: 'Python is the #1 language in data science. Start with simple scripts and work up to data manipulation.' },
          { title: 'Explore real datasets', desc: 'Download a public dataset (e.g., Kaggle) and try to answer a question with it. Even messy exploration counts.' },
        ]
      },
      {
        phase: '🚀 Skill Building (Age 16–18)',
        steps: [
          { title: 'Master Python data libraries', desc: 'Learn NumPy, pandas, and Matplotlib. These three tools handle 80% of data work.' },
          { title: 'Learn Machine Learning basics', desc: 'Understand regression, classification, and clustering. Use scikit-learn to build your first ML model.' },
          { title: 'Complete Kaggle competitions', desc: 'Enter beginner Kaggle competitions. Even finishing last teaches you data cleaning, feature engineering, and modeling.' },
        ]
      },
      {
        phase: '🎓 Education & Entry (Age 18–22)',
        steps: [
          { title: 'Pursue B.Tech CS / B.Sc Statistics or Math', desc: 'Strong mathematical foundations give you an edge. Statistics + CS is the ideal combo.' },
          { title: 'Build ML project portfolio', desc: 'Build 3–5 projects: a recommendation system, a sentiment analyzer, an image classifier. Host on GitHub.' },
          { title: 'Learn Deep Learning', desc: 'Study neural networks, TensorFlow or PyTorch. Deep Learning drives modern AI applications.' },
          { title: 'Apply for data analyst/scientist internships', desc: 'Start as a data analyst, gain SQL and business skills, then transition into data science.' },
        ]
      },
      {
        phase: '💼 Career Launch (Age 22+)',
        steps: [
          { title: 'Land a Data Analyst or Junior Data Scientist role', desc: 'Your first role will emphasize SQL, dashboarding (Tableau/Power BI), and reporting.' },
          { title: 'Grow into ML Engineering or Senior Data Science', desc: 'Build and deploy models into production systems. Bridge the gap between research and engineering.' },
          { title: 'Specialize: AI/NLP/Computer Vision/MLOps', desc: 'The deeper you specialize, the more valuable and irreplaceable you become.' },
        ]
      }
    ],
    skills: ['Python', 'Statistics', 'Machine Learning', 'SQL', 'TensorFlow/PyTorch', 'Data Visualization', 'Critical Thinking'],
    resources: [
      { icon: '📺', text: 'fast.ai — Deep Learning for Coders (free, world-class)' },
      { icon: '💻', text: 'Kaggle.com — datasets, competitions, and free notebooks' },
      { icon: '📖', text: 'StatQuest on YouTube — best stats & ML explanations' },
      { icon: '🎓', text: 'Google Machine Learning Crash Course (free)' },
    ]
  },
  ux_designer: {
    overview: 'UX/UI Designers craft the feeling of digital products — from apps to websites. You make technology feel human, simple, and delightful.',
    phases: [
      {
        phase: '🌱 Foundation (Age 13–16)',
        steps: [
          { title: 'Develop your visual eye', desc: 'Analyze apps and websites you love. Ask: why does this feel good? Study color, typography, layout, and spacing.' },
          { title: 'Learn design fundamentals', desc: 'Study color theory, the rule of thirds, whitespace, and visual hierarchy. These are timeless design principles.' },
          { title: 'Start using Canva then Figma', desc: 'Canva for basics. Then graduate to Figma — the industry standard tool for UI design.' },
        ]
      },
      {
        phase: '🚀 Skill Building (Age 16–18)',
        steps: [
          { title: 'Learn UX principles deeply', desc: 'Study user research, personas, user journeys, wireframing, and prototyping. UX is about the human — not just pixels.' },
          { title: 'Redesign apps you use daily', desc: 'Pick Spotify, Swiggy, or Instagram. Redesign one screen and explain WHY your version is better.' },
          { title: 'Build your first case study', desc: 'Document a design project end-to-end: problem → research → wireframes → final UI → user feedback.' },
        ]
      },
      {
        phase: '🎓 Education & Entry (Age 18–22)',
        steps: [
          { title: 'Pursue a design degree or structured bootcamp', desc: 'NID, NIFT, or top design schools. Alternatively, Google UX Design Certificate (Coursera) is well-respected.' },
          { title: 'Build a portfolio with 3–5 case studies', desc: 'Each case study should show: the problem, your process, your decisions, and final results.' },
          { title: 'Learn basic front-end HTML/CSS', desc: 'Designers who can code are 10x more valuable. Understanding code makes you a better communicator with developers.' },
          { title: 'Get freelance design experience', desc: 'Design logos, social media, or a small app for a relative\'s business. Real clients teach you more than school.' },
        ]
      },
      {
        phase: '💼 Career Launch (Age 22+)',
        steps: [
          { title: 'Join a product company as Junior UX Designer', desc: 'Work on a real product team. Learn from senior designers and developers how products actually ship.' },
          { title: 'Build expertise in a design system', desc: 'Contribute to or build a design system. This shows senior-level design thinking and scalability awareness.' },
          { title: 'Grow into Product Design or Design Lead', desc: 'The best designers deeply understand the product, user, and business. That\'s what separates seniors from juniors.' },
        ]
      }
    ],
    skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Typography', 'Color Theory', 'Empathy'],
    resources: [
      { icon: '📺', text: 'Google UX Design Certificate on Coursera' },
      { icon: '💻', text: 'Figma Community — free UI kits and templates to learn from' },
      { icon: '📖', text: 'Nielsen Norman Group — best UX research articles & reports' },
      { icon: '🎓', text: 'Awwwards.com — inspiration from the world\'s best web design' },
    ]
  },
  doctor: {
    overview: 'Medicine is one of the most challenging and most rewarding paths. You\'ll spend years learning, then a lifetime healing people in their most vulnerable moments.',
    phases: [
      {
        phase: '🌱 Foundation (Age 13–16)',
        steps: [
          { title: 'Master Biology and Chemistry', desc: 'These are non-negotiable. Build a deep love for how the human body works — cells, systems, diseases, and cures.' },
          { title: 'Volunteer at a hospital or clinic', desc: 'Shadow a doctor or volunteer. Understand the reality of healthcare before committing to the path.' },
          { title: 'Build emotional resilience', desc: 'Doctors deal with suffering daily. Develop empathy, emotional strength, and the ability to stay calm under pressure.' },
        ]
      },
      {
        phase: '🚀 Exam Preparation (Age 16–18)',
        steps: [
          { title: 'Focus on NEET preparation', desc: 'NEET is India\'s gateway to medical college. Physics, Chemistry, and Biology at the highest level. 2 years of dedicated prep.' },
          { title: 'Study with NCERT as your foundation', desc: 'NEET is 80% NCERT. Master every line of Biology, Physics, and Chemistry NCERTs before anything else.' },
          { title: 'Take mock tests weekly', desc: 'Timed practice is the only way to build exam speed and identify weak areas. Aim for 600+ consistently.' },
        ]
      },
      {
        phase: '🎓 Medical Education (Age 18–23)',
        steps: [
          { title: 'Complete your MBBS (5.5 years)', desc: 'MBBS covers anatomy, physiology, pathology, pharmacology, surgery, and clinical rotations. Deeply challenging and deeply rewarding.' },
          { title: 'Complete 1-year compulsory internship', desc: 'After MBBS, you rotate through every department. This is where you learn to actually be a doctor.' },
          { title: 'Prepare for PG entrance (NEET-PG)', desc: 'To specialize, you must crack NEET-PG. Your MBBS rank and PG entrance determine your specialty.' },
        ]
      },
      {
        phase: '💼 Specialization & Practice (Age 23+)',
        steps: [
          { title: 'Complete MD/MS (3 years)', desc: 'Specialize in your chosen field: Surgery, Cardiology, Paediatrics, Psychiatry, Dermatology, and more.' },
          { title: 'Build your practice or join a hospital', desc: 'Start as a consultant, join a hospital system, or build your own clinic after gaining experience.' },
          { title: 'Never stop learning', desc: 'Medicine evolves constantly. Attend conferences, read journals, and upskill throughout your career.' },
        ]
      }
    ],
    skills: ['Biology', 'Chemistry', 'Empathy', 'Attention to Detail', 'Resilience', 'Clinical Reasoning', 'Communication'],
    resources: [
      { icon: '📺', text: 'Khan Academy Medicine — free, world-class medical education' },
      { icon: '📖', text: 'NCERT Biology Class 11 & 12 — NEET foundation' },
      { icon: '💻', text: 'Marrow / PrepLadder — top NEET-PG preparation apps' },
      { icon: '🎓', text: 'Aakash / Allen — top NEET coaching for foundation building' },
    ]
  },
  psychologist: {
    overview: 'Psychologists and counselors help people understand their minds, manage mental health challenges, and live more fulfilling lives. One of this generation\'s most important careers.',
    phases: [
      {
        phase: '🌱 Foundation (Age 13–16)',
        steps: [
          { title: 'Develop deep empathy and listening skills', desc: 'Practice truly listening to friends and family — not to respond, but to understand. This is the core skill.' },
          { title: 'Read psychology books', desc: 'Start with popular psychology: Thinking Fast & Slow, The Body Keeps the Score, Man\'s Search for Meaning.' },
          { title: 'Study human behavior around you', desc: 'Observe how people react under stress, what motivates them, how group dynamics work. Psychology is everywhere.' },
        ]
      },
      {
        phase: '🚀 Skill Building (Age 16–18)',
        steps: [
          { title: 'Focus on Biology and Social Sciences', desc: 'Psychology sits at the intersection of biology, sociology, and philosophy. Build strength in all three.' },
          { title: 'Volunteer with NGOs in mental health spaces', desc: 'Help at a helpline, a youth center, or a support group. Real human contact is irreplaceable training.' },
          { title: 'Explore different psychology branches', desc: 'Clinical, counseling, sports, organizational, neuropsychology — discover which resonates most with you.' },
        ]
      },
      {
        phase: '🎓 Education (Age 18–24)',
        steps: [
          { title: 'Get a B.Sc or B.A in Psychology', desc: 'Foundation degree builds theory. Choose a college with strong faculty and clinical training opportunities.' },
          { title: 'Complete M.Sc / MA Psychology or M.Phil', desc: 'To practice clinically in India, you need a minimum of Masters. M.Phil (2 years) gives clinical licensure.' },
          { title: 'Complete supervised clinical hours', desc: 'Under a senior psychologist, complete 500+ supervised hours. Required for professional licensure.' },
        ]
      },
      {
        phase: '💼 Practice (Age 24+)',
        steps: [
          { title: 'Get registered with RCI (India)', desc: 'The Rehabilitation Council of India registers clinical psychologists. This is legally required to practice.' },
          { title: 'Build a practice: clinic or online', desc: 'Start seeing clients. Online therapy platforms like YourDOST, Wysa, and iCall are great to build experience.' },
          { title: 'Pursue PhD or specialization', desc: 'Specializing (trauma, addiction, couples, child psychology) dramatically increases your impact and income.' },
        ]
      }
    ],
    skills: ['Active Listening', 'Empathy', 'Report Writing', 'Therapy Techniques', 'Research Methods', 'Patience', 'Ethics'],
    resources: [
      { icon: '📺', text: 'Crash Course Psychology on YouTube — excellent free overview' },
      { icon: '📖', text: 'Man\'s Search for Meaning — Viktor Frankl (must-read)' },
      { icon: '💻', text: 'iResearchNet — psychology research methods and career info' },
      { icon: '🎓', text: 'NIMHANS, Tata Institute of Social Sciences — top Indian programs' },
    ]
  },
  teacher: {
    overview: 'Teaching is the most multiplied profession — every person you shape goes on to impact thousands more. Great teachers transform lives and societies.',
    phases: [
      {
        phase: '🌱 Foundation (Age 13–16)',
        steps: [
          { title: 'Find your subject passion', desc: 'The best teachers are obsessed with their subject. What topic can you talk about for hours without getting bored?' },
          { title: 'Practice explaining things', desc: 'Teach concepts to younger siblings, friends, or through YouTube. The Feynman Technique: teach to truly understand.' },
          { title: 'Study diverse teaching styles', desc: 'Watch great teachers: Richard Feynman, Sal Khan, Michael Stevens (Vsauce). Analyze what makes them powerful.' },
        ]
      },
      {
        phase: '🚀 Skill Building (Age 16–18)',
        steps: [
          { title: 'Tutor younger students', desc: 'Start tutoring in your subject. This builds confidence, teaching ability, and important income.' },
          { title: 'Build communication & public speaking skills', desc: 'Join a debate club, Model UN, or toastmasters. Great teachers are great communicators.' },
          { title: 'Explore EdTech and digital teaching', desc: 'The future of education is hybrid. Learn tools like Google Classroom, Notion, Canva for education.' },
        ]
      },
      {
        phase: '🎓 Education (Age 18–22)',
        steps: [
          { title: 'Pursue your subject Bachelor\'s degree', desc: 'B.Sc Mathematics, B.A History, etc. Deep subject expertise is the #1 quality of great teachers.' },
          { title: 'Complete B.Ed (Bachelor of Education)', desc: 'B.Ed is the professional teaching degree in India. 1–2 years. Teaches pedagogy, curriculum design, and classroom management.' },
          { title: 'Clear CTET/TET for government schools', desc: 'Central/State Teacher Eligibility Test. Required for government school jobs. Very stable career path.' },
        ]
      },
      {
        phase: '💼 Career Launch (Age 22+)',
        steps: [
          { title: 'Teach at a school, college, or coaching center', desc: 'Start building your teaching identity. Find your style, your rhythm, and the kinds of students you connect with most.' },
          { title: 'Build your personal brand as an educator', desc: 'Create YouTube videos or a blog in your subject. The best teachers today reach millions, not just 40 students.' },
          { title: 'Explore EdTech companies or your own venture', desc: 'Companies like BYJU\'S, Unacademy, Vedantu hire teachers. Or build your own online course + community.' },
        ]
      }
    ],
    skills: ['Subject Expertise', 'Communication', 'Patience', 'Creativity', 'Lesson Planning', 'Public Speaking', 'Empathy'],
    resources: [
      { icon: '📺', text: '3Blue1Brown & Khan Academy — watch masters teach' },
      { icon: '📖', text: 'The Courage to Teach — Parker Palmer (transformative book)' },
      { icon: '💻', text: 'Teachable / Thinkific — build your own online course' },
      { icon: '🎓', text: 'Diksha Portal — India\'s national teacher learning platform' },
    ]
  },
  entrepreneur: {
    overview: 'Entrepreneurship is building something from nothing. It\'s the hardest, most uncertain, and potentially most rewarding path. You create jobs, solve problems, and build your own destiny.',
    phases: [
      {
        phase: '🌱 Foundation (Age 13–16)',
        steps: [
          { title: 'Develop a problem-solving mindset', desc: 'Look at everything around you and ask: what\'s broken? What\'s annoying? What could be 10x better? Train this daily.' },
          { title: 'Build something — anything', desc: 'Sell handmade products, offer freelance services, build a small app. The act of selling something is transformative.' },
          { title: 'Read founder stories voraciously', desc: 'Study how entrepreneurs like Zerodha\'s Nithin Kamath, Flipkart\'s Sachin Bansal, or Elon Musk built empires from scratch.' },
        ]
      },
      {
        phase: '🚀 Skill Building (Age 16–18)',
        steps: [
          { title: 'Learn a high-value skill deeply', desc: 'Coding, design, writing, marketing, or sales. Every successful founder has at least one world-class skill.' },
          { title: 'Validate a business idea', desc: 'Don\'t just think of ideas — test them. Survey 20 people. Build a landing page. See if anyone will pay.' },
          { title: 'Study business fundamentals', desc: 'Learn basics of accounting, marketing, product-market fit, and unit economics. You don\'t need an MBA — start now.' },
        ]
      },
      {
        phase: '🎓 Network & Learn (Age 18–22)',
        steps: [
          { title: 'Join startup ecosystems and competitions', desc: 'Attend hackathons, startup competitions, college entrepreneurship cells. Meet co-founders, mentors, investors.' },
          { title: 'Work at a fast-growing startup first', desc: 'Learning from inside a successful startup teaches you more than any MBA. See how a rocket ship is built.' },
          { title: 'Build your MVP (Minimum Viable Product)', desc: 'Don\'t wait for perfection. Build the smallest version that solves the core problem. Get it in front of users fast.' },
        ]
      },
      {
        phase: '💼 Build & Scale (Age 22+)',
        steps: [
          { title: 'Find your first 10 paying customers', desc: 'Not 1000 users — 10 paying customers. This is the hardest and most important milestone of any startup.' },
          { title: 'Seek funding or bootstrap', desc: 'If you need capital: angel investors, accelerators (Y Combinator, Sequoia Surge). If not: bootstrap and stay lean.' },
          { title: 'Build the team and systems to scale', desc: 'Hire people better than you in their domains. Build processes. A company is a machine — design it intentionally.' },
        ]
      }
    ],
    skills: ['Resilience', 'Sales', 'Leadership', 'Product Thinking', 'Financial Literacy', 'Networking', 'Execution'],
    resources: [
      { icon: '📺', text: 'Y Combinator Startup School — free, best in the world' },
      { icon: '📖', text: 'Zero to One — Peter Thiel (essential startup thinking)' },
      { icon: '💻', text: 'Indie Hackers — community of bootstrapping entrepreneurs' },
      { icon: '🎓', text: 'iStartup India — government startup programs and funding' },
    ]
  },
  environmental_scientist: {
    overview: 'Environmental Scientists protect Earth\'s ecosystems. From fighting climate change to preserving biodiversity, this is one of the most urgently important careers of our time.',
    phases: [
      {
        phase: '🌱 Foundation (Age 13–16)',
        steps: [
          { title: 'Develop genuine love for the natural world', desc: 'Spend time in nature. Learn local flora and fauna. Join eco-clubs, plant trees, clean rivers. Passion precedes expertise.' },
          { title: 'Study Biology, Chemistry, and Geography deeply', desc: 'Environmental science draws from all three. Build strong foundations, especially in ecology and chemistry.' },
          { title: 'Follow environmental news and activism', desc: 'Read about climate change, deforestation, pollution policy. Understand the real-world stakes of this field.' },
        ]
      },
      {
        phase: '🚀 Skill Building (Age 16–18)',
        steps: [
          { title: 'Learn data collection and field research', desc: 'Practice measuring soil, water, air quality. Learn to design an experiment and record findings accurately.' },
          { title: 'Connect with environmental NGOs', desc: 'Volunteer with WWF, Greenpeace India, or local environmental groups. Field experience is gold.' },
          { title: 'Learn GIS (Geographic Information Systems)', desc: 'GIS maps environmental data. ArcGIS and QGIS are industry tools. Free tutorials available online.' },
        ]
      },
      {
        phase: '🎓 Education (Age 18–22)',
        steps: [
          { title: 'Pursue B.Sc Environmental Science, Biology, or Chemistry', desc: 'IIT, NIT, or top state universities offer excellent programs. Field trips and lab work are crucial.' },
          { title: 'Complete research projects and publish', desc: 'Work under a professor on a research project. Publication experience opens doors to top Masters programs.' },
          { title: 'Pursue M.Sc and specialize', desc: 'Specializations: climate science, marine biology, wildlife conservation, environmental law, or sustainable engineering.' },
        ]
      },
      {
        phase: '💼 Career Launch (Age 22+)',
        steps: [
          { title: 'Join research institutions, NGOs, or government bodies', desc: 'MoEF (Ministry of Environment), ISRO, CSIR, Wildlife Institute of India — all hire environmental scientists.' },
          { title: 'Work in Environmental Impact Assessment', desc: 'Every large infrastructure project requires EIA. High-demand consulting field with private sector opportunities.' },
          { title: 'Build expertise in policy or research', desc: 'Shape environmental policy at state/national level, or pursue PhD research that informs global decisions.' },
        ]
      }
    ],
    skills: ['Field Research', 'Data Analysis', 'GIS Mapping', 'Report Writing', 'Biology', 'Chemistry', 'Policy Understanding'],
    resources: [
      { icon: '📺', text: 'NASA Climate Kids — free environmental science content' },
      { icon: '📖', text: 'Silent Spring — Rachel Carson (the book that started environmentalism)' },
      { icon: '💻', text: 'QGIS.org — free GIS software + tutorials' },
      { icon: '🎓', text: 'TERI University / Wildlife Institute of India — top Indian programs' },
    ]
  },
  content_creator: {
    overview: 'Content creators build audiences by creating videos, podcasts, written content, or social media that educates, entertains, or inspires. The creator economy is exploding and shows no signs of slowing.',
    phases: [
      {
        phase: '🌱 Foundation (Age 13–16)',
        steps: [
          { title: 'Find your niche and authentic voice', desc: 'What knowledge or perspective do you have that others find valuable? Niche down — don\'t try to be everything to everyone.' },
          { title: 'Start creating — imperfectly', desc: 'Your first 100 pieces of content will be bad. That\'s fine. Every creator you admire has embarrassing early work. Start anyway.' },
          { title: 'Study storytelling and communication', desc: 'Great content is great storytelling. Study how hooks work, how to build tension, how to deliver a satisfying ending.' },
        ]
      },
      {
        phase: '🚀 Skill Building (Age 16–18)',
        steps: [
          { title: 'Learn video editing and thumbnail design', desc: 'DaVinci Resolve (free), CapCut, Premiere Pro. Thumbnails and titles determine 80% of whether people click.' },
          { title: 'Master one platform first', desc: 'YouTube for long-form, Instagram/TikTok for short-form, Twitter/X for text, Substack for writing. Go deep on one.' },
          { title: 'Study YouTube/Social Media analytics', desc: 'Understand CTR, watch time, retention, and engagement. Data tells you what\'s working — listen to it.' },
        ]
      },
      {
        phase: '🎓 Build Your Audience (Age 18–22)',
        steps: [
          { title: 'Post consistently for 1 full year minimum', desc: 'Most creators quit before they ever see results. The ones who succeed do so purely through consistency.' },
          { title: 'Collaborate with other creators', desc: 'Cross-promotion is the fastest organic growth strategy. Make friends in your niche and collaborate authentically.' },
          { title: 'Build an email list from day one', desc: 'Social platforms can shadowban or delete you. Email is yours forever. Build it as your most valuable asset.' },
        ]
      },
      {
        phase: '💼 Monetization (Age 22+)',
        steps: [
          { title: 'Diversify revenue: ads + sponsors + products', desc: 'Ad revenue alone is risky. Add: brand sponsorships, digital products, courses, memberships, or consulting.' },
          { title: 'Build a media company or solo brand', desc: 'The best creators treat their channel as a media company — with strategy, systems, and team.' },
          { title: 'Leverage your audience into other opportunities', desc: 'Book deals, speaking gigs, consulting, investing. A loyal audience is the most valuable asset you can build.' },
        ]
      }
    ],
    skills: ['Video Editing', 'Storytelling', 'SEO', 'Social Media Strategy', 'Thumbnail Design', 'Consistency', 'Analytics'],
    resources: [
      { icon: '📺', text: 'Think Media & Ali Abdaal — YouTube growth strategy' },
      { icon: '📖', text: 'Show Your Work — Austin Kleon (building audiences as a creator)' },
      { icon: '💻', text: 'vidIQ / TubeBuddy — YouTube SEO and analytics tools' },
      { icon: '🎓', text: 'DaVinci Resolve — free professional video editing software' },
    ]
  },
  civil_engineer: {
    overview: 'Civil and Mechanical Engineers design and build the physical world — bridges, roads, buildings, water systems, and machines. Society literally cannot function without them.',
    phases: [
      {
        phase: '🌱 Foundation (Age 13–16)',
        steps: [
          { title: 'Master Mathematics and Physics', desc: 'Engineering is applied math and physics. Work hard on calculus, mechanics, thermodynamics, and vectors.' },
          { title: 'Build things physically', desc: 'Build models, LEGOs, circuits, anything physical. Understanding how things work with your hands is invaluable.' },
          { title: 'Explore engineering around you', desc: 'Look at bridges, buildings, machines. Ask: how was this designed? What forces are acting on it? Engineering is everywhere.' },
        ]
      },
      {
        phase: '🚀 Skill Building (Age 16–18)',
        steps: [
          { title: 'Learn AutoCAD or basic CAD software', desc: 'CAD (Computer-Aided Design) lets you draw engineering designs digitally. Industry-standard skill from day one.' },
          { title: 'Prepare for JEE / engineering entrance exams', desc: 'JEE Main and Advanced are the gateways to IITs and NITs. 2 years of rigorous Physics + Chemistry + Math prep.' },
          { title: 'Join robotics or civil engineering clubs', desc: 'Hands-on project experience: build robots, design bridges, participate in engineering olympiads.' },
        ]
      },
      {
        phase: '🎓 Education (Age 18–22)',
        steps: [
          { title: 'Complete B.Tech Civil or Mechanical Engineering', desc: '4 years of intense study: structural analysis, materials, fluid mechanics, thermodynamics, design.' },
          { title: 'Complete summer internships at construction firms', desc: 'L&T, NHAI, AECOM, and Tata Projects hire engineering interns. Real site experience is irreplaceable.' },
          { title: 'Get licensed: GATE exam for M.Tech or PSU jobs', desc: 'GATE score opens doors to government PSUs (BHEL, ONGC, NHPC) and top M.Tech programs at IITs.' },
        ]
      },
      {
        phase: '💼 Career Launch (Age 22+)',
        steps: [
          { title: 'Join a construction, infra, or manufacturing company', desc: 'Start as a site or design engineer. Get hands-on experience with real projects and real constraints.' },
          { title: 'Pursue chartered engineer status or M.Tech', desc: 'Institution of Engineers certification or M.Tech dramatically increases career progression and salary.' },
          { title: 'Specialize: structural, transportation, environmental, robotics', desc: 'Deep specialization in a subfield makes you highly sought-after for large infrastructure or product companies.' },
        ]
      }
    ],
    skills: ['Mathematics', 'Physics', 'AutoCAD', 'Structural Analysis', 'Project Management', 'Problem Solving', 'Material Science'],
    resources: [
      { icon: '📺', text: 'The Efficient Engineer — YouTube, excellent engineering concepts' },
      { icon: '📖', text: 'Engineering Mechanics — Hibbeler (standard engineering textbook)' },
      { icon: '💻', text: 'Autodesk AutoCAD free for students at autodesk.com' },
      { icon: '🎓', text: 'GATE exam prep: Made Easy / Ace Engineering Academy' },
    ]
  },
  graphic_designer: {
    overview: 'Graphic designers are visual storytellers. They create logos, branding, advertisements, packaging, and digital assets that shape how companies and ideas are perceived.',
    phases: [
      {
        phase: '🌱 Foundation (Age 13–16)',
        steps: [
          { title: 'Study visual design all around you', desc: 'Analyze logos, posters, packaging, websites. Ask: why does this look good? Learn to see what others miss.' },
          { title: 'Start drawing and sketching daily', desc: 'Drawing trains your eye for proportion, form, and composition. Even 10 minutes a day builds powerful visual intuition.' },
          { title: 'Learn Canva first, then Illustrator', desc: 'Canva for beginners. Then move to Adobe Illustrator (industry standard for vectors) and Photoshop for photos.' },
        ]
      },
      {
        phase: '🚀 Skill Building (Age 16–18)',
        steps: [
          { title: 'Study typography, color theory, and layout', desc: 'These are the fundamentals of visual design. Understanding them separates amateurs from professionals.' },
          { title: 'Redesign existing brands as practice', desc: 'Pick a local shop or school. Design a new logo, business card, and social media kit. Then compare to the original.' },
          { title: 'Start taking freelance design work', desc: 'Design social media posts or logos for local businesses. Even ₹500/project builds portfolio and confidence.' },
        ]
      },
      {
        phase: '🎓 Education & Portfolio (Age 18–22)',
        steps: [
          { title: 'Pursue BFA / B.Des or equivalent program', desc: 'NID, NIFT, IDC IIT Bombay are elite. Alternatively, build a portfolio strong enough that no degree is needed.' },
          { title: 'Build a portfolio of 15+ real projects', desc: 'Mix logos, branding, print, digital, and motion. Breadth shows versatility; depth shows expertise.' },
          { title: 'Learn motion graphics basics', desc: 'Adobe After Effects for motion design. Motion is the future of visual design — separate yourself early.' },
        ]
      },
      {
        phase: '💼 Career Launch (Age 22+)',
        steps: [
          { title: 'Join an agency or in-house design team', desc: 'Agency gives variety and faster skill growth. In-house gives depth in one brand. Both are valuable early.' },
          { title: 'Build a specialization: brand identity, packaging, motion', desc: 'Generalists get hired; specialists get chosen. Pick a lane you\'re exceptional at and own it.' },
          { title: 'Build a freelance business on Behance + Dribbble', desc: 'Platforms like Behance, Dribbble, and 99designs connect you to global clients. Build your following.' },
        ]
      }
    ],
    skills: ['Adobe Illustrator', 'Photoshop', 'Typography', 'Color Theory', 'Brand Identity', 'Layout Design', 'Creative Thinking'],
    resources: [
      { icon: '📺', text: 'Satori Graphics (YouTube) — brand identity design tutorials' },
      { icon: '📖', text: 'The Elements of Typographic Style — Robert Bringhurst (design bible)' },
      { icon: '💻', text: 'Behance.net — portfolio hosting + global design inspiration' },
      { icon: '🎓', text: 'Adobe Express free student plan — access to full Adobe suite' },
    ]
  },
  lawyer: {
    overview: 'Lawyers defend rights, resolve disputes, draft laws, advise businesses, and shape society. Law is one of the most intellectually demanding and societally impactful careers available.',
    phases: [
      {
        phase: '🌱 Foundation (Age 13–16)',
        steps: [
          { title: 'Develop strong reading and writing habits', desc: 'Lawyers read thousands of pages and write complex arguments. Build the habit of reading diverse, demanding material daily.' },
          { title: 'Join debate clubs and Model UN', desc: 'Argumentation, negotiation, and public speaking are core lawyer skills. Practice them intensely.' },
          { title: 'Develop curiosity about justice and society', desc: 'Follow court cases, read about landmark Supreme Court judgments (like Kesavananda Bharati or Vishaka guidelines).' },
        ]
      },
      {
        phase: '🚀 Skill Building (Age 16–18)',
        steps: [
          { title: 'Study CLAT (Common Law Admission Test)', desc: 'CLAT is the gateway to top NLUs (National Law Universities). English, reasoning, legal aptitude, and current affairs.' },
          { title: 'Read legal news and landmark judgments', desc: 'Live Law, Bar and Bench, SCO India — follow current legal developments and understand how courts reason.' },
          { title: 'Do moot courts and mock trials', desc: 'Moot courts simulate real court proceedings. Participation in school moot courts is excellent early experience.' },
        ]
      },
      {
        phase: '🎓 Legal Education (Age 18–23)',
        steps: [
          { title: 'Complete BA LLB or equivalent 5-year integrated program', desc: 'NLU Delhi, NLSIU Bangalore, NALSAR Hyderabad are India\'s top law schools. The 5-year program is the primary path.' },
          { title: 'Do internships at law firms and courts every vacation', desc: 'Court internships, corporate law firm internships, NGO legal aid work. Build practical exposure every semester.' },
          { title: 'Participate in moot court competitions nationally', desc: 'Competitions like Jessup Moot, ICC Moot, and SCC Moot build enormous credibility and open doors.' },
        ]
      },
      {
        phase: '💼 Practice (Age 23+)',
        steps: [
          { title: 'Enroll with the Bar Council of India', desc: 'After LLB, enroll with the state Bar Council. This is the legal requirement to practice in India.' },
          { title: 'Join a chamber or law firm as a junior', desc: 'Assist senior advocates in court or join a corporate law firm. Learn from experienced practitioners.' },
          { title: 'Specialize: corporate, criminal, constitutional, IP, family law', desc: 'Specialization massively increases earning potential. Corporate and IP law command premium salaries.' },
        ]
      }
    ],
    skills: ['Argumentation', 'Legal Research', 'Writing', 'Negotiation', 'Critical Thinking', 'Attention to Detail', 'Public Speaking'],
    resources: [
      { icon: '📺', text: 'Law By Mike (YouTube) — engaging breakdown of legal concepts' },
      { icon: '📖', text: 'Introduction to Jurisprudence — Dr. V.D. Mahajan (classic Indian law text)' },
      { icon: '💻', text: 'SCC Online & Manupatra — India\'s leading legal databases' },
      { icon: '🎓', text: 'CLAT Consortium — official CLAT preparation resources' },
    ]
  },
};


// ============================================================
// MAIN INIT — called when page loads
// ============================================================

let allCareers = [];
let currentFilter = 'all';

function initResultsPage() {
  // Try to load real assessment data from localStorage
  const assessmentData = getStorage('ikigai_assessment');

  if (assessmentData && assessmentData.matches) {
    // Real data exists — show personalized results!
    document.getElementById('sampleNotice').style.display = 'none';

    const { userName, matches, scores } = assessmentData;
    allCareers = matches;

    // Update hero text
    document.getElementById('resultName').textContent =
      `Based on your profile, ${userName}...`;
    document.getElementById('resultSubtitle').textContent =
      'Here are your top career matches — ranked by how well they align with your Ikigai';

    // Render Ikigai profile bars
    renderIkigaiBars(scores);

    // Render career cards
    renderCareerCards(matches);

  } else {
    // No data — show sample results
    allCareers = SAMPLE_CAREERS;
    renderIkigaiBars(SAMPLE_SCORES);
    renderCareerCards(SAMPLE_CAREERS);
  }

  // Animate bars after a small delay
  setTimeout(() => {
    document.querySelectorAll('.ikigai-bar-fill').forEach(bar => {
      const target = bar.getAttribute('data-width');
      bar.style.width = target + '%';
    });
  }, 300);
}

// ============================================================
// RENDER IKIGAI PROFILE BARS
// ============================================================

function renderIkigaiBars(scores) {
  const container = document.getElementById('ikigaiBars');
  if (!container) return;

  const pillars = [
    { key: 'love', label: '❤️ Passion', color: 'linear-gradient(90deg, #7c3aed, #ec4899)' },
    { key: 'good_at', label: '💪 Expertise', color: 'linear-gradient(90deg, #ec4899, #f59e0b)' },
    { key: 'world_needs', label: '🌍 Mission', color: 'linear-gradient(90deg, #06b6d4, #10b981)' },
    { key: 'paid_for', label: '💰 Vocation', color: 'linear-gradient(90deg, #10b981, #3b82f6)' },
  ];

  container.innerHTML = pillars.map(p => `
    <div class="ikigai-bar-row">
      <div class="ikigai-bar-label">${p.label}</div>
      <div class="ikigai-bar-track">
        <div class="ikigai-bar-fill" style="width: 0%; background: ${p.color};" data-width="${scores[p.key]}"></div>
      </div>
      <div class="ikigai-bar-pct">${scores[p.key]}%</div>
    </div>
  `).join('');
}

// ============================================================
// RENDER CAREER CARDS
// ============================================================

function renderCareerCards(careers) {
  const grid = document.getElementById('careerGrid');
  if (!grid) return;

  grid.innerHTML = '';

  if (careers.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--text-secondary);">
        <div style="font-size: 3rem; margin-bottom: 16px;">🔍</div>
        <h3>No careers found in this category</h3>
        <p>Try selecting a different filter above.</p>
      </div>
    `;
    return;
  }

  careers.forEach((career, index) => {
    const isTop = index === 0;
    const isGood = career.matchScore >= 60;
    const isExplore = career.matchScore < 60;

    const badgeClass = isTop ? 'badge-top' : isGood ? 'badge-match' : 'badge-explore';
    const badgeLabel = isTop ? '⭐ Top Pick' : isGood ? '✅ Great Match' : '🔭 Worth Exploring';

    const card = document.createElement('div');
    card.className = `career-card ${isTop ? 'top-pick' : ''} reveal`;
    card.style.animationDelay = `${index * 0.08}s`;
    card.setAttribute('data-category', career.category);

    card.innerHTML = `
      <div class="career-badge ${badgeClass}">${badgeLabel}</div>
      
      <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px;">
        <div style="width: 56px; height: 56px; border-radius: 14px; background: ${getCategoryGradient(career.category)}; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; flex-shrink: 0;">
          ${career.emoji}
        </div>
        <div>
          <div class="career-title">${career.title}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">${career.category}</div>
        </div>
      </div>

      <div class="career-desc">${career.desc}</div>

      <div class="career-stats">
        <div class="stat-chip">💰 ${career.salary}</div>
        <div class="stat-chip">📈 ${career.growth}</div>
        <div class="stat-chip">🎓 ${career.education}</div>
      </div>

      <!-- Skills needed -->
      <div style="margin-bottom: 16px;">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Key Skills</div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${career.skills_needed.map(s => `<span style="font-size: 0.78rem; padding: 4px 10px; border-radius: 6px; background: var(--bg-secondary); color: var(--text-secondary);">${s}</span>`).join('')}
        </div>
      </div>

      <!-- Match bar -->
      <div class="match-bar">
        <div class="match-label">
          <span>Your Ikigai Match</span>
          <span style="font-weight: 700; color: var(--accent-violet);">${career.matchScore}%</span>
        </div>
        <div style="height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden;">
          <div class="match-fill" style="width: 0%; background: ${getMatchColor(career.matchScore)};" data-width="${career.matchScore}"></div>
        </div>
      </div>

      <!-- Roadmap hint -->
      <div class="view-roadmap-hint">🗺️ View Full Career Roadmap</div>
    `;

    // Make the whole card clickable → open roadmap modal
    card.addEventListener('click', () => openRoadmapModal(career));

    // ✅ Actually append the card to the grid!
    grid.appendChild(card);
  });

  // Animate match bars after a delay
  setTimeout(() => {
    document.querySelectorAll('.match-fill').forEach(bar => {
      bar.style.width = bar.getAttribute('data-width') + '%';
    });
  }, 400);

  // Re-init scroll reveal for new cards
  if (typeof initScrollReveal === 'function') initScrollReveal();
}

// ============================================================
// FILTER FUNCTIONALITY
// ============================================================

function filterCareers(category, tabEl) {
  currentFilter = category;

  // Update active tab
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');

  // Filter careers
  const filtered = category === 'all'
    ? allCareers
    : allCareers.filter(c => c.category === category);

  renderCareerCards(filtered);
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getCategoryGradient(category) {
  const gradients = {
    technology: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(139,92,246,0.1))',
    creative: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(245,158,11,0.1))',
    healthcare: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.1))',
    business: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(239,68,68,0.1))',
    science: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.1))',
    education: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(16,185,129,0.1))',
    law: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.1))',
  };
  return gradients[category] || gradients.technology;
}

function getMatchColor(score) {
  if (score >= 85) return 'linear-gradient(90deg, #7c3aed, #ec4899)';
  if (score >= 65) return 'linear-gradient(90deg, #10b981, #06b6d4)';
  if (score >= 45) return 'linear-gradient(90deg, #f59e0b, #10b981)';
  return 'linear-gradient(90deg, #6b7280, #9ca3af)';
}

function shareResults() {
  navigator.clipboard?.writeText(window.location.href).then(() => {
    showToast('🔗 Link copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Could not copy link. Try manually copying the URL.', 'error');
  });
}

function downloadResults() {
  // Gather data
  const assessmentData = getStorage('ikigai_assessment');
  const careers = allCareers.length ? allCareers : SAMPLE_CAREERS;
  const scores  = (assessmentData && assessmentData.scores) ? assessmentData.scores : SAMPLE_SCORES;
  const userName = (assessmentData && assessmentData.userName) ? assessmentData.userName : 'Your';
  const dateStr  = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  // Build career rows
  const careerRows = careers.map((c, i) => `
    <div class="pdf-career">
      <div class="pdf-career-header">
        <span class="pdf-career-rank">#${i + 1}</span>
        <span class="pdf-career-emoji">${c.emoji}</span>
        <div>
          <div class="pdf-career-title">${c.title}</div>
          <div class="pdf-career-cat">${c.category.toUpperCase()} &nbsp;|&nbsp; Match: <strong>${c.matchScore}%</strong></div>
        </div>
      </div>
      <p class="pdf-career-desc">${c.desc}</p>
      <div class="pdf-career-stats">
        <span>💰 ${c.salary}</span>
        <span>📈 ${c.growth}</span>
        <span>🎓 ${c.education}</span>
      </div>
      <div class="pdf-skills">
        <strong>Key Skills:</strong> ${c.skills_needed.join(', ')}
      </div>
    </div>
  `).join('');

  // Build score bars (text-based for print)
  const scoreBars = [
    { label: '❤️ Passion',   key: 'love' },
    { label: '💪 Expertise', key: 'good_at' },
    { label: '🌍 Mission',   key: 'world_needs' },
    { label: '💰 Vocation',  key: 'paid_for' },
  ].map(p => `
    <div class="pdf-score-row">
      <span class="pdf-score-label">${p.label}</span>
      <div class="pdf-score-track"><div class="pdf-score-fill" style="width:${scores[p.key]}%"></div></div>
      <span class="pdf-score-pct">${scores[p.key]}%</span>
    </div>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Ikigai Career Report — ${userName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; background: #fff; padding: 32px 40px; }
    h1  { font-size: 26px; color: #7c3aed; margin-bottom: 4px; }
    .subtitle { font-size: 13px; color: #666; margin-bottom: 28px; }
    .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase;
                     letter-spacing: 1.5px; color: #7c3aed; margin: 24px 0 12px; border-bottom: 2px solid #e5d8ff; padding-bottom: 6px; }
    /* Score bars */
    .pdf-score-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
    .pdf-score-label { width: 110px; font-size: 12px; font-weight: 600; flex-shrink: 0; }
    .pdf-score-track { flex: 1; height: 10px; background: #e5e7eb; border-radius: 5px; overflow: hidden; }
    .pdf-score-fill  { height: 100%; background: linear-gradient(90deg, #7c3aed, #ec4899); border-radius: 5px; }
    .pdf-score-pct   { width: 38px; text-align: right; font-size: 12px; font-weight: 700; color: #7c3aed; }
    /* Career cards */
    .pdf-career { border: 1px solid #e5d8ff; border-radius: 12px; padding: 16px 20px; margin-bottom: 16px; background: #faf8ff; page-break-inside: avoid; }
    .pdf-career-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
    .pdf-career-rank { width: 28px; height: 28px; border-radius: 8px; background: #7c3aed; color: #fff;
                       display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; flex-shrink: 0; }
    .pdf-career-emoji { font-size: 22px; }
    .pdf-career-title { font-size: 15px; font-weight: 800; color: #1a1a2e; }
    .pdf-career-cat   { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
    .pdf-career-desc  { font-size: 12px; color: #444; line-height: 1.6; margin-bottom: 10px; }
    .pdf-career-stats { display: flex; gap: 14px; flex-wrap: wrap; font-size: 11px; color: #555; margin-bottom: 8px; }
    .pdf-skills       { font-size: 11px; color: #555; }
    .footer { margin-top: 32px; border-top: 1px solid #e5d8ff; padding-top: 14px; font-size: 11px; color: #999; text-align: center; }
    @media print {
      body { padding: 20px 28px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <h1>🌸 Ikigai for Teens — Career Report</h1>
  <div class="subtitle">Generated for <strong>${userName}</strong> &nbsp;|&nbsp; ${dateStr}</div>

  <div class="section-title">📊 Your Ikigai Profile</div>
  ${scoreBars}

  <div class="section-title">🎯 Your Top Career Matches</div>
  ${careerRows}

  <div class="footer">
    Generated by Ikigai for Teens &nbsp;•&nbsp; ikigai-for-teens.app &nbsp;•&nbsp; ${dateStr}
  </div>

  <script>
    window.onload = function() { window.print(); };
  <\/script>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) {
    showToast('⚠️ Please allow pop-ups to download the PDF.', 'error');
    return;
  }
  win.document.write(html);
  win.document.close();
  showToast('📄 Opening PDF — use Save as PDF in the print dialog!', 'success');
}

// ============================================================
// ROADMAP MODAL
// ============================================================

function openRoadmapModal(career) {
  const overlay = document.getElementById('roadmapOverlay');
  const content = document.getElementById('roadmapContent');
  if (!overlay || !content) return;

  // Get detailed roadmap data (fall back to basic roadmap if not found)
  const detailed = DETAILED_ROADMAPS[career.id];

  const gradient = getCategoryGradient(career.category);

  // Build modal content
  let html = `
    <div class="modal-career-header">
      <div class="modal-career-icon" style="background: ${gradient};">${career.emoji}</div>
      <div>
        <div class="modal-career-title">${career.title}</div>
        <div class="modal-career-category">${career.category}</div>
      </div>
    </div>
  `;

  // Overview
  if (detailed) {
    html += `
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; padding: 18px 20px; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
        ${detailed.overview}
      </div>
    `;
  }

  // Match score bar
  html += `
    <div class="modal-section-title">Your Ikigai Match</div>
    <div style="display: flex; align-items: center; gap: 14px;">
      <div style="flex: 1; height: 10px; background: var(--border-color); border-radius: 5px; overflow: hidden;">
        <div style="height: 100%; width: ${career.matchScore}%; background: ${getMatchColor(career.matchScore)}; border-radius: 5px; transition: width 0.8s ease;"></div>
      </div>
      <div style="font-weight: 800; font-size: 1.1rem; color: var(--accent-violet); min-width: 44px; text-align: right;">${career.matchScore}%</div>
    </div>
  `;

  // Timeline roadmap
  html += `<div class="modal-section-title">📍 Step-by-Step Career Roadmap</div>`;

  if (detailed && detailed.phases) {
    html += `<div class="roadmap-timeline">`;
    detailed.phases.forEach((phase, phaseIdx) => {
      let stepGlobal = phaseIdx > 0
        ? detailed.phases.slice(0, phaseIdx).reduce((acc, p) => acc + p.steps.length, 0)
        : 0;

      html += `<div class="timeline-phase">
        <div class="timeline-dot" style="background: var(--accent-purple);"></div>
        <div class="timeline-phase-label">${phase.phase}</div>`;

      phase.steps.forEach((step, i) => {
        stepGlobal++;
        html += `
          <div class="timeline-step">
            <div class="step-num">${stepGlobal}</div>
            <div class="step-content">
              <div class="step-title">${step.title}</div>
              <div class="step-desc">${step.desc}</div>
            </div>
          </div>
        `;
      });

      html += `</div>`;
    });
    html += `</div>`;

  } else {
    // Fallback to basic roadmap data from the career object
    html += `<div class="roadmap-timeline">`;
    html += `<div class="timeline-phase"><div class="timeline-dot" style="background: var(--accent-purple);"></div>`;
    career.roadmap.forEach((step, i) => {
      html += `
        <div class="timeline-step">
          <div class="step-num">${i + 1}</div>
          <div class="step-content"><div class="step-title">${step}</div></div>
        </div>`;
    });
    html += `</div></div>`;
  }

  // Key Skills
  if (detailed && detailed.skills) {
    html += `
      <div class="modal-section-title">💪 Skills to Develop</div>
      <div class="skill-pills">
        ${detailed.skills.map(s => `<span class="skill-pill">${s}</span>`).join('')}
      </div>
    `;
  }

  // Resources
  if (detailed && detailed.resources) {
    html += `
      <div class="modal-section-title">📚 Learning Resources</div>
      <div class="resource-list">
        ${detailed.resources.map(r => `
          <div class="resource-item">
            <span class="resource-icon">${r.icon}</span>
            <span>${r.text}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // CTA
  html += `
    <div style="margin-top: 28px; display: flex; gap: 10px; flex-wrap: wrap;">
      <a href="assessment.html" class="btn btn-primary" style="flex: 1; min-width: 200px; text-align: center; padding: 14px;">🚀 Retake Assessment</a>
      <button onclick="closeModal()" class="btn btn-secondary" style="flex: 1; min-width: 140px; padding: 14px;">✕ Close</button>
    </div>
  `;

  content.innerHTML = html;

  // Open modal
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeRoadmapModal(event) {
  // If an event passed, only close when clicking the backdrop itself (not modal content)
  if (event && event.target !== document.getElementById('roadmapOverlay')) return;
  const overlay = document.getElementById('roadmapOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Dedicated close button handler (no event arg needed)
function closeModal() {
  const overlay = document.getElementById('roadmapOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('roadmapOverlay');
    if (overlay && overlay.classList.contains('open')) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

// ============================================================
// START
// ============================================================

document.addEventListener('DOMContentLoaded', initResultsPage);

