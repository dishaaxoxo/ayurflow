import os
import json
import hashlib
import requests
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'ayurflow_secret_key'

# Allow requests from Vite dev server and production builds
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:4173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]}})

# --- GEMINI AI CONFIG ---
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

TRANSLATE = {
    'Madhura': 'Sweet', 'Amla': 'Sour', 'Lavana': 'Salty', 'Katu': 'Pungent',
    'Tikta': 'Bitter', 'Kashaya': 'Astringent', 'Laghu': 'Light', 'Guru': 'Heavy',
    'Snigdha': 'Oily / Unctuous', 'Ruksha': 'Dry', 'Sara': 'Flowing / Mobile',
    'Tikshna': 'Sharp / Penetrating', 'Manda': 'Slow / Dull', 'Sthira': 'Stable',
    'Mridu': 'Soft', 'Kathina': 'Hard', 'Vishada': 'Clear', 'Picchila': 'Slimy / Sticky',
    'Sukshma': 'Subtle', 'Sthula': 'Gross / Bulky', 'Sandra': 'Dense', 'Drava': 'Liquid',
    'Ushna': 'Hot (Heating)', 'Sheeta': 'Cold (Cooling)', 'Vata': 'Vata (Air & Space)',
    'Pitta': 'Pitta (Fire & Water)', 'Kapha': 'Kapha (Earth & Water)',
    'tridosha': 'Tridosha (All three)',
    'rasayan': 'Rejuvenating', 'rasayana': 'Rejuvenating',
    'Rasayan': 'Rejuvenating', 'Rasayana': 'Rejuvenating',
    'Krimighna': 'Anti-parasitic', 'Kasahara': 'Relieves Cough',
    'Shoolaghna': 'Relieves Pain', 'Shoolahara': 'Relieves Pain',
    'Chakshushya': 'Improves Eyesight', 'Hridaya': 'Heart Tonic',
    'Hridya': 'Heart Tonic', 'Hrudya': 'Heart Tonic',
    'Deepana': 'Stimulates Appetite', 'Agnideepana': 'Kindles Digestive Fire',
    'Medhya': 'Brain / Memory Tonic', 'Vrishya': 'Aphrodisiac',
    'Balya': 'Strength Builder', 'Jwaraghna': 'Reduces Fever', 'Jwarahara': 'Reduces Fever',
    'Raktashodhak': 'Blood Purifier', 'Raktashodhaka': 'Blood Purifier',
    'Raktaprasadana': 'Blood Purifier', 'Raktavardhak': 'Increases Blood Count',
    'Raktastambhaka': 'Stops Bleeding', 'Raktastambhana': 'Stops Bleeding',
    'Raktapittaghna': 'Heals Bleeding Disorders', 'Shothahara': 'Anti-inflammatory',
    'Stanyashodhana': 'Purifies Breast Milk', 'Stanyajanana': 'Promotes Lactation',
    'Shukrala': 'Improves Fertility', 'Varnya': 'Improves Complexion',
    'Pachana': 'Aids Digestion', 'Amapachana': 'Detoxifies / Clears Toxins',
    'Grahi': 'Absorbent (Firms Stool)', 'Virechana': 'Laxative / Purgative',
    'Mutrala': 'Diuretic (Promotes Urine)', 'Lekhana': 'Fat Scraping / Slimming',
    'Kushtaghna': 'Heals Skin Diseases', 'Shwasahara': 'Relieves Asthma / Breathlessness',
    'Pittaghna': 'Reduces Pitta', 'Medohara': 'Reduces Fat / Anti-obesity',
    'Vatanulomana': 'Relieves Gas / Bloating', 'Vatahara': 'Pacifies Vata',
    'Kaphahara': 'Pacifies Kapha', 'Brimhaniya': 'Nourishing / Weight Promoting',
    'Granthihara': 'Reduces Glandular Swelling', 'Stambhana': 'Binding / Stops Flow',
    'Vishaghna': 'Antidote / Anti-poison', 'Vranaropana': 'Wound Healer',
    'Vranashodhak': 'Wound Cleanser', 'Dantya': 'Strengthens Teeth & Gums',
    'Yonishodhana': 'Uterine Cleanser', 'Yonirogahara': 'Heals Uterine Disorders',
    'Yakrituttejaka': 'Liver Stimulant', 'Yakritottejaka': 'Liver Stimulant',
    'Arshoghna': 'Heals Piles / Hemorrhoids', 'Dahashamana': 'Reduces Burning Sensation',
    'Asthisandhanakara': 'Promotes Bone Healing',
}

