# ============================================================
# career_logic.py — The "Smart AI" Career Analysis Engine
#
# 📚 LESSON: "Smart Logic" (AI-Like)
#
# This is where the intelligence lives! It maps user answers
# to career recommendations using a scoring system.
#
# This is NOT magic — it's systematic logic + data.
# We don't show users HOW it works; we just show results like:
# "Based on your profile, we recommend..."
#
# The 4 Pillars of our scoring system:
# 1. Interest Match  — Does career align with what they love?
# 2. Skill Match     — Are they naturally suited for it?
# 3. Values Match    — Does it align with their world view?
# 4. Market Score    — Is it a viable, growing career?
# ============================================================

# ──────────────────────────────────────────────────────
# CAREER DATABASE
# Full database of 15 careers with all metadata
# ──────────────────────────────────────────────────────

CAREER_DATABASE = [
    {
        'id': 'software_dev',
        'title': 'Software Developer',
        'emoji': '💻',
        'category': 'technology',
        'desc': 'Design, code, and maintain applications, websites, games, and systems. The backbone of the digital economy.',
        'salary': '₹8–40 LPA (India) / $80k–$160k (Global)',
        'growth': '+25% next decade',
        'education': 'B.Tech CS / Self-taught + Portfolio',
        'skills_needed': ['Problem-solving', 'Logic', 'Persistence', 'Teamwork'],
        'roadmap': [
            'Learn Python or JavaScript (3–6 months)',
            'Build 3 real projects (portfolio)',
            'Contribute to open source',
            'Get internship or freelance clients'
        ],
        # ── Triggers: what answers lead to this career ──
        'triggers': {
            'interest': ['maker'],
            'specific': ['software', 'game_dev'],
            'world_values': ['tech_impact'],
            'skills': ['problem_solving', 'building', 'math'],
            'school': ['stem'],
        },
        # ── Ikigai scores for this career (how well does it satisfy each pillar?) ──
        'ikigai': { 'love': 80, 'good_at': 85, 'world_needs': 90, 'paid_for': 95 },
        # ── Base match weight (market demand) ──
        'base_weight': 15,
    },
    {
        'id': 'data_scientist',
        'title': 'Data Scientist / AI Engineer',
        'emoji': '📊',
        'category': 'technology',
        'desc': 'Extract insights from massive datasets and build AI/ML models that power products used by millions.',
        'salary': '₹10–60 LPA (India) / $100k–$200k (Global)',
        'growth': '+35% next decade',
        'education': 'B.Tech / B.Sc Statistics + Python skills',
        'skills_needed': ['Math', 'Statistics', 'Critical thinking', 'Python/R'],
        'roadmap': [
            'Master statistics and Python',
            'Take ML/AI online courses (Coursera, fast.ai)',
            'Build ML projects on Kaggle',
            'Get data internship or research position'
        ],
        'triggers': {
            'interest': ['analyst'],
            'specific': ['software', 'technical_analyst', 'scientist'],
            'world_values': ['tech_impact'],
            'skills': ['math', 'research', 'problem_solving'],
            'school': ['stem'],
        },
        'ikigai': { 'love': 75, 'good_at': 80, 'world_needs': 95, 'paid_for': 95 },
        'base_weight': 18,
    },
    {
        'id': 'ux_designer',
        'title': 'UX / UI Designer',
        'emoji': '🎨',
        'category': 'creative',
        'desc': 'Design beautiful, intuitive digital experiences. You sit at the intersection of art, psychology, and technology.',
        'salary': '₹6–25 LPA (India) / $70k–$130k (Global)',
        'growth': '+15% next decade',
        'education': 'Design degree or self-taught + Strong Portfolio',
        'skills_needed': ['Empathy', 'Creativity', 'Visual thinking', 'Figma'],
        'roadmap': [
            'Learn Figma (free tool for UI design)',
            'Study UX design principles & psychology',
            'Build 3–5 case study projects',
            'Get feedback and land first client/job'
        ],
        'triggers': {
            'interest': ['creator', 'maker'],
            'specific': ['digital_design', 'software', 'visual_art'],
            'world_values': ['tech_impact', 'art_impact'],
            'skills': ['design', 'empathy', 'problem_solving'],
            'school': ['arts', 'stem'],
        },
        'ikigai': { 'love': 85, 'good_at': 80, 'world_needs': 80, 'paid_for': 85 },
        'base_weight': 14,
    },
    {
        'id': 'doctor',
        'title': 'Medical Doctor / Physician',
        'emoji': '🩺',
        'category': 'healthcare',
        'desc': 'Diagnose and treat illness, prevent disease, and be present for patients in their most vulnerable moments.',
        'salary': '₹8–50 LPA (India) / $200k+ (Global)',
        'growth': '+7% next decade',
        'education': 'MBBS (5.5 years) → MD/MS Specialization',
        'skills_needed': ['Empathy', 'Attention to detail', 'Resilience', 'Science base'],
        'roadmap': [
            'Excel in Biology and Chemistry (Class 11–12)',
            'Prepare for and clear NEET examination',
            'Complete MBBS (5.5 years including internship)',
            'Choose and pursue specialization (MD/MS)'
        ],
        'triggers': {
            'interest': ['helper'],
            'specific': ['medical'],
            'world_values': ['health_impact'],
            'skills': ['empathy', 'research', 'problem_solving'],
            'school': ['science'],
        },
        'ikigai': { 'love': 85, 'good_at': 75, 'world_needs': 95, 'paid_for': 90 },
        'base_weight': 16,
    },
    {
        'id': 'psychologist',
        'title': 'Psychologist / Counselor',
        'emoji': '🧠',
        'category': 'healthcare',
        'desc': 'Help people understand and overcome mental health challenges. One of the most meaningful careers of our generation.',
        'salary': '₹4–20 LPA (India) / $70k–$130k (Global)',
        'growth': '+20% next decade',
        'education': 'B.Sc / B.A Psychology → M.Sc → PhD / License',
        'skills_needed': ['Active listening', 'Empathy', 'Patience', 'Analytical thinking'],
        'roadmap': [
            'Study psychology at undergraduate level',
            'Internship at mental health clinic or NGO',
            'Complete Masters in Clinical/Counseling Psychology',
            'Get licensed/registered as a counselor'
        ],
        'triggers': {
            'interest': ['helper'],
            'specific': ['mental_health'],
            'world_values': ['health_impact', 'edu_impact'],
            'skills': ['empathy', 'research', 'communication'],
            'school': ['humanities', 'science'],
        },
        'ikigai': { 'love': 90, 'good_at': 80, 'world_needs': 85, 'paid_for': 70 },
        'base_weight': 14,
    },
    {
        'id': 'teacher_educator',
        'title': 'Teacher / Educator',
        'emoji': '📚',
        'category': 'education',
        'desc': 'Shape the minds and futures of the next generation. The profession that makes all other professions possible.',
        'salary': '₹3–15 LPA (India) / $45k–$90k (Global)',
        'growth': '+5% next decade',
        'education': "Bachelor's degree in any subject + B.Ed",
        'skills_needed': ['Communication', 'Patience', 'Creativity', 'Subject expertise'],
        'roadmap': [
            'Choose your subject (what are you passionate about?)',
            "Get Bachelor's degree in that subject",
            'Complete B.Ed (Bachelor of Education)',
            'Teaching internship → permanent position'
        ],
        'triggers': {
            'interest': ['helper'],
            'specific': ['teaching'],
            'world_values': ['edu_impact'],
            'skills': ['communication', 'empathy', 'research'],
            'school': ['humanities', 'science', 'arts'],
        },
        'ikigai': { 'love': 90, 'good_at': 85, 'world_needs': 90, 'paid_for': 60 },
        'base_weight': 10,
    },
    {
        'id': 'entrepreneur',
        'title': 'Entrepreneur / Startup Founder',
        'emoji': '🚀',
        'category': 'business',
        'desc': 'Build your own company from scratch. Turn a problem you notice into a product or service that creates value.',
        'salary': 'Unlimited potential — highly variable early on',
        'growth': 'You create your own growth.',
        'education': 'Any field + execution + resilience',
        'skills_needed': ['Resilience', 'Vision', 'Leadership', 'Execution', 'Sales'],
        'roadmap': [
            'Learn a high-value skill deeply (coding, design, marketing)',
            'Identify a real problem people face (interview 50 people)',
            'Build a Minimum Viable Product (MVP)',
            'Get your first 10 paying customers'
        ],
        'triggers': {
            'interest': ['maker', 'analyst'],
            'specific': ['business_analyst', 'software'],
            'world_values': ['biz_impact', 'tech_impact'],
            'skills': ['problem_solving', 'communication', 'organization'],
            'leadership': ['leader'],
            'school': ['stem', 'humanities'],
        },
        'ikigai': { 'love': 85, 'good_at': 70, 'world_needs': 80, 'paid_for': 85 },
        'base_weight': 12,
    },
    {
        'id': 'environmental_scientist',
        'title': 'Environmental Scientist',
        'emoji': '🌱',
        'category': 'science',
        'desc': 'Protect the planet by studying ecosystems, climate patterns, and developing solutions to environmental challenges.',
        'salary': '₹4–15 LPA (India) / $60k–$100k (Global)',
        'growth': '+10% next decade (driven by climate crisis)',
        'education': 'B.Sc Environmental Science / Ecology / Biology',
        'skills_needed': ['Research', 'Data analysis', 'Field work', 'Report writing'],
        'roadmap': [
            'Study Environmental Science, Ecology, or Biology',
            'Intern with an environmental NGO or government agency',
            'Conduct field research and publish findings',
            'Pursue Masters/PhD or move into environmental policy'
        ],
        'triggers': {
            'interest': ['analyst', 'helper'],
            'specific': ['scientist'],
            'world_values': ['env_impact'],
            'skills': ['research', 'problem_solving'],
            'school': ['science'],
        },
        'ikigai': { 'love': 80, 'good_at': 75, 'world_needs': 95, 'paid_for': 65 },
        'base_weight': 10,
    },
    {
        'id': 'content_creator',
        'title': 'Digital Content Creator',
        'emoji': '🎬',
        'category': 'creative',
        'desc': 'Build an audience by creating videos, podcasts, or articles that educate, entertain, or inspire millions.',
        'salary': 'Highly variable — $0 to multi-millions depending on audience',
        'growth': 'Exploding — the creator economy is a $100B+ industry',
        'education': 'No formal degree required — skills + consistency + niche',
        'skills_needed': ['Storytelling', 'Video/writing', 'Consistency', 'Marketing', 'SEO'],
        'roadmap': [
            'Choose a specific niche (what are you passionate about + knowledgeable in?)',
            'Create content consistently for 90 days (one platform first)',
            'Learn video editing / graphic design / SEO tools',
            'Monetize through ads, sponsorships, digital products'
        ],
        'triggers': {
            'interest': ['creator'],
            'specific': ['video', 'writing', 'music'],
            'world_values': ['art_impact', 'edu_impact'],
            'skills': ['communication', 'design', 'empathy'],
            'school': ['arts', 'humanities'],
        },
        'ikigai': { 'love': 90, 'good_at': 80, 'world_needs': 70, 'paid_for': 75 },
        'base_weight': 8,
    },
    {
        'id': 'civil_engineer',
        'title': 'Civil / Mechanical Engineer',
        'emoji': '🏗️',
        'category': 'technology',
        'desc': 'Design and build the physical infrastructure that holds society together — roads, bridges, buildings, machines.',
        'salary': '₹5–30 LPA (India) / $70k–$130k (Global)',
        'growth': '+7% next decade',
        'education': 'B.Tech Civil / Mechanical Engineering (4 years)',
        'skills_needed': ['Math', 'Physics', 'Problem-solving', 'CAD software', 'Attention to detail'],
        'roadmap': [
            'Build strong foundation in Math and Physics',
            'Get B.Tech in Civil or Mechanical Engineering',
            'Intern with construction/manufacturing firm',
            'Get Professional Engineer (PE) license'
        ],
        'triggers': {
            'interest': ['maker', 'analyst'],
            'specific': ['hardware', 'engineering'],
            'world_values': ['env_impact', 'tech_impact'],
            'skills': ['math', 'building', 'problem_solving'],
            'school': ['stem'],
        },
        'ikigai': { 'love': 75, 'good_at': 80, 'world_needs': 90, 'paid_for': 85 },
        'base_weight': 14,
    },
    {
        'id': 'graphic_designer',
        'title': 'Graphic / Visual Designer',
        'emoji': '✏️',
        'category': 'creative',
        'desc': 'Create visual communication — logos, branding, illustrations, packaging. Help businesses and ideas look their best.',
        'salary': '₹3–20 LPA (India) / $45k–$100k (Global)',
        'growth': '+3% next decade',
        'education': 'BFA in Design / Self-taught + Strong Portfolio',
        'skills_needed': ['Visual creativity', 'Adobe Suite / Figma', 'Color theory', 'Typography'],
        'roadmap': [
            'Learn Adobe Illustrator and Photoshop (or free tools like Inkscape)',
            'Study color theory, typography, and design principles',
            'Build a portfolio of 10+ diverse projects',
            'Get freelance clients or apply for design jobs'
        ],
        'triggers': {
            'interest': ['creator'],
            'specific': ['visual_art', 'digital_design'],
            'world_values': ['art_impact', 'biz_impact'],
            'skills': ['design', 'communication'],
            'school': ['arts'],
        },
        'ikigai': { 'love': 90, 'good_at': 85, 'world_needs': 75, 'paid_for': 70 },
        'base_weight': 10,
    },
    {
        'id': 'lawyer',
        'title': 'Lawyer / Legal Advocate',
        'emoji': '⚖️',
        'category': 'law',
        'desc': 'Defend rights, argue cases, shape policy, and help ensure justice and fairness in society.',
        'salary': '₹6–50 LPA (India) / $80k–$200k (Global)',
        'growth': '+4% next decade',
        'education': 'BA LLB / B.Com LLB (5 years integrated)',
        'skills_needed': ['Argumentation', 'Research', 'Writing', 'Confidence', 'Critical thinking'],
        'roadmap': [
            'Build strong foundation in humanities (English, History, Polity)',
            'Clear CLAT / AILET for top law school',
            'Complete BA LLB / B.Com LLB (5 years)',
            'Moot court practice + internships at law firms'
        ],
        'triggers': {
            'interest': ['analyst', 'helper'],
            'specific': ['legal_social', 'social_analyst'],
            'world_values': ['edu_impact', 'health_impact'],
            'skills': ['communication', 'research', 'problem_solving'],
            'school': ['humanities'],
        },
        'ikigai': { 'love': 80, 'good_at': 75, 'world_needs': 90, 'paid_for': 85 },
        'base_weight': 12,
    },
    {
        'id': 'musician',
        'title': 'Musician / Music Producer',
        'emoji': '🎵',
        'category': 'creative',
        'desc': 'Create music that moves people emotionally. Perform, produce, compose, or teach your art form.',
        'salary': 'Very variable — $20k to $millions+ depending on success',
        'growth': 'Digital music streaming is fueling creator growth',
        'education': 'Conservatory degree OR self-taught + Platform presence',
        'skills_needed': ['Musical ear', 'Discipline', 'Creativity', 'Performance skills'],
        'roadmap': [
            'Practice your instrument/voice consistently (1000+ hours)',
            'Study music theory (free on YouTube)',
            'Release music on Spotify / SoundCloud',
            'Book live performances / collaborate with other artists'
        ],
        'triggers': {
            'interest': ['creator'],
            'specific': ['music'],
            'world_values': ['art_impact'],
            'skills': ['design', 'communication'],
            'school': ['arts'],
        },
        'ikigai': { 'love': 95, 'good_at': 80, 'world_needs': 70, 'paid_for': 60 },
        'base_weight': 7,
    },
    {
        'id': 'game_developer',
        'title': 'Game Developer',
        'emoji': '🎮',
        'category': 'technology',
        'desc': 'Build the interactive experiences that millions of people love worldwide. Combines art, code, and storytelling.',
        'salary': '₹5–35 LPA (India) / $60k–$150k (Global)',
        'growth': '+12% next decade (gaming is larger than Hollywood)',
        'education': 'B.Tech CS / Game Design Degree / Self-taught',
        'skills_needed': ['Programming (C++/Unity)', 'Game mechanics design', 'Creativity', 'Teamwork'],
        'roadmap': [
            'Learn Unity or Unreal Engine (both have free versions)',
            'Build and ship small games (even simple ones count!)',
            'Join game jams (48-hour game building competitions)',
            'Build portfolio → apply to game studios or self-publish'
        ],
        'triggers': {
            'interest': ['maker', 'creator'],
            'specific': ['game_dev', 'software'],
            'world_values': ['art_impact', 'tech_impact'],
            'skills': ['problem_solving', 'building', 'design'],
            'school': ['stem', 'arts'],
        },
        'ikigai': { 'love': 90, 'good_at': 80, 'world_needs': 80, 'paid_for': 80 },
        'base_weight': 11,
    },
    {
        'id': 'nurse',
        'title': 'Nurse / Paramedic',
        'emoji': '💉',
        'category': 'healthcare',
        'desc': 'Provide hands-on patient care, coordinate treatments, and be the human face of healthcare every single day.',
        'salary': '₹3–12 LPA (India) / $60k–$120k (Global)',
        'growth': '+9% next decade',
        'education': 'B.Sc Nursing (4 years) / GNM Diploma',
        'skills_needed': ['Empathy', 'Physical stamina', 'Quick thinking', 'Science base'],
        'roadmap': [
            'Clear Class 12 with Biology (PCB)',
            'Get B.Sc Nursing from accredited institution',
            'Complete clinical training and internship',
            'Get nursing license and specialization'
        ],
        'triggers': {
            'interest': ['helper'],
            'specific': ['medical'],
            'world_values': ['health_impact'],
            'skills': ['empathy', 'problem_solving'],
            'school': ['science'],
        },
        'ikigai': { 'love': 85, 'good_at': 80, 'world_needs': 95, 'paid_for': 70 },
        'base_weight': 12,
    },
]


