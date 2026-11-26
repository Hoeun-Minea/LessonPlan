// api/generate.js - Vercel Serverless Function & Express compatible
module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
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
      notes,
      custom_api_key
    } = req.body;

    const apiKey = custom_api_key || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: 'សូមបញ្ចូល Gemini API Key នៅក្នុង Vercel Environment Variables ឬ លើប៊ូតុង "🔑 កំណត់ API Key" លើផ្ទាំង Web App!'
      });
    }

    if (!subject || !grade || !lesson_title) {
      return res.status(400).json({
        error: 'សូមបំពេញព័ត៌មានចាំបាច់ (មុខវិជ្ជា, ថ្នាក់, និងចំណងជើងមេរៀន)!'
      });
    }

    const systemInstruction = `អ្នកគឺជាអ្នកជំនាញជាន់ខ្ពស់ផ្នែកវិធីសាស្រ្តបង្រៀន និងគរុកោសល្យនៃក្រសួងអប់រំ យុវជន និងកីឡានៃព្រះរាជាណាចក្រកម្ពុជា (ជាពិសេសស្តង់ដារសាលារៀនជំនាន់ថ្មី New Generation School - NGS)។
ភារកិច្ចរបស់អ្នក៖
១. រៀបចំកិច្ចតែងការបង្រៀនជាភាសាខ្មែរឱ្យមានលក្ខណៈគរុកោសល្យច្បាស់លាស់ ស៊ីជម្រៅ ស្របតាមកម្រិតថ្នាក់ និងមុខវិជ្ជា។
២. អនុវត្តតាមលំនាំ ៥ ជំហាននៃការបង្រៀន (ដំណាក់កាលបង្រៀនផ្លូវការ)៖
   - ជំហានទី១៖ រដ្ឋបាលថ្នាក់ (ពិនិត្យអនាម័យ វត្តមាន និងវិន័យ)
   - ជំហានទី២៖ រំលឹកមេរៀនចាស់ ឬត្រួតពិនិត្យកិច្ចការផ្ទះ (មានសំណួរសួរ និងចម្លើយរំពឹងទុក)
   - ជំហានទី៣៖ ទំនាក់ទំនងមេរៀនថ្មី និងដំណើរការបង្រៀនខ្លឹមសារ (បែងចែកសកម្មភាពគ្រូ និងសកម្មភាពសិស្សឱ្យច្បាស់លាស់ ផ្អែកលើវិធីសាស្ត្របង្រៀនដែលបានជ្រើសរើស)
   - ជំហានទី៤៖ ពង្រឹងចំណេះដឹង (លំហាត់អនុវត្ត សំណួរបំផុស ឬការវាយតម្លៃលទ្ធផលសិក្សា)
   - ជំហានទី៥៖ បណ្តាំផ្ញើ និងកិច្ចការផ្ទះ (ការផ្តាំផ្ញើឱ្យរំលឹកមេរៀន និងកិច្ចការស្រាវជ្រាវ)
៣. វត្ថុបំណងត្រូវបែងចែកជា ៣ ប្រការច្បាស់លាស់៖ ចំណេះដឹង, បំណិន, និង ឥរិយាបថ (ប្រើពាក្យសកម្មភាពវាស់វែងបានដូចជា៖ កំណត់បាន, ពន្យល់បាន, គណនាបាន, អនុវត្តបាន, បង្ហាញពីស្មារតី...)។
៤. [សំខាន់បំផុត] ប្រសិនបើមាន «ខ្លឹមសារមេរៀនដកស្រង់ ឬ ឯកសារយោង» ផ្ញើមកជាមួយ អ្នកត្រូវតែផ្អែកលើខ្លឹមសារនោះ ១០០% ដោយដកស្រង់និយមន័យ រូបមន្ត ឧទាហរណ៍ និងលំហាត់ជាក់ស្ដែងមកដាក់ក្នុងកិច្ចតែងការ មិនត្រូវប្រឌិតខុសពីសៀវភៅពុម្ពឡើយ។`;

    let promptText = `សូមបង្កើតកិច្ចតែងការបង្រៀនតាមទិន្នន័យលម្អិតដូចខាងក្រោម៖
- ឈ្មោះគ្រូបង្រៀន៖ ${teacher_name || 'លោកគ្រូ/អ្នកគ្រូ'}
- ឈ្មោះសាលារៀន៖ ${school_name || 'វិទ្យាល័យ ហ៊ុន សែន សេរីភាព'}
- មុខវិជ្ជា៖ ${subject}
- កម្រិតថ្នាក់៖ ${grade} ${class_section ? `(${class_section})` : ''}
- ម៉ោងបង្រៀន៖ ${period || 'ម៉ោងទី១'} (រយៈពេល ${duration || 50} នាទី)
- កាលបរិច្ឆេទ៖ ${teaching_date || 'ថ្ងៃនេះ'}
- ជំពូកទី៖ ${chapter || 'ទូទៅ'}
- ចំណងជើងមេរៀន៖ ${lesson_title}
- ខ្លឹមសាររង / ចំណុចសំខាន់៖ ${sub_topics || 'តាមខ្លឹមសារមេរៀន'}
- វិធីសាស្ត្របង្រៀនចម្បង៖ ${teaching_method || 'សិស្សមជ្ឈមណ្ឌល និងការសហការជាក្រុម'}
- ឧបករណ៍បច្ចេកវិទ្យា & សម្ភារឧបទេស៖ ${tech_tools || 'សៀវភៅពុម្ព បន្ទាត់ ផ្ទាំងរូបភាព'}
- ឯកសារយោង / សៀវភៅពុម្ព៖ ${textbook_ref || 'សៀវភៅពុម្ពក្រសួងអប់រំ យុវជន និងកីឡា'}
- ចំណុចសំខាន់បន្ថែម៖ ${notes || 'គ្មាន'}`;

    if (lesson_content && lesson_content.trim().length > 0) {
      promptText += `\n\n====================\n📖 ខ្លឹមសារមេរៀនជាក់ស្ដែងពីសៀវភៅពុម្ព ឬ ឯកសារយោង (REFERENCE CONTENT)៖\n${lesson_content}\n====================\nសូមយកខ្លឹមសារ និយមន័យ រូបមន្ត និងទិន្នន័យជាក់ស្ដែងខាងលើនេះ ទៅរៀបចំជាខ្លឹមសារមេរៀន សំណួរ-ចម្លើយ និងលំហាត់ក្នុងជំហានទី២ ទី៣ និងទី៤ ឱ្យបានត្រឹមត្រូវនិងស៊ីជម្រៅបំផុត។`;
    }

    const payload = {
      system_instruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: promptText }]
        }
      ],
      generationConfig: {
        response_mime_type: 'application/json',
        response_schema: {
          type: 'OBJECT',
          properties: {
            objectives: {
              type: 'OBJECT',
              properties: {
                knowledge: { type: 'STRING', description: 'ចំណេះដឹងដែលសិស្សទទួលបាន' },
                skills: { type: 'STRING', description: 'បំណិន និងការអនុវត្តជាក់ស្ដែង' },
                attitudes: { type: 'STRING', description: 'ឥរិយាបថ និងគុណតម្លៃ' }
              },
              required: ['knowledge', 'skills', 'attitudes']
            },
            materials: {
              type: 'OBJECT',
              properties: {
                teacher: { type: 'STRING', description: 'សម្ភារឧបទេស និងបច្ចេកវិទ្យាសម្រាប់គ្រូ' },
                student: { type: 'STRING', description: 'សម្ភារឧបទេសសម្រាប់សិស្ស' }
              },
              required: ['teacher', 'student']
            },
            teaching_methods: {
              type: 'STRING',
              description: 'វិធីសាស្ត្របង្រៀនដែលបានអនុវត្តក្នុងមេរៀននេះ'
            },
            steps: {
              type: 'ARRAY',
              description: 'ដំណាក់កាលបង្រៀនទាំង ៥ ជំហាន',
              items: {
                type: 'OBJECT',
                properties: {
                  step_number: { type: 'INTEGER' },
                  step_title: { type: 'STRING' },
                  time_allocated: { type: 'STRING' },
                  activities: {
                    type: 'ARRAY',
                    items: {
                      type: 'OBJECT',
                      properties: {
                        content: { type: 'STRING', description: 'ខ្លឹមសារមេរៀន' },
                        teacher_activity: { type: 'STRING', description: 'សកម្មភាពគ្រូ' },
                        student_activity: { type: 'STRING', description: 'សកម្មភាពសិស្ស' }
                      },
                      required: ['content', 'teacher_activity', 'student_activity']
                    }
                  }
                },
                required: ['step_number', 'step_title', 'time_allocated', 'activities']
              }
            }
          },
          required: ['objectives', 'materials', 'teaching_methods', 'steps']
        },
        temperature: 0.3
      }
    };

    // បញ្ជី Model តាមលំដាប់អាទិភាព
    const candidateModels = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let lastError = null;
    let data = null;

    for (const model of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          data = await response.json();
          break;
        } else {
          const errText = await response.text();
          lastError = `Model ${model} error (${response.status}): ${errText}`;
        }
      } catch (e) {
        lastError = e.message;
      }
    }

    if (!data) {
      return res.status(500).json({
        error: `កំហុសក្នុងការបង្កើតកិច្ចតែងការ៖ ${lastError || 'Server Unavailable'}`
      });
    }

    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawJson) {
      return res.status(500).json({ error: 'ពុំទទួលបានចម្លើយពី AI ទេ' });
    }

    const lessonPlanData = JSON.parse(rawJson);

    return res.status(200).json({
      success: true,
      meta: {
        teacher_name: teacher_name || '',
        school_name: school_name || 'វិទ្យាល័យ ហ៊ុន សែន សេរីភាព',
        subject,
        grade,
        class_section: class_section || '',
        period: period || 'ម៉ោងទី១',
        duration: duration || 50,
        teaching_date: teaching_date || new Date().toLocaleDateString('km-KH'),
        chapter: chapter || 'ទូទៅ',
        lesson_title,
        sub_topics: sub_topics || '',
        teaching_method: teaching_method || lessonPlanData.teaching_methods || '',
        tech_tools: tech_tools || '',
        textbook_ref: textbook_ref || ''
      },
      data: lessonPlanData
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: error.message || 'មានបញ្ហាបច្ចេកទេសក្នុងដំណើរការទិន្នន័យ'
    });
  }
};