AGE_LABELS = {
    'child':  {'label': '👶 0–12 yr', 'full': 'Children (0–12)'},
    'teen':   {'label': '🧑 13–19',   'full': 'Teens (13–19)'},
    'adult':  {'label': '💪 20–39',   'full': 'Adults (20–39)'},
    'middle': {'label': '🧘 40–59',   'full': 'Middle Age (40–59)'},
    'senior': {'label': '🌅 60+',     'full': 'Seniors (60+)'},
}

AGE_RULES = {
    'child':  {'prabhav': ['Kasahara','Shwasahara','Krimighna','Medhya','Chakshushya','Jwaraghna','Jwarahara'], 'rasa': ['Madhura'], 'guna': ['Laghu','Snigdha'], 'virya': ['Sheeta'], 'excludeProhav': ['Virechana','Lekhana','Vrishya','Shukrala','Yonishodhana','Yonirogahara']},
    'teen':   {'prabhav': ['Medhya','Balya','Varnya','Chakshushya','rasayan','rasayana','Rasayan','Rasayana','Brimhaniya'], 'rasa': ['Madhura','Tikta'], 'guna': [], 'virya': [], 'excludeProhav': ['Virechana','Yonishodhana','Stanyajanana','Stanyashodhana']},
    'adult':  {'prabhav': ['Balya','Vrishya','rasayan','rasayana','Rasayan','Rasayana','Shukrala','Hridaya','Hridya','Hrudya','Deepana','Pachana','Stanyajanana','Stanyashodhana','Yonishodhana','Yonirogahara'], 'rasa': [], 'guna': ['Guru','Snigdha'], 'virya': [], 'excludeProhav': []},
    'middle': {'prabhav': ['Shothahara','Medohara','Lekhana','Deepana','Pachana','Yakrituttejaka','Yakritottejaka','Shoolaghna','Shoolahara','Granthihara','Arshoghna','Raktashodhak','Raktashodhaka','Raktaprasadana','Mutrala','Vatahara','Vatanulomana'], 'rasa': ['Tikta','Kashaya'], 'guna': ['Laghu','Ruksha'], 'virya': [], 'excludeProhav': []},
    'senior': {'prabhav': ['rasayan','rasayana','Rasayan','Rasayana','Balya','Brimhaniya','Asthisandhanakara','Medhya','Hridaya','Hridya','Hrudya','Vrishya'], 'rasa': ['Madhura'], 'guna': ['Snigdha','Guru'], 'virya': ['Sheeta'], 'excludeProhav': ['Virechana']},
}

DATA_URL = 'https://raw.githubusercontent.com/sciencewithsaucee-sudo/herb-database/main/herb.json'
_herbs_cache = []


def fetch_herbs():
    global _herbs_cache
    if not _herbs_cache:
        try:
            res = requests.get(DATA_URL, timeout=10)
            if res.status_code == 200:
                data = res.json()
                for herb in data:
                    h = int(hashlib.md5(herb['name'].encode('utf-8')).hexdigest(), 16)
                    herb['price'] = f"{5.0 + (h % 3000) / 100.0:.2f}"
                    herb['age_groups'] = get_best_age_groups(herb)
                _herbs_cache = data
        except Exception as e:
            print("Failed to fetch herb data:", e)
    return _herbs_cache


def age_score(herb, age_key):
    rules = AGE_RULES.get(age_key)
    if not rules: return 0
    score = 0
    p_list = [p.lower() for p in herb.get('prabhav', [])]
    for ex in rules.get('excludeProhav', []):
        if ex.lower() in p_list: return -10
    for p in rules.get('prabhav', []):
        if p.lower() in p_list: score += 3
    for r in rules.get('rasa', []):
        if any(hr.lower() == r.lower() for hr in herb.get('rasa', [])): score += 1
    for g in rules.get('guna', []):
        if any(hg.lower() == g.lower() for hg in herb.get('guna', [])): score += 1
    virya = herb.get('virya', '').lower()
    for v in rules.get('virya', []):
        if virya == v.lower(): score += 1
    return score


