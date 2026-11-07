/**
 * Bengali to English (Banglish) Name Transliteration Utility
 * Specifically optimized for Bangladeshi personal names, honorifics, and titles.
 *
 * Example:
 * "মেহেদী হাসান" -> "Mehedi Hasan"
 * "মোঃ রফিকুল ইসলাম" -> "Md. Rafiqul Islam"
 * "রাবেয়া খাতুন" -> "Rabeya Khatun"
 */

// Common Bangladeshi name token dictionary (curated for high accuracy)
const BENGALI_NAME_MAP = {
  // Titles / Honorifics / Prefixes
  'মোঃ': 'Md.',
  'মো:': 'Md.',
  'মো': 'Md.',
  'মুহাম্মদ': 'Muhammad',
  'মোহাম্মদ': 'Mohammad',
  'মুহাঃ': 'Md.',
  'মোসাঃ': 'Mst.',
  'মোসা:': 'Mst.',
  'মোসাম্মৎ': 'Mosammat',
  'মোছাঃ': 'Mst.',
  'বেগম': 'Begum',
  'খাতুন': 'Khatun',
  'খানম': 'Khanam',
  'আক্তার': 'Akter',
  'আকতার': 'Akter',
  'বানু': 'Banu',
  'নেসা': 'Nesa',
  'শেখ': 'Sheikh',
  'কাজী': 'Kazi',
  'সৈয়দ': 'Syed',
  'সৈয়দা': 'Syeda',
  'খন্দকার': 'Khondokar',
  'খোন্দকার': 'Khondokar',
  'চৌধুরী': 'Chowdhury',
  'চৌধুরি': 'Chowdhury',
  'ভূঁইয়া': 'Bhuiyan',
  'ভুঁইয়া': 'Bhuiyan',
  'ভূইয়া': 'Bhuiyan',
  'মিয়া': 'Mia',
  'মিয়াঁ': 'Mia',
  'মোল্লা': 'Molla',
  'মজুমদার': 'Majumder',
  'তালুকদার': 'Talukder',
  'সরকার': 'Sarker',
  'হাজী': 'Haji',
  'হাফেজ': 'Hafez',
  'মাওলানা': 'Mawlana',
  'ডাক্তার': 'Dr.',

  // Common First & Middle Names (Male & Female)
  'মেহেদী': 'Mehedi',
  'হাসান': 'Hasan',
  'হোসেন': 'Hossain',
  'হোসাইন': 'Hossain',
  'রফিকুল': 'Rafiqul',
  'রফিক': 'Rafiq',
  'শফিকুল': 'Shafiqul',
  'শফিক': 'Shafiq',
  'ইসলাম': 'Islam',
  'রাবেয়া': 'Rabeya',
  'ফাতেমা': 'Fatema',
  'ফাতিমা': 'Fatima',
  'সুলতানা': 'Sultana',
  'রহমান': 'Rahman',
  'রহিম': 'Rahim',
  'করিম': 'Karim',
  'আব্দুল': 'Abdul',
  'আব্দুর': 'Abdur',
  'আহমেদ': 'Ahmed',
  'আহমদ': 'Ahmed',
  'আলী': 'Ali',
  'আলি': 'Ali',
  'খান': 'Khan',
  'আলম': 'Alam',
  'জাহান': 'Jahan',
  'নাসরিন': 'Nasrin',
  'শাহীন': 'Shahin',
  'শাহিন': 'Shahin',
  'তাহমিনা': 'Tahmina',
  'পারভীন': 'Parvin',
  'শাহনাজ': 'Shahnaz',
  'নুসরাত': 'Nusrat',
  'কামরুল': 'Kamrul',
  'তারেক': 'Tarek',
  'মোস্তফা': 'Mostafa',
  'মুস্তফা': 'Mustafa',
  'মাহমুদ': 'Mahmud',
  'মাহবুব': 'Mahbub',
  'সাইফুল': 'Saiful',
  'আরিফ': 'Arif',
  'আরিফুল': 'Ariful',
  'ইমরান': 'Imran',
  'সাকিব': 'Sakib',
  'রুবেল': 'Rubel',
  'শামীম': 'Shamim',
  'শিরিন': 'Shirin',
  'শিরীন': 'Shireen',
  'রোকসানা': 'Roksana',
  'সালমা': 'Salma',
  'লায়লা': 'Laila',
  'লতিফ': 'Latif',
  'জালাল': 'Jalal',
  'বকর': 'Bakar',
  'সিদ্দিক': 'Siddique',
  'সিদ্দিকী': 'Siddique',
  'হক': 'Haque',
  'হাশেম': 'Hashem',
  'আবুল': 'Abul',
  'কাশেম': 'Kashem',
  'হারুন': 'Harun',
  'রশিদ': 'Rashid',
  'জাহাঙ্গীর': 'Jahangir',
  'ফারুক': 'Faruk',
  'ফারহানা': 'Farhana',
  'নাজমুল': 'Nazmul',
  'তানভীর': 'Tanvir',
  'মনির': 'Monir',
  'মনিরুল': 'Monirul',
  'শাহাদাত': 'Shahadat',
  'জাহিদুল': 'Zahidul',
  'জাহিদ': 'Zahid',
  'খালেক': 'Khalek',
  'তৌফিক': 'Towfiq',
  'মিজানুর': 'Mizanur',
  'মিজান': 'Mizan',
  'বিল্লাহ': 'Billah',
  'হোসনে': 'Hosne',
  'আরা': 'Ara',
  'শরীফ': 'Sharif',
  'শরীফুল': 'Shariful',
  'আজাদ': 'Azad',
  'মুনীর': 'Munir',
  'সোহাগ': 'Sohag',
  'সুমন': 'Sumon',
  'সোহেল': 'Sohel',
  'অরুণ': 'Arun',
  'অনিল': 'Anil',
  'অমিত': 'Amit',
  'শুভ': 'Shuvo',
  'সুজন': 'Sujon',
  'মিলন': 'Milon',
  'স্বপন': 'Swapon',
  'খোকন': 'Khokon',
  'বাবুল': 'Babul',
  'সবুজ': 'Sobuj',
  'লিটন': 'Liton',
  'রিপন': 'Ripon',
  'রতন': 'Ratan',
  'মানিক': 'Manik',
  'জসিম': 'Jashim',
  'নজরুল': 'Nazrul',
  'খন্দকার': 'Khondokar',
  'প্রামাণিক': 'Pramanik',
  'মুন্না': 'Munna',
  'শাওন': 'Shaon',
  'আসিফ': 'Asif',
  'আমান': 'Aman',
  'তারিকুল': 'Tariqul',
  'খায়রুল': 'Khairul',
  'নুর': 'Nur',
  'নূর': 'Noor',
  'নবী': 'Nabi',
  'হেলাল': 'Helal',
  'বেলাল': 'Belal',
  'দেলোয়ার': 'Delwar',
  'আনোয়ার': 'Anwar',
  'আনোয়ারা': 'Anwara',
  'সেলিম': 'Selim',
  'শাহজাহান': 'Shahjahan',
  'আমির': 'Amir',
  'গোলাম': 'Golam',
  'মোফাজ্জল': 'Mofazzal',
  'মোকাররম': 'Mokarram',
  'মুরাদ': 'Murad',
  'মুত্তাকী': 'Muttaki',
  'সায়েম': 'Sayem',
  'শামীমা': 'Shamima',
  'শাবানা': 'Shabana',
  'মমতা': 'Momtaz',
  'মমতাজ': 'Momtaz',
  'রাশেদ': 'Rashed',
  'রাশেদা': 'Rasheda',
  'রোকেয়া': 'Rokeya',
  'রেহানা': 'Rehana',
  'ফারিয়া': 'Faria',
  'সাদিয়া': 'Sadia',
  'সানজিদা': 'Sanjida',
  'নাদিয়া': 'Nadia',
  'শারমিন': 'Sharmin',
  'মৌসুমী': 'Moushumi',
  'মনি': 'Moni',
  'রেনু': 'Renu',
  'কাজল': 'Kajol',
  'মালা': 'Mala',
  'লিপি': 'Lipi',
  'রুপা': 'Rupa',
  'সুমি': 'Sumi',
  'রুমা': 'Ruma',
  'পলি': 'Poli',
  'ঝর্ণা': 'Jhorna',
  'স্বপ্না': 'Swapna',
  'শিউলি': 'Shiuli',

  // Hindu / Other Common Surnames
  'দাস': 'Das',
  'রায়': 'Roy',
  'ঘোষ': 'Ghosh',
  'সেন': 'Sen',
  'গুপ্ত': 'Gupta',
  'দে': 'Dey',
  'বর্মন': 'Barman',
  'সাহা': 'Saha',
  'শীল': 'Sheel',
  'পাল': 'Paul',
  'বিশ্বাস': 'Biswas',
  'অধিকারী': 'Adhikari',
  'মণ্ডল': 'Mondal',
  'মন্ডল': 'Mondal',
  'ভট্টাচার্য': 'Bhattacharya',
  'চক্রবর্তী': 'Chakraborty',
  'ব্যানার্জী': 'Banerjee',
  'মুখার্জী': 'Mukherjee',
  'চ্যাটার্জী': 'Chatterjee',
};

