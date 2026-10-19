// Czech conjugation data. All arrays use: já, ty, on/ona, my, vy, oni/ony.
// Present stems are used for visual highlighting; the complete forms remain authoritative.
const PEOPLE = [
  { id: "ja", label: "já", english: "I" },
  { id: "ty", label: "ty", english: "you (singular)" },
  { id: "third", label: "on / ona", english: "he / she" },
  { id: "my", label: "my", english: "we" },
  { id: "vy", label: "vy", english: "you (plural / polite)" },
  { id: "they", label: "oni / ony", english: "they" },
];
const TENSES = [
  { id: "present", label: "Present", english: "do / am doing" },
  { id: "past", label: "Past", english: "did / was doing" },
  { id: "future", label: "Future", english: "will do" },
];
const AUX_PAST = [" jsem", " jsi", "", " jsme", " jste", ""];
const AUX_FUTURE = ["budu", "budeš", "bude", "budeme", "budete", "budou"];
const PAST_SUFFIX = {
  masculine: ["l", "l", "l", "li", "li", "li"],
  feminine: ["la", "la", "la", "ly", "ly", "ly"],
};

const VERBS = [
  {
    id: "delat", infinitive: "dělat", english: "to do / make",
    family: "-ám", aspect: "imperfective", stem: "děl", pastStem: "děla",
    present: ["dělám", "děláš", "dělá", "děláme", "děláte", "dělají"],
    note: "Common -ám pattern. Compare with perfective udělat: dělat describes an ongoing or habitual action.",
  },
  {
    id: "volat", infinitive: "volat", english: "to call",
    family: "-ám", aspect: "imperfective", stem: "vol", pastStem: "vola",
    present: ["volám", "voláš", "volá", "voláme", "voláte", "volají"],
  },
  {
    id: "cekat", infinitive: "čekat", english: "to wait",
    family: "-ám", aspect: "imperfective", stem: "ček", pastStem: "čeka",
    present: ["čekám", "čekáš", "čeká", "čekáme", "čekáte", "čekají"],
  },
  {
    id: "prosit", infinitive: "prosit", english: "to ask / request",
    family: "-ím", aspect: "imperfective", stem: "pros", pastStem: "prosi",
    present: ["prosím", "prosíš", "prosí", "prosíme", "prosíte", "prosí"],
  },
  {
    id: "mluvit", infinitive: "mluvit", english: "to speak",
    family: "-ím", aspect: "imperfective", stem: "mluv", pastStem: "mluvi",
    present: ["mluvím", "mluvíš", "mluví", "mluvíme", "mluvíte", "mluví"],
  },
  {
    id: "pracovat", infinitive: "pracovat", english: "to work",
    family: "-uji", aspect: "imperfective", stem: "prac", pastStem: "pracova",
    present: ["pracuji", "pracuješ", "pracuje", "pracujeme", "pracujete", "pracují"],
    note: "Standard -ovat pattern. Informally, pracuju and pracujou are also common.",
  },
  {
    id: "studovat", infinitive: "studovat", english: "to study",
    family: "-uji", aspect: "imperfective", stem: "stud", pastStem: "studova",
    present: ["studuji", "studuješ", "studuje", "studujeme", "studujete", "studují"],
    note: "Standard -ovat pattern; studuju and studujou are common conversational alternatives.",
  },
  {
    id: "mit", infinitive: "mít", english: "to have",
    family: "irregular", aspect: "imperfective", stem: "m", pastStem: "mě",
    present: ["mám", "máš", "má", "máme", "máte", "mají"],
  },
  {
    id: "byt", infinitive: "být", english: "to be",
    family: "irregular", aspect: "imperfective", stem: "",
    pastStem: "by",
    present: ["jsem", "jsi", "je", "jsme", "jste", "jsou"],
    future: ["budu", "budeš", "bude", "budeme", "budete", "budou"],
    futureStem: "bud",
    note: "Present forms are irregular; in the past the auxiliary is omitted in the third person.",
  },
  {
    id: "jit", infinitive: "jít", english: "to go (on foot)",
    family: "irregular", aspect: "imperfective", stem: "jd",
    present: ["jdu", "jdeš", "jde", "jdeme", "jdete", "jdou"],
    past: {
      masculine: ["šel jsem", "šel jsi", "šel", "šli jsme", "šli jste", "šli"],
      feminine: ["šla jsem", "šla jsi", "šla", "šly jsme", "šly jste", "šly"],
    },
    pastRoots: {
      masculine: ["še", "še", "še", "š", "š", "š"],
      feminine: ["š", "š", "š", "š", "š", "š"],
    },
    future: ["půjdu", "půjdeš", "půjde", "půjdeme", "půjdete", "půjdou"],
    futureStem: "půjd",
    note: "The past (šel/šla) and future (půjdu) use different stems. The future is not budu jít.",
  },
  {
    id: "vedet", infinitive: "vědět", english: "to know (a fact)",
    family: "irregular", aspect: "imperfective",
    stem: ["ví", "ví", "ví", "ví", "ví", "věd"], pastStem: "vědě",
    present: ["vím", "víš", "ví", "víme", "víte", "vědí"],
  },
  {
    id: "psat", infinitive: "psát", english: "to write",
    family: "irregular", aspect: "imperfective", stem: "píš", pastStem: "psa",
    present: ["píšu", "píšeš", "píše", "píšeme", "píšete", "píšou"],
    note: "The infinitive changes ps- → píš- in the present. Píši and píší are also standard variants.",
  },
  {
    id: "cist", infinitive: "číst", english: "to read",
    family: "irregular", aspect: "imperfective", stem: "čt", pastStem: "čet",
    present: ["čtu", "čteš", "čte", "čteme", "čtete", "čtou"],
  },
  {
    id: "udelat", infinitive: "udělat", english: "to do / finish doing",
    family: "-ám", aspect: "perfective", stem: "uděl", pastStem: "uděla",
    future: ["udělám", "uděláš", "udělá", "uděláme", "uděláte", "udělají"],
    note: "Perfective partner of dělat. Its non-past forms express future meaning; there is no true present tense.",
  },
  {
    id: "koupit", infinitive: "koupit", english: "to buy",
    family: "-ím", aspect: "perfective", stem: "koup", pastStem: "koupi",
    future: ["koupím", "koupíš", "koupí", "koupíme", "koupíte", "koupí"],
    note: "Perfective: koupím means 'I will buy', not 'I am buying'.",
  },
].map((verb) => {
  const past = verb.past || Object.fromEntries(
    Object.entries(PAST_SUFFIX).map(([gender, endings]) => [
      gender, endings.map((ending, index) => verb.pastStem + ending + AUX_PAST[index]),
    ])
  );
  return {
    ...verb,
    past,
    future: verb.future || AUX_FUTURE.map((auxiliary) => auxiliary + " " + verb.infinitive),
  };
});

const PRESETS = [
  { id: "patterns", label: "Core patterns", ids: ["delat", "mluvit", "pracovat", "byt"] },
  { id: "am", label: "-ám class", ids: ["delat", "volat", "cekat", "udelat"] },
  { id: "im", label: "-ím class", ids: ["prosit", "mluvit", "koupit"] },
  { id: "uji", label: "-uji class", ids: ["pracovat", "studovat"] },
  { id: "irregular", label: "Irregular stems", ids: ["mit", "byt", "jit", "vedet", "psat", "cist"] },
  { id: "aspect", label: "Aspect contrast", ids: ["delat", "udelat"] },
];