# ──────────────────────────────────────────────────────
# CAREER ANALYSIS ENGINE
# ──────────────────────────────────────────────────────

def analyze_career(user_name: str, user_age: str, answers: dict) -> dict:
    """
    Main function: takes user answers → returns career recommendations.
    
    📚 HOW THE SCORING WORKS:
    Each career gets points based on how well the user's answers match.
    
    Points system:
    - Interest match   = up to 30 points
    - Specific match   = up to 25 points
    - Values match     = up to 20 points
    - Skills match     = up to 20 points
    - Leadership match = up to 10 points
    - Base weight      = market demand bonus
    
    Then we calculate a "Ikigai Score" = how well the career
    satisfies all 4 Ikigai pillars for THIS user.
    """
    
    # Extract key answers
    interest      = answers.get('p1_interest', '')
    school        = answers.get('p1_school', '')
    world_value   = answers.get('p1_world', '')
    specific      = _get_specific_answer(answers)
    skills        = answers.get('p3_skills', []) or []
    leadership    = answers.get('p3_leadership', '')
    income_imp    = int(answers.get('p3_income', 3))
    stability_imp = int(answers.get('p3_stability', 3))
    creativity_imp = int(answers.get('p3_creativity_level', 3))

    # Score each career
    scored_careers = []
    
    for career in CAREER_DATABASE:
        score = _score_career(career, interest, school, world_value,
                               specific, skills, leadership, income_imp)
        
        # Calculate how well this career satisfies user's Ikigai
        ikigai_match = _calc_ikigai_match(career, income_imp, stability_imp, creativity_imp)
        
        scored_careers.append({
            **career,  # Spread all career fields
            'matchScore': min(100, score),
            'ikigaiMatch': ikigai_match,
        })
    
    # Sort by match score (highest first)
    scored_careers.sort(key=lambda c: c['matchScore'], reverse=True)
    
    # Take top 8 careers
    top_careers = scored_careers[:8]
    
    # Calculate user's Ikigai profile scores
    ikigai_scores = _calc_user_ikigai_scores(answers)
    
    # Generate personalized summary message
    summary = _generate_summary(user_name, interest, top_careers[0] if top_careers else None)
    
    return {
        'userName': user_name,
        'userAge': user_age,
        'summary': summary,
        'ikigaiScores': ikigai_scores,
        'careers': top_careers,
        'totalMatched': len([c for c in scored_careers if c['matchScore'] > 30])
    }


