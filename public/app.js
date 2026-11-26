// public/app.js
let currentLessonData = null;
let currentMeta = null;

// Presets data with full pedagogical rich content
const presets = {
  physics: {
    teacher_name: 'ហឿន មិនា',
    school_name: 'វិទ្យាល័យ ហ៊ុន សែន សេរីភាព',
    subject: 'រូបវិទ្យា',
    grade: 'ថ្នាក់ទី១១',
    class_section: '១១ក',
    period: 'ម៉ោងទី១',
    duration: 50,
    chapter: 'ជំពូកទី២៖ ច្បាប់ចលនារបស់ញូតុន',
    lesson_title: 'ច្បាប់ទី២ ញូតុន (F = ma) និងការដោះស្រាយលំហាត់',
    sub_topics: '១. និយមន័យកម្លាំង ២. ទំនាក់ទំនងរវាងកម្លាំង ម៉ាស និងសំទុះ ៣. រូបមន្ត F = ma ៤. លំហាត់អនុវត្ត',
    teaching_method: 'វិធីសាស្ត្របង្រៀនតាមបែបការស្រាវជ្រាវ (5E Inquiry-based Learning)',
    tech_tools: 'LCD Projector, កម្មវិធី PhET Simulation (Forces and Motion), សន្លឹកកិច្ចការ',
    textbook_ref: 'សៀវភៅពុម្ពរូបវិទ្យា ថ្នាក់ទី១១ ក្រសួងអប់រំ យុវជន និងកីឡា ទំព័រ ៤២-៤៦',
    lesson_content: `ច្បាប់ទី២ ញូតុន៖ សំទុះនៃអង្គធាតុមួយសមាមាត្រត្រង់នឹងកម្លាំងផ្គួបមានអំពើលើវា និងសមាមាត្រច្រាសនឹងម៉ាសរបស់វា។
រូបមន្ត៖ F = m * a (ឬ a = F / m)
ដែល៖
- F ៖ កម្លាំងផ្គួប គិតជាញូតុន (N)
- m ៖ ម៉ាសអង្គធាតុ គិតជាគីឡូក្រាម (kg)
- a ៖ សំទុះ គិតជាម៉ែត្រក្នុងមួយវិនាទីការ៉េ (m/s²)`
  },
  math: {
    teacher_name: 'ហឿន មិនា',
    school_name: 'វិទ្យាល័យ ហ៊ុន សែន សេរីភាព',
    subject: 'គណិតវិទ្យា',
    grade: 'ថ្នាក់ទី៩',
    class_section: '៩ខ',
    period: 'ម៉ោងទី២',
    duration: 50,
    chapter: 'ជំពូកទី៣៖ សមីការដឺក្រេទី២',
    lesson_title: 'ការដោះស្រាយសមីការដឺក្រេទី២ មានមួយអញ្ញាតតាមឌីសគ្រីមីណង់ (Delta)',
    sub_topics: '១. ទម្រង់ទូទៅ ax² + bx + c = 0 ២. រូបមន្តឌីសគ្រីមីណង់ Δ = b² - 4ac ៣. ការកំណត់ចំនួនឫស',
    teaching_method: 'វិធីសាស្ត្រសិស្សមជ្ឈមណ្ឌល និងការសហការជាក្រុម',
    tech_tools: 'ក្ដារខៀន, សន្លឹកកិច្ចការគណិតវិទ្យា, Smart TV បង្ហាញលំហាត់',
    textbook_ref: 'សៀវភៅពុម្ពគណិតវិទ្យា ថ្នាក់ទី៩ ក្រសួងអប់រំ យុវជន និងកីឡា ទំព័រ ៧៨-៨២',
    lesson_content: `សមីការដឺក្រេទី២ មានទម្រង់ទូទៅ ax² + bx + c = 0 (a ≠ 0)
រូបមន្តឌីសគ្រីមីណង់៖ Δ = b² - 4ac
- បើ Δ > 0 ៖ សមីការមានឫសពីរផ្សេងគ្នា x1 = (-b + √Δ) / 2a និង x2 = (-b - √Δ) / 2a
- បើ Δ = 0 ៖ សមីការមានឫសឌុប x1 = x2 = -b / 2a
- បើ Δ < 0 ៖ សមីការគ្មានឫសក្នុងសំណុំចំនួនពិត R`
  },
  chemistry: {
    teacher_name: 'ហឿន មិនា',
    school_name: 'វិទ្យាល័យ ហ៊ុន សែន សេរីភាព',
    subject: 'គីមីវិទ្យា',
    grade: 'ថ្នាក់ទី១២',
    class_section: '១២វិទ្យាសាស្ត្រ',
    period: 'ម៉ោងទី៣',
    duration: 50,
    chapter: 'ជំពូកទី៣៖ អាស៊ីត-បាស',
    lesson_title: 'ការគណនា pH នៃសូលុយស្យុងអាស៊ីតខ្លាំង និងបាសខ្លាំង',
    sub_topics: '១. និយមន័យ pH និង pOH ២. រូបមន្ត pH = -log[H3O+] ៣. មាត្រដ្ឋាន pH ៤. ការគណនាក្នុងលំហាត់ជាក់ស្ដែង',
    teaching_method: 'វិធីសាស្ត្រពិសោធន៍ និងការអនុវត្តជាក់ស្ដែង (Hands-on Lab)',
    tech_tools: 'ក្រដាស pH, ឧបករណ៍ pH-meter, សូលុយស្យុង HCl និង NaOH, កែវបេស៊ែ',
    textbook_ref: 'សៀវភៅពុម្ពគីមីវិទ្យា ថ្នាក់ទី១២ ក្រសួងអប់រំ យុវជន និងកីឡា ទំព័រ ៩០-៩៤',
    lesson_content: `និយមន័យ៖ pH ជាទំហំវាស់កម្រិតអាស៊ីត ឬបាសនៃសូលុយស្យុងទឹក។
រូបមន្តគណនា៖
- pH = -log[H3O+] ឬ [H3O+] = 10^(-pH)
- pOH = -log[OH-] ឬ [OH-] = 10^(-pOH)
- នៅសីតុណ្ហភាព 25°C ៖ pH + pOH = 14
- សូលុយស្យុងអាស៊ីត៖ pH < 7
- សូលុយស្យុងណឺត៖ pH = 7
- សូលុយស្យុងបាស៖ pH > 7`
  },
  biology: {
    teacher_name: 'ហឿន មិនា',
    school_name: 'វិទ្យាល័យ ហ៊ុន សែន សេរីភាព',
    subject: 'ជីវវិទ្យា',
    grade: 'ថ្នាក់ទី១០',
    class_section: '១០ក',
    period: 'ម៉ោងទី១',
    duration: 50,
    chapter: 'ជំពូកទី២៖ វដ្តកោសិកា',
    lesson_title: 'ការបំបែកកោសិកាដោយមីតូស (Mitosis)',
    sub_topics: '១. វគ្គប្រូផាស (Prophase) ២. វគ្គមេតាផាស (Metaphase) ៣. វគ្គអាណាផាស (Anaphase) ៤. វគ្គតេឡូផាស (Telophase)',
    teaching_method: 'វិធីសាស្ត្របង្រៀនតាមបែប STEM / STEAM',
    tech_tools: 'មីក្រូទស្សន៍, ស្លាយកោសិការុក្ខជាតិ (ឫសខ្ទឹមបារាំង), វីដេអូគំនូរជីវចល 3D',
    textbook_ref: 'សៀវភៅពុម្ពជីវវិទ្យា ថ្នាក់ទី១០ ក្រសួងអប់រំ យុវជន និងកីឡា ទំព័រ ៥៥-៦០',
    lesson_content: `មីតូស (Mitosis) ជាដំណើរការបំបែកកោសិកាមេមួយបង្កើតបានកោសិកាកូនពីរដែលមានចំនួនក្រូម៉ូសូមស្មើនឹងកោសិកាមេ (2n -> 2n)។
ដំណាក់កាលទាំង ៤៖
១. ប្រូផាស៖ ក្រូម៉ាទីនកន្ត្រាក់ខ្លីជាក្រូម៉ូសូម ភ្នាសកូរ្យូល និងភ្នាសណ្វៃយ៉ូរលាយបាត់
២. មេតាផាស៖ ក្រូម៉ូសូមតម្រៀបគ្នានៅប្លង់អេក្វាទ័រនៃធ្នូសរសៃសូត្រ
៣. អាណាផាស៖ ក្រូម៉ាទីតបងប្អូនផ្ដាច់ចេញពីគ្នាឆ្ពោះទៅប៉ូលទាំងសងខាង
៤. តេឡូផាស៖ ភ្នាសណ្វៃយ៉ូកើតឡើងវិញ កោសិកាបែងចែកស៊ីតូប្លាស`
  },
  khmer: {
    teacher_name: 'ហឿន មិនា',
    school_name: 'វិទ្យាល័យ ហ៊ុន សែន សេរីភាព',
    subject: 'អក្សរសាស្ត្រខ្មែរ',
    grade: 'ថ្នាក់ទី១០',
    class_section: '១០ខ',
    period: 'ម៉ោងទី៤',
    duration: 50,
    chapter: 'ជំពូកទី១៖ អក្សរសិល្ប៍បុរាណ',
    lesson_title: 'រឿងទុំទាវ (វគ្គទុំនិងទាវជួបគ្នាលើកដំបូង)',
    sub_topics: '១. ការអានអត្ថបទកំណាព្យ ២. ពាក្យគន្លឹះ ៣. វិភាគចរិតលក្ខណៈតួអង្គទុំ និងទាវ ៤. សិល្បៈតែងនិពន្ធ',
    teaching_method: 'វិធីសាស្ត្រសិស្សមជ្ឈមណ្ឌល និងការសហការជាក្រុម',
    tech_tools: 'សៀវភៅរឿងទុំទាវ, ក្ដារខៀន, សន្លឹកវិភាគតួអង្គ',
    textbook_ref: 'សៀវភៅពុម្ពអក្សរសាស្ត្រខ្មែរ ថ្នាក់ទី១០ ក្រសួងអប់រំ យុវជន និងកីឡា ទំព័រ ៣៤-៣៨',
    lesson_content: `រឿងទុំទាវ និពន្ធដោយភិក្ខុសោម នៅឆ្នាំ១៩១៥ ជាប្រភេទរឿងសោកនាដកម្មស្នេហា។
វគ្គទុំនិងទាវជួបគ្នា៖ ទុំនិងពេជ្របានលក់តោកនៅភូមិត្បូងឃ្មុំ ហើយបានចូលទៅក្នុងភូមិគ្រឹះយាយផាន់។ ទាវបានឃើញទុំច្រៀងយ៉ាងពិរោះក៏មានចិត្តប្រតិព័ទ្ធ។
ខ្លឹមសារអប់រំ៖ បង្ហាញពីសេរីភាពក្នុងទំនាក់ទំនងស្នេហា និងទំនៀមទម្លាប់បុរាណ «នំមិនធំជាងនាឡិ»។`
  },
  history: {
    teacher_name: 'ហឿន មិនា',
    school_name: 'វិទ្យាល័យ ហ៊ុន សែន សេរីភាព',
    subject: 'ប្រវត្តិវិទ្យា',
    grade: 'ថ្នាក់ទី១១',
    class_section: '១១គ',
    period: 'ម៉ោងទី២',
    duration: 50,
    chapter: 'ជំពូកទី២៖ ប្រទេសកម្ពុជាសម័យអង្គរ',
    lesson_title: 'រជ្ជកាលព្រះបាទជ័យវរ្ម័នទី៧ (១១៨១ - ១២១៨)',
    sub_topics: '១. ការរំដោះប្រទេសពីចាម ២. ការកសាងប្រាសាទបាយ័ន និងអង្គរធំ ៣. សមិទ្ធផលសង្គមកិច្ច (មន្ទីរពេទ្យ និងសាលាសំណាក់)',
    teaching_method: 'វិធីសាស្ត្របង្រៀនដោះស្រាយបញ្ហា (Problem-Based Learning)',
    tech_tools: 'ផែនទីចក្រភពអង្គរ, រូបភាពប្រាសាទបាយ័ន, វីដេអូឯកសារប្រវត្តិសាស្ត្រ',
    textbook_ref: 'សៀវភៅពុម្ពប្រវត្តិវិទ្យា ថ្នាក់ទី១១ ក្រសួងអប់រំ យុវជន និងកីឡា ទំព័រ ៦៥-៧០',
    lesson_content: `ព្រះបាទជ័យវរ្ម័នទី៧ ឡើងគ្រងរាជ្យនៅឆ្នាំ ១១៨១ បន្ទាប់ពីរំដោះរាជធានីអង្គរពីកងទ័ពចាម។
ព្រះអង្គជាព្រះមហាក្សត្រដ៏ឆ្នើមបំផុតផ្នែកសង្គមកិច្ច និងសំណង់ស្ថាបត្យកម្ម៖
- សាសនា៖ គោរពព្រះពុទ្ធសាសនាមហាយាន
- សំណង់៖ ប្រាសាទបាយ័ន ប្រាសាទតាព្រហ្ម ប្រាសាទបន្ទាយក្តី កំពែងក្រុងអង្គរធំ
- សង្គមកិច្ច៖ សាងសង់មន្ទីរពេទ្យ (អរោគ្យសាលា) ចំនួន ១០២ និងសាលាសំណាក់ (ធម្មសាលា) ចំនួន ១២១ កន្លែងពាសពេញផ្ទៃប្រទេស។`
  },
  ict: {
    teacher_name: 'ហឿន មិនា',
    school_name: 'វិទ្យាល័យ ហ៊ុន សែន សេរីភាព',
    subject: 'ព័ត៌មានវិទ្យា (ICT)',
    grade: 'ថ្នាក់ទី១០',
    class_section: '១០ក (NGS)',
    period: 'ម៉ោងទី៥-៦',
    duration: 100,
    chapter: 'ជំពូកទី៤៖ មូលដ្ឋានគ្រឹះសរសេរកូដ Python',
    lesson_title: 'លក្ខខណ្ឌ If...Else និងការត្រួតពិនិត្យលំហូរកូដ',
    sub_topics: '១. និយមន័យលក្ខខណ្ឌ ២. ទម្រង់ if, if...else, elif ៣. សញ្ញាប្រៀបធៀប (==, !=, >, <) ៤. ការអនុវត្តសរសេរកូដ',
    teaching_method: 'វិធីសាស្ត្រពិសោធន៍ និងការអនុវត្តជាក់ស្ដែង (Hands-on Lab)',
    tech_tools: 'បន្ទប់កុំព្យូទ័រ ICT, កម្មវិធី Python IDLE / VS Code, Projector',
    textbook_ref: 'សៀវភៅពុម្ពព័ត៌មានវិទ្យា ថ្នាក់ទី១០ ក្រសួងអប់រំ យុវជន និងកីឡា ទំព័រ ១១០-១១៦',
    lesson_content: `ក្នុងភាសា Python លក្ខខណ្ឌត្រូវបានប្រើដើម្បីធ្វើការសម្រេចចិត្ត៖
ទម្រង់ if...else៖
if condition:
    # កូដដំណើរការពេលពិត (True)
else:
    # កូដដំណើរការពេលមិនពិត (False)

ឧទាហរណ៍៖
score = 75
if score >= 50:
    print("ជាប់")
else:
    print("ធ្លាក់")`
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('lessonForm');
  const presetSelect = document.getElementById('presetSelect');
  const btnSubmit = document.getElementById('btnSubmit');
  const loadingArea = document.getElementById('loadingArea');
  const emptyArea = document.getElementById('emptyArea');
  const previewContent = document.getElementById('previewContent');
  const actionButtons = document.getElementById('actionButtons');
  const btnExportDocx = document.getElementById('btnExportDocx');
  const btnPrint = document.getElementById('btnPrint');
  const fileUpload = document.getElementById('fileUpload');

  // API Key Modal Elements
  const btnApiKeyModal = document.getElementById('btnApiKeyModal');
  const apiKeyModal = document.getElementById('apiKeyModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnSaveApiKey = document.getElementById('btnSaveApiKey');
  const customApiKeyInput = document.getElementById('customApiKeyInput');

  // Set today's date in date picker if empty
  const teachingDateInput = document.getElementById('teaching_date');
  if (teachingDateInput && !teachingDateInput.value) {
    teachingDateInput.value = new Date().toISOString().split('T')[0];
  }

  // Load saved API Key from localStorage
  const savedKey = localStorage.getItem('gemini_api_key');
  if (savedKey) {
    customApiKeyInput.value = savedKey;
  }

  btnApiKeyModal.addEventListener('click', () => {
    apiKeyModal.classList.remove('hidden');
  });

  btnCloseModal.addEventListener('click', () => {
    apiKeyModal.classList.add('hidden');
  });

  btnSaveApiKey.addEventListener('click', () => {
    const key = customApiKeyInput.value.trim();
    if (key) {
      localStorage.setItem('gemini_api_key', key);
      alert('បានរក្សាទុក Gemini API Key ដោយជោគជ័យ!');
    } else {
      localStorage.removeItem('gemini_api_key');
      alert('បានលុប API Key រួចរាល់!');
    }
    apiKeyModal.classList.add('hidden');
  });

  // Handle File Upload (.txt or .md)
  if (fileUpload) {
    fileUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const lessonContentArea = document.getElementById('lesson_content');
        if (lessonContentArea) {
          lessonContentArea.value = text;
          alert(`📥 បានបញ្ចូលខ្លឹមសារពីឯកសារ "${file.name}" ដោយជោគជ័យ!`);
        }
      };
      reader.readAsText(file);
    });
  }

  // Handle Preset selection
  presetSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    if (presets[val]) {
      const p = presets[val];
      document.getElementById('teacher_name').value = p.teacher_name || '';
      document.getElementById('school_name').value = p.school_name || '';
      document.getElementById('subject').value = p.subject;
      document.getElementById('grade').value = p.grade;
      document.getElementById('class_section').value = p.class_section || '';
      document.getElementById('period').value = p.period || '';
      document.getElementById('duration').value = p.duration || 50;
      document.getElementById('chapter').value = p.chapter;
      document.getElementById('lesson_title').value = p.lesson_title;
      document.getElementById('sub_topics').value = p.sub_topics || '';
      document.getElementById('teaching_method').value = p.teaching_method || '';
      document.getElementById('tech_tools').value = p.tech_tools || '';
      document.getElementById('textbook_ref').value = p.textbook_ref || '';
      document.getElementById('lesson_content').value = p.lesson_content || '';
    }
  });

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const teacher_name = document.getElementById('teacher_name').value.trim();
    const school_name = document.getElementById('school_name').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const grade = document.getElementById('grade').value.trim();
    const class_section = document.getElementById('class_section').value.trim();
    const period = document.getElementById('period').value.trim();
    const duration = document.getElementById('duration').value.trim();
    const teaching_date = document.getElementById('teaching_date').value;
    const chapter = document.getElementById('chapter').value.trim();
    const lesson_title = document.getElementById('lesson_title').value.trim();
    const sub_topics = document.getElementById('sub_topics').value.trim();
    const teaching_method = document.getElementById('teaching_method').value;
    const tech_tools = document.getElementById('tech_tools').value.trim();
    const textbook_ref = document.getElementById('textbook_ref').value.trim();
    const lesson_content = document.getElementById('lesson_content').value.trim();
    const custom_api_key = localStorage.getItem('gemini_api_key') || '';

    // UI Updates
    emptyArea.classList.add('hidden');
    previewContent.classList.add('hidden');
    actionButtons.classList.add('hidden');
    loadingArea.classList.remove('hidden');
    btnSubmit.disabled = true;
    btnSubmit.classList.add('opacity-50', 'cursor-not-allowed');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacher_name,
          school_name,
          subject,
          grade,
          class_section,
          period,
          duration,
          teaching_date,
          chapter,
          lesson_title,
          sub_topics,
          teaching_method,
          tech_tools,
          textbook_ref,
          lesson_content,
          custom_api_key
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'មានបញ្ហាក្នុងការបង្កើតកិច្ចតែងការ!');
      }

      currentLessonData = result.data;
      currentMeta = result.meta;

      renderPreview(currentMeta, currentLessonData);

      loadingArea.classList.add('hidden');
      previewContent.classList.remove('hidden');
      actionButtons.classList.remove('hidden');
    } catch (err) {
      console.error(err);
      loadingArea.classList.add('hidden');
      emptyArea.classList.remove('hidden');
      alert(`⚠️ ${err.message}`);
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  });

  // Render Preview Function
  function renderPreview(meta, data) {
    document.getElementById('prevSchool').textContent = meta.school_name || 'វិទ្យាល័យ ហ៊ុន សែន សេរីភាព';
    document.getElementById('prevTeacher').textContent = meta.teacher_name || 'លោកគ្រូ/អ្នកគ្រូ';
    document.getElementById('prevSubject').textContent = meta.subject;
    document.getElementById('prevGrade').textContent = `${meta.grade} ${meta.class_section ? `(${meta.class_section})` : ''}`;
    document.getElementById('prevPeriod').textContent = meta.period || 'ម៉ោងទី១';
    document.getElementById('prevDuration').textContent = meta.duration;
    document.getElementById('prevDate').textContent = meta.teaching_date || new Date().toLocaleDateString('km-KH');
    document.getElementById('prevChapter').textContent = meta.chapter || 'ទូទៅ';
    document.getElementById('prevTitle').textContent = meta.lesson_title;

    // Sub topics
    const subTopicsWrap = document.getElementById('prevSubTopicsWrapper');
    if (meta.sub_topics) {
      document.getElementById('prevSubTopics').textContent = meta.sub_topics;
      subTopicsWrap.classList.remove('hidden');
    } else {
      subTopicsWrap.classList.add('hidden');
    }

    // Method
    const methodWrap = document.getElementById('prevMethodWrapper');
    if (meta.teaching_method) {
      document.getElementById('prevMethod').textContent = meta.teaching_method;
      methodWrap.classList.remove('hidden');
    } else {
      methodWrap.classList.add('hidden');
    }

    // Reference
    const refWrap = document.getElementById('prevRefWrapper');
    if (meta.textbook_ref) {
      document.getElementById('prevRef').textContent = meta.textbook_ref;
      refWrap.classList.remove('hidden');
    } else {
      refWrap.classList.add('hidden');
    }

    // Objectives
    document.getElementById('prevKnowledge').textContent = data.objectives?.knowledge || '-';
    document.getElementById('prevSkills').textContent = data.objectives?.skills || '-';
    document.getElementById('prevAttitudes').textContent = data.objectives?.attitudes || '-';

    // Materials
    document.getElementById('prevMatTeacher').textContent = data.materials?.teacher || '-';
    document.getElementById('prevMatStudent').textContent = data.materials?.student || '-';

    // 5 Steps Table
    const tbody = document.getElementById('stepsTableBody');
    tbody.innerHTML = '';

    if (data.steps && Array.isArray(data.steps)) {
      data.steps.forEach((step) => {
        // Step Header Row
        const headerRow = document.createElement('tr');
        headerRow.className = 'bg-blue-50/80 border-b border-slate-300 font-semibold text-slate-900';
        headerRow.innerHTML = `
          <td colspan="4" class="py-2.5 px-3 text-blue-900 font-medium">
            📌 ${step.step_title} <span class="text-xs text-slate-500 font-normal">(${step.time_allocated})</span>
          </td>
        `;
        tbody.appendChild(headerRow);

        // Activity Rows
        if (step.activities && Array.isArray(step.activities)) {
          step.activities.forEach((act) => {
            const tr = document.createElement('tr');
            tr.className = 'border-b border-slate-200 hover:bg-slate-50/60 transition';
            tr.innerHTML = `
              <td class="py-2.5 px-2 text-center text-xs text-slate-500 border-r border-slate-200 align-top">${step.time_allocated}</td>
              <td class="py-2.5 px-3 border-r border-slate-200 align-top leading-relaxed text-xs sm:text-sm">${act.content}</td>
              <td class="py-2.5 px-3 border-r border-slate-200 align-top leading-relaxed text-xs sm:text-sm">${act.teacher_activity}</td>
              <td class="py-2.5 px-3 align-top leading-relaxed text-xs sm:text-sm">${act.student_activity}</td>
            `;
            tbody.appendChild(tr);
          });
        }
      });
    }
  }

  // Export to Word (.docx)
  btnExportDocx.addEventListener('click', async () => {
    if (!currentLessonData || !currentMeta) {
      alert('សូមបង្កើតកិច្ចតែងការជាមុនសិន!');
      return;
    }

    btnExportDocx.disabled = true;
    btnExportDocx.innerHTML = '⏳ កំពុង Export...';

    try {
      const response = await fetch('/api/export-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meta: currentMeta,
          data: currentLessonData
        })
      });

      if (!response.ok) {
        throw new Error('មានបញ្ហាក្នុងការបង្កើតឯកសារ Word');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `កិច្ចតែងការ_${currentMeta.subject}_${currentMeta.grade}_${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(`⚠️ ${err.message}`);
    } finally {
      btnExportDocx.disabled = false;
      btnExportDocx.innerHTML = '📥 ទាញយកជា Word (.docx)';
    }
  });

  // Print function
  btnPrint.addEventListener('click', () => {
    window.print();
  });
});
