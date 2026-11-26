// public/app.js
let currentLessonData = null;
let currentMeta = null;

// Initialize PDF.js worker
if (window.pdfjsLib) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// Presets data matching official HSSH format
const presets = {
  physics: {
    teacher_name: 'ហឿន មិនា',
    date: 'ថ្ងៃទី២៦ ខែវិច្ឆិកា ឆ្នាំ២០២៦',
    duration: 50,
    subject: 'រូបវិទ្យា',
    grade: 'ថ្នាក់ទី១១',
    chapter: 'ជំពូកទី២៖ ច្បាប់ចលនារបស់ញូតុន',
    lesson_title: 'មេរៀនទី១៖ ច្បាប់ទី២ញូតុន',
    section: 'ច្បាប់ទី២ញូតុន (F = ma) និងការដោះស្រាយលំហាត់',
    page: 'ទំព័រ ៤២-៤៦',
    teaching_method: 'វិធីសាស្ត្រសិស្សមជ្ឈមណ្ឌល និងការស្រាវជ្រាវ (5E)',
    materials_teacher: 'សៀវភៅពុម្ព, ស្លាយមេរៀន, កុំព្យូទ័រ ហ្វឺត, PhET Simulation',
    materials_student: 'សៀវភៅពុម្ព កុំព្យូទ័រ ប៊ិច សៀវភៅសរសេរ បន្ទាត់',
    lesson_content: `ច្បាប់ទី២ ញូតុន៖ សំទុះនៃអង្គធាតុមួយសមាមាត្រត្រង់នឹងកម្លាំងផ្គួបមានអំពើលើវា និងសមាមាត្រច្រាសនឹងម៉ាសរបស់វា។
រូបមន្ត៖ F = m * a (ឬ a = F / m)
ដែល៖
- F ៖ កម្លាំងផ្គួប គិតជាញូតុន (N)
- m ៖ ម៉ាសអង្គធាតុ គិតជាគីឡូក្រាម (kg)
- a ៖ សំទុះ គិតជាម៉ែត្រក្នុងមួយវិនាទីការ៉េ (m/s²)`
  },
  math: {
    teacher_name: 'ហឿន មិនា',
    date: 'ថ្ងៃទី២៦ ខែវិច្ឆិកា ឆ្នាំ២០២៦',
    duration: 50,
    subject: 'គណិតវិទ្យា',
    grade: 'ថ្នាក់ទី៩',
    chapter: 'ជំពូកទី៣៖ សមីការដឺក្រេទី២',
    lesson_title: 'មេរៀនទី២៖ សមីការដឺក្រេទី២ មានមួយអញ្ញាត',
    section: 'ការដោះស្រាយតាមឌីសគ្រីមីណង់ (Delta)',
    page: 'ទំព័រ ៧៨-៨២',
    teaching_method: 'វិធីសាស្ត្រសិស្សមជ្ឈមណ្ឌល និងការដោះស្រាយបញ្ហា',
    materials_teacher: 'សៀវភៅពុម្ព, ក្ដារខៀន, សន្លឹកកិច្ចការគណិតវិទ្យា',
    materials_student: 'សៀវភៅពុម្ព ប៊ិច សៀវភៅសរសេរ ម៉ាស៊ីនគិតលេខ',
    lesson_content: `សមីការដឺក្រេទី២ មានទម្រង់ទូទៅ ax² + bx + c = 0 (a ≠ 0)
រូបមន្តឌីសគ្រីមីណង់៖ Δ = b² - 4ac
- បើ Δ > 0 ៖ សមីការមានឫសពីរផ្សេងគ្នា x1 = (-b + √Δ) / 2a និង x2 = (-b - √Δ) / 2a
- បើ Δ = 0 ៖ សមីការមានឫសឌុប x1 = x2 = -b / 2a
- បើ Δ < 0 ៖ សមីការគ្មានឫសក្នុងសំណុំចំនួនពិត R`
  },
  chemistry: {
    teacher_name: 'ហឿន មិនា',
    date: 'ថ្ងៃទី២៦ ខែវិច្ឆិកា ឆ្នាំ២០២៦',
    duration: 50,
    subject: 'គីមីវិទ្យា',
    grade: 'ថ្នាក់ទី១២',
    chapter: 'ជំពូកទី៣៖ អាស៊ីត-បាស',
    lesson_title: 'មេរៀនទី១៖ និយមន័យ និងមាត្រដ្ឋាន pH',
    section: 'ការគណនា pH នៃសូលុយស្យុងអាស៊ីតខ្លាំង និងបាសខ្លាំង',
    page: 'ទំព័រ ៩០-៩៤',
    teaching_method: 'វិធីសាស្ត្រពិសោធន៍ និងការអនុវត្តជាក់ស្ដែង (Hands-on Lab)',
    materials_teacher: 'ក្រដាស pH, pH-meter, សូលុយស្យុង HCl និង NaOH, កែវបេស៊ែ',
    materials_student: 'សៀវភៅពុម្ព ប៊ិច សៀវភៅសរសេរ ម៉ាស៊ីនគិតលេខ',
    lesson_content: `និយមន័យ៖ pH ជាទំហំវាស់កម្រិតអាស៊ីត ឬបាសនៃសូលុយស្យុងទឹក។
រូបមន្តគណនា៖
- pH = -log[H3O+] ឬ [H3O+] = 10^(-pH)
- pOH = -log[OH-] ឬ [OH-] = 10^(-pOH)
- នៅសីតុណ្ហភាព 25°C ៖ pH + pOH = 14
- សូលុយស្យុងអាស៊ីត៖ pH < 7, សូលុយស្យុងណឺត៖ pH = 7, សូលុយស្យុងបាស៖ pH > 7`
  },
  biology: {
    teacher_name: 'ហឿន មិនា',
    date: 'ថ្ងៃទី២៦ ខែវិច្ឆិកា ឆ្នាំ២០២៦',
    duration: 50,
    subject: 'ជីវវិទ្យា',
    grade: 'ថ្នាក់ទី១០',
    chapter: 'ជំពូកទី២៖ វដ្តកោសិកា',
    lesson_title: 'មេរៀនទី១៖ ការបំបែកកោសិកា',
    section: 'ការបំបែកកោសិកាដោយមីតូស (Mitosis)',
    page: 'ទំព័រ ៥៥-៦០',
    teaching_method: 'វិធីសាស្ត្របង្រៀនតាមបែប STEM / STEAM',
    materials_teacher: 'មីក្រូទស្សន៍, ស្លាយកោសិការុក្ខជាតិ, វីដេអូគំនូរជីវចល 3D',
    materials_student: 'សៀវភៅពុម្ព ប៊ិច សៀវភៅសរសេរ សន្លឹកគំនូរជីវវិទ្យា',
    lesson_content: `មីតូស (Mitosis) ជាដំណើរការបំបែកកោសិកាមេមួយបង្កើតបានកោសិកាកូនពីរដែលមានចំនួនក្រូម៉ូសូមស្មើនឹងកោសិកាមេ (2n -> 2n)។
ដំណាក់កាលទាំង ៤៖
១. ប្រូផាស៖ ក្រូម៉ាទីនកន្ត្រាក់ខ្លីជាក្រូម៉ូសូម ភ្នាសកូរ្យូល និងភ្នាសណ្វៃយ៉ូរលាយបាត់
២. មេតាផាស៖ ក្រូម៉ូសូមតម្រៀបគ្នានៅប្លង់អេក្វាទ័រនៃធ្នូសរសៃសូត្រ
៣. អាណាផាស៖ ក្រូម៉ាទីតបងប្អូនផ្ដាច់ចេញពីគ្នាឆ្ពោះទៅប៉ូលទាំងសងខាង
៤. តេឡូផាស៖ ភ្នាសណ្វៃយ៉ូកើតឡើងវិញ កោសិកាបែងចែកស៊ីតូប្លាស`
  },
  khmer: {
    teacher_name: 'ហឿន មិនា',
    date: 'ថ្ងៃទី២៦ ខែវិច្ឆិកា ឆ្នាំ២០២៦',
    duration: 50,
    subject: 'អក្សរសាស្ត្រខ្មែរ',
    grade: 'ថ្នាក់ទី១០',
    chapter: 'ជំពូកទី១៖ អក្សរសិល្ប៍បុរាណ',
    lesson_title: 'មេរៀនទី២៖ រឿងទុំទាវ',
    section: 'វគ្គទុំនិងទាវជួបគ្នាលើកដំបូង',
    page: 'ទំព័រ ៣៤-៣៨',
    teaching_method: 'វិធីសាស្ត្រសិស្សមជ្ឈមណ្ឌល និងការសហការជាក្រុម',
    materials_teacher: 'សៀវភៅរឿងទុំទាវ, ក្ដារខៀន, សន្លឹកវិភាគតួអង្គ',
    materials_student: 'សៀវភៅពុម្ព ប៊ិច សៀវភៅសរសេរ សៀវភៅរឿងទុំទាវ',
    lesson_content: `រឿងទុំទាវ និពន្ធដោយភិក្ខុសោម នៅឆ្នាំ១៩១៥ ជាប្រភេទរឿងសោកនាដកម្មស្នេហា។
វគ្គទុំនិងទាវជួបគ្នា៖ ទុំនិងពេជ្របានលក់តោកនៅភូមិត្បូងឃ្មុំ ហើយបានចូលទៅក្នុងភូមិគ្រឹះយាយផាន់។ ទាវបានឃើញទុំច្រៀងយ៉ាងពិរោះក៏មានចិត្តប្រតិព័ទ្ធ។
ខ្លឹមសារអប់រំ៖ បង្ហាញពីសេរីភាពក្នុងទំនាក់ទំនងស្នេហា និងទំនៀមទម្លាប់បុរាណ «នំមិនធំជាងនាឡិ»។`
  },
  history: {
    teacher_name: 'ហឿន មិនា',
    date: 'ថ្ងៃទី២៦ ខែវិច្ឆិកា ឆ្នាំ២០២៦',
    duration: 50,
    subject: 'ប្រវត្តិវិទ្យា',
    grade: 'ថ្នាក់ទី១១',
    chapter: 'ជំពូកទី២៖ ប្រទេសកម្ពុជាសម័យអង្គរ',
    lesson_title: 'មេរៀនទី៣៖ ព្រះបាទជ័យវរ្ម័នទី៧',
    section: 'រជ្ជកាលព្រះបាទជ័យវរ្ម័នទី៧ (១១៨១ - ១២១៨)',
    page: 'ទំព័រ ៦៥-៧០',
    teaching_method: 'វិធីសាស្ត្រដោះស្រាយបញ្ហា និងពិភាក្សាជាក្រុម',
    materials_teacher: 'ផែនទីចក្រភពអង្គរ, រូបភាពប្រាសាទបាយ័ន, វីដេអូប្រវត្តិសាស្ត្រ',
    materials_student: 'សៀវភៅពុម្ព ប៊ិច សៀវភៅសរសេរ ផែនទីប្រវត្តិវិទ្យា',
    lesson_content: `ព្រះបាទជ័យវរ្ម័នទី៧ ឡើងគ្រងរាជ្យនៅឆ្នាំ ១១៨១ បន្ទាប់ពីរំដោះរាជធានីអង្គរពីកងទ័ពចាម។
ព្រះអង្គជាព្រះមហាក្សត្រដ៏ឆ្នើមបំផុតផ្នែកសង្គមកិច្ច និងសំណង់ស្ថាបត្យកម្ម៖
- សាសនា៖ គោរពព្រះពុទ្ធសាសនាមហាយាន
- សំណង់៖ ប្រាសាទបាយ័ន ប្រាសាទតាព្រហ្ម ប្រាសាទបន្ទាយក្តី កំពែងក្រុងអង្គរធំ
- សង្គមកិច្ច៖ សាងសង់មន្ទីរពេទ្យ (អរោគ្យសាលា) ចំនួន ១០២ និងសាលាសំណាក់ (ធម្មសាលា) ចំនួន ១២១ កន្លែងពាសពេញផ្ទៃប្រទេស។`
  },
  ict: {
    teacher_name: 'ហឿន មិនា',
    date: 'ថ្ងៃទី២៦ ខែវិច្ឆិកា ឆ្នាំ២០២៦',
    duration: 50,
    subject: 'ព័ត៌មានវិទ្យា (ICT)',
    grade: 'ថ្នាក់ទី១០',
    chapter: 'ជំពូកទី៤៖ មូលដ្ឋានគ្រឹះសរសេរកូដ Python',
    lesson_title: 'មេរៀនទី២៖ រចនាសម្ព័ន្ធលក្ខខណ្ឌ',
    section: 'លក្ខខណ្ឌ If...Else និងការត្រួតពិនិត្យលំហូរកូដ',
    page: 'ទំព័រ ១១០-១១៦',
    teaching_method: 'វិធីសាស្ត្រពិសោធន៍ និងការអនុវត្តជាក់ស្ដែង (Hands-on Lab)',
    materials_teacher: 'បន្ទប់កុំព្យូទ័រ ICT, កម្មវិធី Python IDLE / VS Code, Projector',
    materials_student: 'កុំព្យូទ័រ សៀវភៅកត់ត្រា ប៊ិច កម្មវិធី Python',
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

  // File Upload and Textarea elements
  const dropZone = document.getElementById('dropZone');
  const fileUpload = document.getElementById('fileUpload');
  const fileStatus = document.getElementById('fileStatus');
  const lessonContentArea = document.getElementById('lesson_content');
  const charCount = document.getElementById('charCount');

  // API Key Modal Elements
  const btnApiKeyModal = document.getElementById('btnApiKeyModal');
  const apiKeyModal = document.getElementById('apiKeyModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnSaveApiKey = document.getElementById('btnSaveApiKey');
  const customApiKeyInput = document.getElementById('customApiKeyInput');

  // Set today's date if empty
  const dateInput = document.getElementById('date');
  if (dateInput && !dateInput.value) {
    const today = new Date();
    dateInput.value = `ថ្ងៃទី${today.getDate()} ខែ${today.getMonth() + 1} ឆ្នាំ${today.getFullYear()}`;
  }

  // Update char count
  function updateCharCount() {
    const len = lessonContentArea.value.length;
    charCount.textContent = `${len.toLocaleString('km-KH')} តួអក្សរ`;
  }
  lessonContentArea.addEventListener('input', updateCharCount);

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

  // ==========================================
  // FILE PROCESSING: PDF, Word (.docx), & Text
  // ==========================================

  dropZone.addEventListener('click', () => {
    fileUpload.click();
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('border-emerald-600', 'bg-emerald-100/50');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('border-emerald-600', 'bg-emerald-100/50');
    });
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  });

  fileUpload.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  });

  async function processFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    showFileStatus(`⏳ កំពុងដំណើរការអានឯកសារ "${file.name}"...`, 'loading');

    try {
      let extractedText = '';

      if (ext === 'pdf') {
        if (!window.pdfjsLib) {
          throw new Error('បណ្ណាល័យ PDF.js មិនទាន់ដំណើរការ!');
        }
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;

        for (let i = 1; i <= totalPages; i++) {
          showFileStatus(`⏳ កំពុងទាញយកអត្ថបទពី PDF... (ទំព័រ ${i}/${totalPages})`, 'loading');
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageStrings = textContent.items.map(item => item.str);
          extractedText += `\n[--- ទំព័រទី ${i} ---]\n` + pageStrings.join(' ') + '\n';
        }
      } else if (ext === 'docx') {
        if (!window.mammoth) {
          throw new Error('បណ្ណាល័យ Mammoth.js មិនទាន់ដំណើរការ!');
        }
        const arrayBuffer = await file.arrayBuffer();
        const result = await window.mammoth.extractRawText({ arrayBuffer: arrayBuffer });
        extractedText = result.value;
      } else if (ext === 'txt' || ext === 'md') {
        extractedText = await file.text();
      } else {
        throw new Error('សូមជ្រើសរើសឯកសារជាទម្រង់ .PDF, .DOCX (Word) ឬ .TXT');
      }

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('ពុំមានអត្ថបទដែលអាចទាញយកបានពីឯកសារនេះទេ');
      }

      lessonContentArea.value = extractedText.trim();
      updateCharCount();

      const pageInput = document.getElementById('page');
      if (pageInput && !pageInput.value) {
        pageInput.value = `ឯកសារយោង៖ ${file.name}`;
      }

      showFileStatus(`✅ បានទាញយកខ្លឹមសារពីឯកសារ "${file.name}" ដោយជោគជ័យ (${extractedText.length.toLocaleString('km-KH')} តួអក្សរ)`, 'success');
    } catch (err) {
      console.error('File Read Error:', err);
      showFileStatus(`❌ ${err.message}`, 'error');
    }
  }

  function showFileStatus(msg, type) {
    fileStatus.classList.remove('hidden', 'bg-blue-50', 'text-blue-800', 'bg-emerald-50', 'text-emerald-800', 'bg-red-50', 'text-red-800');
    if (type === 'loading') {
      fileStatus.classList.add('bg-blue-50', 'text-blue-800');
    } else if (type === 'success') {
      fileStatus.classList.add('bg-emerald-50', 'text-emerald-800');
    } else {
      fileStatus.classList.add('bg-red-50', 'text-red-800');
    }
    fileStatus.innerHTML = `<span>${msg}</span>`;
  }

  // Handle Preset selection
  presetSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    if (presets[val]) {
      const p = presets[val];
      document.getElementById('teacher_name').value = p.teacher_name || '';
      document.getElementById('date').value = p.date || '';
      document.getElementById('duration').value = p.duration || 50;
      document.getElementById('subject').value = p.subject;
      document.getElementById('grade').value = p.grade;
      document.getElementById('chapter').value = p.chapter;
      document.getElementById('lesson_title').value = p.lesson_title;
      document.getElementById('section').value = p.section || '';
      document.getElementById('page').value = p.page || '';
      document.getElementById('teaching_method').value = p.teaching_method || '';
      document.getElementById('materials_teacher').value = p.materials_teacher || '';
      document.getElementById('materials_student').value = p.materials_student || '';
      document.getElementById('lesson_content').value = p.lesson_content || '';
      updateCharCount();
      fileStatus.classList.add('hidden');
    }
  });

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const date = document.getElementById('date').value.trim();
    const duration = document.getElementById('duration').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const grade = document.getElementById('grade').value.trim();
    const chapter = document.getElementById('chapter').value.trim();
    const lesson_title = document.getElementById('lesson_title').value.trim();
    const section = document.getElementById('section').value.trim();
    const page = document.getElementById('page').value.trim();
    const teaching_method = document.getElementById('teaching_method').value.trim();
    const materials_teacher = document.getElementById('materials_teacher').value.trim();
    const materials_student = document.getElementById('materials_student').value.trim();
    const teacher_name = document.getElementById('teacher_name').value.trim();
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
          date,
          duration,
          subject,
          grade,
          chapter,
          lesson_title,
          section,
          page,
          teaching_method,
          materials_teacher,
          materials_student,
          teacher_name,
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

  // Render Preview strictly matching user template
  function renderPreview(meta, data) {
    document.getElementById('prevDate').textContent = meta.date || '';
    document.getElementById('prevDuration').textContent = meta.duration || 50;
    document.getElementById('prevSubject').textContent = meta.subject || '';
    document.getElementById('prevGrade').textContent = meta.grade || '';
    document.getElementById('prevChapter').textContent = meta.chapter || '';
    document.getElementById('prevTitle').textContent = meta.lesson_title || '';
    document.getElementById('prevSection').textContent = meta.section || 'ចំណុចសំខាន់';
    document.getElementById('prevPage').textContent = meta.page || 'តាមសៀវភៅពុម្ព';
    document.getElementById('prevMethod').textContent = meta.teaching_method || 'វិធីសាស្ត្រសិស្សមជ្ឈមណ្ឌល';

    // Objectives (វិជ្ជាសម្បទា, បំណិនសម្បទា, ចរិយាសម្បទា)
    document.getElementById('prevKnowledge').textContent = data.objectives?.knowledge || '-';
    document.getElementById('prevSkills').textContent = data.objectives?.skills || '-';
    document.getElementById('prevAttitudes').textContent = data.objectives?.attitudes || '-';

    // Materials
    document.getElementById('prevMatTeacher').textContent = meta.materials_teacher || data.materials?.teacher || 'សៀវភៅពុម្ព, ស្លាយមេរៀន, កុំព្យូទ័រ ហ្វឺត';
    document.getElementById('prevMatStudent').textContent = meta.materials_student || data.materials?.student || 'សៀវភៅពុម្ព កុំព្យូទ័រ ប៊ិច សៀវភៅសរសេរ';

    // Signatures
    const teacherSign = document.getElementById('prevTeacherSign');
    if (meta.teacher_name) {
      teacherSign.textContent = `(${meta.teacher_name})`;
    } else {
      teacherSign.textContent = '';
    }

    // 5 Steps Table (សកម្មភាពគ្រូ | ខ្លឹមសារមេរៀន | សកម្មភាពសិស្ស)
    const tbody = document.getElementById('stepsTableBody');
    tbody.innerHTML = '';

    if (data.steps && Array.isArray(data.steps)) {
      data.steps.forEach((step) => {
        // Step Header Row (Colspan 3)
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
          <td colspan="3" class="step-header-cell py-2 px-3 bg-slate-100 font-bold border border-slate-900 text-slate-900">
            ${step.step_title}
          </td>
        `;
        tbody.appendChild(headerRow);

        // Activity Rows (3 Columns)
        if (step.activities && Array.isArray(step.activities)) {
          step.activities.forEach((act) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td class="py-2.5 px-3 border border-slate-900 align-top leading-relaxed text-xs sm:text-sm w-1/3">${act.teacher_activity}</td>
              <td class="py-2.5 px-3 border border-slate-900 align-top leading-relaxed text-xs sm:text-sm w-1/3">${act.content}</td>
              <td class="py-2.5 px-3 border border-slate-900 align-top leading-relaxed text-xs sm:text-sm w-1/3">${act.student_activity}</td>
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