def _get_specific_answer(answers: dict) -> str:
    """Extract the specific follow-up answer from any phase 2 question."""
    specific_keys = [
        'p2_maker_type', 'p2_helper_type', 'p2_creator_medium',
        'p2_analyst_domain', 'p2_maker_team'
    ]
    for key in specific_keys:
        if answers.get(key):
            return answers[key]
    return ''


def _score_career(career, interest, school, world_value,
                  specific, skills, leadership, income_importance) -> int:
    """Score a single career based on user answers."""
    score = career.get('base_weight', 10)  # Start with base market demand
    t = career.get('triggers', {})
    
    # ── Interest Match (30 pts) ──
    if interest and interest in t.get('interest', []):
        score += 30
    
    # ── Specific Follow-up Match (25 pts) ──
    if specific and specific in t.get('specific', []):
        score += 25
    
    # ── World Values Match (20 pts) ──
    if world_value and world_value in t.get('world_values', []):
        score += 20
    
    # ── Skills Match (up to 20 pts) ──
    if skills and t.get('skills'):
        matched_skills = [s for s in skills if s in t['skills']]
        score += min(20, len(matched_skills) * 6)
    
    # ── School Subject Match (10 pts) ──
    if school and school in t.get('school', []):
        score += 10
    
    # ── Leadership Match (10 pts) ──
    if leadership and leadership in t.get('leadership', []):
        score += 10
    
    # ── Income Bonus: high income + high income importance = boost ──
    ikigai = career.get('ikigai', {})
    career_paid = ikigai.get('paid_for', 70)
    if income_importance >= 4 and career_paid >= 85:
        score += 8
    
    return score