// Bengali Vowel mappings
const VOWELS = {
  'অ': 'o',
  'আ': 'a',
  'ই': 'i',
  'ঈ': 'i',
  'উ': 'u',
  'ঊ': 'u',
  'ঋ': 'ri',
  'এ': 'e',
  'ঐ': 'oi',
  'ও': 'o',
  'ঔ': 'ou',
};

// Bengali Vowel Signs (কার)
const VOWEL_SIGNS = {
  'া': 'a',
  'ি': 'i',
  'ী': 'i',
  'ু': 'u',
  'ূ': 'u',
  'ৃ': 'ri',
  'ে': 'e',
  'ৈ': 'oi',
  'ো': 'o',
  'ৌ': 'ou',
};

// Bengali Consonants
const CONSONANTS = {
  'ক': 'k',
  'খ': 'kh',
  'গ': 'g',
  'ঘ': 'gh',
  'ঙ': 'ng',
  'চ': 'ch',
  'ছ': 'chh',
  'জ': 'j',
  'ঝ': 'jh',
  'ঞ': 'n',
  'ট': 't',
  'ঠ': 'th',
  'ড': 'd',
  'ঢ': 'dh',
  'ণ': 'n',
  'ত': 't',
  'থ': 'th',
  'দ': 'd',
  'ধ': 'dh',
  'ন': 'n',
  'প': 'p',
  'ফ': 'f',
  'ব': 'b',
  'ভ': 'bh',
  'ম': 'm',
  'য': 'z',
  'র': 'r',
  'ল': 'l',
  'শ': 'sh',
  'ষ': 'sh',
  'স': 's',
  'হ': 'h',
  'ড়': 'r',
  'ঢ়': 'rh',
  'য়': 'y',
  'ৎ': 't',
  'ং': 'ng',
  'ঃ': '',
  'ঁ': '',
};