def get_best_age_groups(herb):
    scores = {key: age_score(herb, key) for key in AGE_RULES.keys()}
    max_s = max(scores.values()) if scores else 0
    if max_s <= 0: return list(AGE_RULES.keys())
    return [k for k, v in scores.items() if v >= max_s - 2 and v > 0]


def simple_keyword_recommend(symptoms, herbs):
    tokens = [t.lower() for t in symptoms.split() if len(t) > 2]
    results = []
    for h in herbs:
        score = 0
        text = (h['name'] + " " + h.get('preview', '') + " " + " ".join(h.get('prabhav', []))).lower()
        for t in tokens:
            if t in text: score += 1
        if score > 0:
            results.append({'herb': h, 'reasoning': "Matches keywords for your symptoms."})
    results.sort(key=lambda x: len([t for t in tokens if t in x['herb'].get('preview', '').lower()]), reverse=True)
    return results[:3]


@app.route('/api/metadata')
def get_metadata():
    return jsonify({'translate': TRANSLATE, 'age_labels': AGE_LABELS})


@app.route('/api/herbs', methods=['GET'])
def get_herbs():
    herbs = fetch_herbs()
    query        = request.args.get('search', '').lower().strip()
    active_dosha = request.args.get('dosha', 'all')
    active_age   = request.args.get('age', 'all')
    filtered = herbs
    if active_dosha == 'tridosha':
        filtered = [h for h in filtered if h.get('tridosha')]
    elif active_dosha != 'all':
        filtered = [h for h in filtered if active_dosha.lower() in [d.lower() for d in h.get('pacify', [])]]
    if active_age != 'all':
        filtered = [h for h in filtered if active_age in h.get('age_groups', [])]
    if query:
        filtered = [
            h for h in filtered
            if query in h['name'].lower()
            or query in h.get('preview', '').lower()
            or any(query in TRANSLATE.get(t, t).lower()
                   for t in h.get('rasa', []) + h.get('guna', []) + h.get('prabhav', [])
                   + [h.get('virya', ''), h.get('vipaka', '')])
        ]
    return jsonify(filtered)


@app.route('/api/recommend', methods=['POST'])
def recommend():
    data     = request.get_json() or {}
    symptoms = data.get('symptoms', '').strip()
    if not symptoms:
        return jsonify({'error': 'No symptoms provided'}), 400
    herbs = fetch_herbs()
    if model and GEMINI_API_KEY:
        try:
            context = [{"name": h['name'], "props": h.get('prabhav', []), "desc": h.get('preview', '')} for h in herbs[:15]]
            prompt = f"""You are an Ayurvedic Expert Doctor. Patient symptoms: "{symptoms}"
Available Herbs: {json.dumps(context)}
Recommend the top 3 best matching herbs.
Respond ONLY with a valid JSON array, no markdown, no extra text:
[{{"name": "...", "reasoning": "..."}}, ...]"""
            response = model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith('```'):
                text = text.split('```')[1]
                if text.startswith('json'): text = text[4:]
            start, end = text.find('['), text.rfind(']') + 1
            if start != -1:
                ai_data = json.loads(text[start:end])
                results = []
                for item in ai_data:
                    herb_obj = next((h for h in herbs if h['name'].lower() == item['name'].lower()), None)
                    if herb_obj: results.append({'herb': herb_obj, 'reasoning': item['reasoning']})
                if results: return jsonify(results)
        except Exception as e:
            print("Gemini AI Error:", e)
    return jsonify(simple_keyword_recommend(symptoms, herbs))


@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'ai_enabled': bool(GEMINI_API_KEY)})


if __name__ == '__main__':
    print("\n🌿 AyurFlow Backend → http://localhost:5000")
    print(f"   Gemini AI: {'✅ Enabled' if GEMINI_API_KEY else '⚠️  Disabled (set GEMINI_API_KEY to enable)'}\n")
   app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
