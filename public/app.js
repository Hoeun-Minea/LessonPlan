// public/app.js
let currentLessonData = null;
let currentMeta = null;

// Presets data
const presets = {
  physics: {
    subject: 'រូបវិទ្យា',
    grade: 'ថ្នាក់ទី១១',
    chapter: 'ជំពូកទី២៖ ច្បាប់ចលនារបស់ញូតុន',
    lesson_title: 'ច្បាប់ទី២ ញូតុន (F = ma) និងការដោះស្រាយលំហាត់',
    duration: 50,
    notes: 'ផ្ដោតលើការពិសោធន៍បង្ហាញទំនាក់ទំនងរវាងកម្លាំង ម៉ាស និងសំទុះ និងការអនុវត្តរូបមន្ត'
  },
  math: {
    subject: 'គណិតវិទ្យា',
    grade: 'ថ្នាក់ទី៩',
    chapter: 'ជំពូកទី៣៖ សមីការដឺក្រេទី២',
    lesson_title: 'ការដោះស្រាយសមីការដឺក្រេទី២ មានមួយអញ្ញាតតាមឌីសគ្រីមីណង់ (Delta)',
    duration: 50,
    notes: 'សិស្សអាចគណនា Delta និងកំណត់ចំនួនឫសនៃសមីការបានត្រឹមត្រូវ'
  },
  khmer: {
    subject: 'អក្សរសាស្ត្រខ្មែរ',
    grade: 'ថ្នាក់ទី១០',
    chapter: 'ជំពូកទី១៖ អក្សរសិល្ប៍បុរាណ',
    lesson_title: 'រឿងទុំទាវ (វគ្គទុំនិងទាវជួបគ្នាលើកដំបូង)',
    duration: 50,
    notes: 'វិភាគលើចរិតលក្ខណៈតួអង្គ និងសិល្បៈតែងនិពន្ធរបស់ភិក្ខុសោម'
  },
  chemistry: {
    subject: 'គីមីវិទ្យា',
    grade: 'ថ្នាក់ទី១២',
    chapter: 'ជំពូកទី៣៖ អាស៊ីត-បាស',
    lesson_title: 'ការគណនា pH នៃសូលុយស្យុងអាស៊ីតខ្លាំង និងបាសខ្លាំង',
    duration: 50,
    notes: 'អនុវត្តរូបមន្ត pH = -log[H3O+] និង pOH = -log[OH-]'
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

  // API Key Modal Elements
  const btnApiKeyModal = document.getElementById('btnApiKeyModal');
  const apiKeyModal = document.getElementById('apiKeyModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnSaveApiKey = document.getElementById('btnSaveApiKey');
  const customApiKeyInput = document.getElementById('customApiKeyInput');

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

  // Handle preset selection
  presetSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    if (presets[val]) {
      const p = presets[val];
      document.getElementById('subject').value = p.subject;
      document.getElementById('grade').value = p.grade;
      document.getElementById('chapter').value = p.chapter;
      document.getElementById('lesson_title').value = p.lesson_title;
      document.getElementById('duration').value = p.duration;
      document.getElementById('notes').value = p.notes;
    }
  });

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const subject = document.getElementById('subject').value.trim();
    const grade = document.getElementById('grade').value.trim();
    const chapter = document.getElementById('chapter').value.trim();
    const lesson_title = document.getElementById('lesson_title').value.trim();
    const duration = document.getElementById('duration').value.trim();
    const notes = document.getElementById('notes').value.trim();
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
          subject,
          grade,
          chapter,
          lesson_title,
          duration,
          notes,
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
    document.getElementById('prevSubject').textContent = meta.subject;
    document.getElementById('prevGrade').textContent = meta.grade;
    document.getElementById('prevDuration').textContent = meta.duration;
    document.getElementById('prevDate').textContent = meta.date || new Date().toLocaleDateString('km-KH');
    document.getElementById('prevChapter').textContent = meta.chapter || 'ទូទៅ';
    document.getElementById('prevTitle').textContent = meta.lesson_title;

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
        headerRow.className = 'bg-blue-50/70 border-b border-slate-300 font-semibold text-slate-900';
        headerRow.innerHTML = `
          <td colspan="4" class="py-2 px-3 text-blue-900 font-medium">
            📌 ${step.step_title} <span class="text-xs text-slate-500 font-normal">(${step.time_allocated})</span>
          </td>
        `;
        tbody.appendChild(headerRow);

        // Activity Rows
        if (step.activities && Array.isArray(step.activities)) {
          step.activities.forEach((act) => {
            const tr = document.createElement('tr');
            tr.className = 'border-b border-slate-200 hover:bg-slate-50 transition';
            tr.innerHTML = `
              <td class="py-2.5 px-2 text-center text-xs text-slate-500 border-r border-slate-200 align-top">${step.time_allocated}</td>
              <td class="py-2.5 px-3 border-r border-slate-200 align-top leading-relaxed">${act.content}</td>
              <td class="py-2.5 px-3 border-r border-slate-200 align-top leading-relaxed">${act.teacher_activity}</td>
              <td class="py-2.5 px-3 align-top leading-relaxed">${act.student_activity}</td>
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