def _calc_ikigai_match(career, income_imp, stability_imp, creativity_imp) -> dict:
    """
    Calculate how well a career satisfies the user's specific Ikigai preferences.
    
    📚 This personalizes the "ikigai bars" for each user.
    A chef career might have love=85 generally, but if the user
    hates cooking → we'd lower that (this comes from answer matching).
    """
    base = career.get('ikigai', { 'love': 70, 'good_at': 70, 'world_needs': 70, 'paid_for': 70 })
    
    # Adjust "paid_for" based on how much they care about income
    paid_adjustment = (income_imp - 3) * 3  # -6 to +6
    adjusted_paid = min(100, max(0, base['paid_for'] + paid_adjustment))
    
    return {
        'love': base['love'],
        'good_at': base['good_at'],
        'world_needs': base['world_needs'],
        'paid_for': adjusted_paid
    }


def _calc_user_ikigai_scores(answers: dict) -> dict:
    """
    Calculate the user's personal Ikigai profile scores.
    These show how developed each Ikigai pillar is for this user.
    """
    scores = { 'love': 50, 'good_at': 50, 'world_needs': 50, 'paid_for': 50 }
    
    # ── LOVE score: based on having clear interests ──
    if answers.get('p1_interest'):
        scores['love'] += 20
    if answers.get('p2_creator_medium') or answers.get('p2_maker_type') or answers.get('p2_helper_type'):
        scores['love'] += 15
    try:
        creativity = int(answers.get('p3_creativity_level', 3))
        scores['love'] += (creativity - 3) * 7
    except: pass
    
    # ── GOOD AT score: based on skills selected ──
    skills = answers.get('p3_skills', [])
    if isinstance(skills, list):
        scores['good_at'] += len(skills) * 5
    
    # ── WORLD NEEDS score: based on having clear values ──
    if answers.get('p1_world'):
        scores['world_needs'] += 25
        impact_vals = ['health_impact', 'env_impact', 'edu_impact']
        if answers.get('p1_world') in impact_vals:
            scores['world_needs'] += 10
    
    # ── PAID FOR score: based on financial preferences ──
    try:
        income = int(answers.get('p3_income', 3))
        scores['paid_for'] += (income - 1) * 8
    except: pass
    
    try:
        stability = int(answers.get('p3_stability', 3))
        scores['paid_for'] += (stability - 3) * 5
    except: pass
    
    # Clamp all to 0-100
    for key in scores:
        scores[key] = min(100, max(0, round(scores[key])))
    
    return scores