/**
 * Transliterates a single Bengali word/token
 */
function transliterateWord(token) {
  if (!token) return '';
  const clean = token.trim();

  // 1. Exact dictionary match
  if (BENGALI_NAME_MAP[clean]) {
    return BENGALI_NAME_MAP[clean];
  }

  // 2. Trailing punctuation check (e.g. মোঃ or নাম,)
  const punctuationMatch = clean.match(/^([^\s.,:;।]+)([.,:;।]*)$/);
  if (punctuationMatch) {
    const base = punctuationMatch[1];
    const punct = punctuationMatch[2];
    if (BENGALI_NAME_MAP[base]) {
      return BENGALI_NAME_MAP[base] + punct;
    }
  }

  // If token is already English letters / numbers, return it as-is
  if (/^[A-Za-z0-9.,'-]+$/.test(clean)) {
    return clean;
  }

  // 3. Phonetic parsing algorithm
  let out = '';
  const len = clean.length;
  let i = 0;

  while (i < len) {
    const ch = clean[i];
    const nextCh = i + 1 < len ? clean[i + 1] : null;
    const nextNextCh = i + 2 < len ? clean[i + 2] : null;

    // Conjunct / Hasanta (্ = \u09CD)
    if (nextCh === '্') {
      const c1 = CONSONANTS[ch] || ch;
      if (nextNextCh) {
        // Special conjunct combinations
        if (ch === 'ক' && nextNextCh === 'ষ') { // ক্ষ
          out += (i === 0 ? 'Kh' : 'kkh');
          i += 3;
          continue;
        }
        if (ch === 'জ' && nextNextCh === 'ঞ') { // জ্ঞ
          out += 'gy';
          i += 3;
          continue;
        }
        if (ch === 'হ' && nextNextCh === 'ম') { // হ্ম
          out += 'hm';
          i += 3;
          continue;
        }
        if (nextNextCh === 'য') { // ্য (jafala)
          out += c1 + 'y';
          i += 3;
          continue;
        }
        if (nextNextCh === 'র') { // ্র (rafala)
          out += c1 + 'r';
          i += 3;
          continue;
        }
        if (nextNextCh === 'ব') { // ্ব (bafala)
          out += (i === 0 ? c1 : c1 + c1); // doubles in middle: বিশ্বাস -> Biswas
          i += 3;
          continue;
        }
        const c2 = CONSONANTS[nextNextCh] || nextNextCh;
        out += c1 + c2;
        i += 3;
        continue;
      } else {
        out += c1;
        i += 2;
        continue;
      }
    }

    // Independent Vowel
    if (VOWELS[ch]) {
      out += VOWELS[ch];
      i++;
      continue;
    }

    // Consonant
    if (CONSONANTS[ch] !== undefined) {
      const c = CONSONANTS[ch];
      if (nextCh && VOWEL_SIGNS[nextCh]) {
        out += c + VOWEL_SIGNS[nextCh];
        i += 2;
      } else if (nextCh && (CONSONANTS[nextCh] !== undefined || VOWELS[nextCh] !== undefined)) {
        // Inherent 'a' between consonants in Bengali names
        out += c + 'a';
        i++;
      } else {
        // Word ending consonant
        out += c;
        i++;
      }
      continue;
    }

    // Dependent Vowel Sign without prior consonant
    if (VOWEL_SIGNS[ch]) {
      out += VOWEL_SIGNS[ch];
      i++;
      continue;
    }

    // Unknown or symbol
    out += ch;
    i++;
  }

  // Capitalize first character (Title Case)
  if (out.length > 0) {
    out = out.charAt(0).toUpperCase() + out.slice(1);
  }
  return out;
}

/**
 * Converts a Bengali full name or sentence to English in Banglish style.
 *
 * @param {string} text - Bengali input string (e.g. "মেহেদী হাসান")
 * @returns {string} - Transliterated English string (e.g. "Mehedi Hasan")
 */
export function banglaToBanglish(text) {
  if (!text || typeof text !== 'string') return '';
  const trimmed = text.trim();
  if (!trimmed) return '';

  const words = trimmed.split(/\s+/);
  return words.map(w => transliterateWord(w)).join(' ');
}

/**
 * Formats a name into Block Letters (Uppercase)
 *
 * @param {string} text
 * @returns {string}
 */
export function toBlockLetters(text) {
  if (!text || typeof text !== 'string') return '';
  return text.trim().toUpperCase();
}

/**
 * Helper to get clean address string from raw or structured address object
 */
export function formatAddress(address) {
  if (!address) return 'Not available';
  if (typeof address === 'string') return address;
  if (address.raw) return address.raw;

  const parts = [];
  if (address.holding) parts.push(`Holding: ${address.holding}`);
  if (address.village_road) parts.push(address.village_road);
  if (address.post_office) parts.push(`PO: ${address.post_office}${address.postal_code ? ` - ${address.postal_code}` : ''}`);
  if (address.upazila_thana) parts.push(`Thana: ${address.upazila_thana}`);
  if (address.district) parts.push(`District: ${address.district}`);

  return parts.length > 0 ? parts.join(', ') : 'Not available';
}