def _generate_summary(user_name: str, interest: str, top_career) -> str:
    """
    Generate a personalized summary message.
    📚 Note: We say "Based on your profile..." not "Our AI said..."
    This sounds more personal and trustworthy.
    """
    
    interest_phrases = {
        'maker': 'someone who loves building and creating systems',
        'helper': 'someone deeply motivated to help and support others',
        'creator': 'a naturally creative and expressive individual',
        'analyst': 'someone who thinks deeply and loves solving complex problems',
    }
    
    interest_desc = interest_phrases.get(interest, 'a unique individual with diverse interests')
    
    if top_career:
        career_title = top_career['title']
        match_score = top_career['matchScore']
        return (
            f"Based on your profile, {user_name}, you appear to be {interest_desc}. "
            f"Your answers reveal a strong alignment with careers in the "
            f"{top_career['category']} space. "
            f"Your top recommendation — {career_title} — scored {match_score}% "
            f"match with your unique Ikigai profile."
        )
    
    return (
        f"Based on your profile, {user_name}, you have a unique combination "
        f"of interests and values. Here are the career paths that best match your Ikigai."
    )


def get_career_resources(career_id: str) -> dict:
    """Get detailed resources for a specific career."""
    career = next((c for c in CAREER_DATABASE if c['id'] == career_id), None)
    if not career:
        return {'error': 'Career not found'}
    
    return {
        'career': career,
        'resources': {
            'courses': [
                'Coursera — Free audit courses',
                'Khan Academy — Free fundamentals',
                'YouTube — Thousands of free tutorials',
            ],
            'next_steps': career.get('roadmap', [])
        }
    }
