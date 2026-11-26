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
      lesson_content,
      teacher_name,
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
        error: 'សូមបំពេញព័ត៌មានចាំបាច់ (មុខវិជ្ជា, ថ្នាក់ទី, និងមេរៀនទី/ចំណងជើង)!'
      });
    }

    const systemInstruction = `អ្នកគឺជាអ្នកជំនាញគរុកោសល្យ និងវិធីសាស្ត្របង្រៀននៃវិទ្យាល័យ ហ៊ុន សែន សេរីភាព (វិ.ហ.ស.សេរីភាព)។
ភារកិច្ចរបស់អ្នកគឺរៀបចំកិច្ចតែងការបង្រៀនឱ្យស្របតាមទម្រង់ផ្លូវការគំរូរបស់សាលា ១០០%៖
១. ក្បាលកិច្ចតែងការ៖
   - កាលបរិច្ឆេទ ៖
   - រយៈពេលបង្រៀន ៖
   - មុខវិជ្ជា ៖
   - ថ្នាក់ទី ៖
   - ជំពូកទី ៖
   - មេរៀនទី ៖
   - ផ្នែកទី ៖
   - ទំព័រ ៖
   - វិធីសាស្ត្របង្រៀន ៖

២. វត្ថុបំណងនៃមេរៀន (បន្ទាប់ពីបញ្ចប់មេរៀន សិស្សនឹងអាច៖) ត្រូវបែងចែកជា ៣ សម្បទា៖
   - វិជ្ជាសម្បទា ៖ (ចំណេះដឹងដែលសិស្សទទួលបាន ច្បាស់លាស់ វាស់វែងបាន)
   - បំណិនសម្បទា ៖ (សមត្ថភាពអនុវត្ត ការគណនា ការដោះស្រាយបញ្ហា)
   - ចរិយាសម្បទា ៖ (ស្មារតី ការសហការ ទំនួលខុសត្រូវ គុណធម៌ សីលធម៌)

៣. សម្ភារឧបទេស៖
   - គ្រូ ៖ សៀវភៅពុម្ព ស្លាយមេរៀន កុំព្យូទ័រ ហ្វឺត បន្ទាត់ ឬឧបករណ៍ពិសោធន៍...
   - សិស្ស ៖ សៀវភៅពុម្ព កុំព្យូទ័រ ប៊ិច សៀវភៅសរសេរ បន្ទាត់...

៤. ដំណើរការបង្រៀន មាន ៣ ជួរឈរ (Columns)៖
   [ សកម្មភាពគ្រូ | ខ្លឹមសារមេរៀន | សកម្មភាពសិស្ស ]
   និងត្រូវអនុវត្តតាម ៥ ជំហាន៖
   - ជំហានទី ១ លំនឹងថ្នាក់
   - ជំហានទី ២ រំលឹកមេរៀនចាស់ (មានសំណួរសួរ និងចម្លើយរំពឹងទុក)
   - ជំហានទី ៣ មេរៀនថ្មី (ខ្លឹមសារមេរៀនលម្អិត សកម្មភាពគ្រូដឹកនាំ និងសកម្មភាពសិស្សអនុវត្ត)
   - ជំហានទី ៤ ពង្រឹងពុទ្ធិ (សំណួរសង្ខេប លំហាត់ពង្រឹង ឬការវាយតម្លៃ)
   - ជំហានទី ៥ បណ្ដាំផ្ញើ និងកិច្ចការផ្ទះ (ផ្តល់កិច្ចការផ្ទះ និងបណ្តាំផ្ញើ)

៥. ប្រសិនបើមាន «ខ្លឹមសារមេរៀនជាក់ស្ដែង ឬ ឯកសារយោងពីសៀវភៅពុម្ព» ផ្ញើមកជាមួយ អ្នកត្រូវតែយកខ្លឹមសារ និយមន័យ រូបមន្ត និងលំហាត់នោះមកដាក់ក្នុងជំហានទី២ ទី៣ និងទី៤ ឱ្យត្រឹមត្រូវ ១០០%។`;

    let promptText = `សូមបង្កើតកិច្ចតែងការបង្រៀនតាមទិន្នន័យជាក់លាក់ដូចខាងក្រោម៖
- កាលបរិច្ឆេទ៖ ${date || 'ថ្ងៃនេះ'}
- រយៈពេលបង្រៀន៖ ${duration || 50} នាទី
- មុខវិជ្ជា៖ ${subject}
- ថ្នាក់ទី៖ ${grade}
- ជំពូកទី៖ ${chapter || 'ទូទៅ'}
- មេរៀនទី៖ ${lesson_title}
- ផ្នែកទី៖ ${section || 'ចំណុចសំខាន់'}
- ទំព័រ៖ ${page || 'តាមសៀវភៅពុម្ព'}
- វិធីសាស្ត្របង្រៀន៖ ${teaching_method || 'វិធីសាស្ត្រសិស្សមជ្ឈមណ្ឌល'}
- សម្ភារឧបទេសគ្រូ៖ ${materials_teacher || 'សៀវភៅពុម្ព, ស្លាយមេរៀន, កុំព្យូទ័រ ហ្វឺត'}
- សម្ភារឧបទេសសិស្ស៖ ${materials_student || 'សៀវភៅពុម្ព កុំព្យូទ័រ ប៊ិច សៀវភៅសរសេរ'}`;

    if (lesson_content && lesson_content.trim().length > 0) {
      promptText += `\n\n====================\n📖 ខ្លឹមសារមេរៀនជាក់ស្ដែងពីសៀវភៅពុម្ព / ឯកសារយោង (REFERENCE CONTENT)៖\n${lesson_content}\n====================\nសូមយកខ្លឹមសារខាងលើនេះ ទៅរៀបចំជាខ្លឹមសារមេរៀន សកម្មភាពគ្រូ និងសកម្មភាពសិស្ស ឱ្យបានពេញលេញ ត្រឹមត្រូវ និងស៊ីជម្រៅបំផុត។`;
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
                knowledge: { type: 'STRING', description: 'វិជ្ជាសម្បទា' },
                skills: { type: 'STRING', description: 'បំណិនសម្បទា' },
                attitudes: { type: 'STRING', description: 'ចរិយាសម្បទា' }
              },
              required: ['knowledge', 'skills', 'attitudes']
            },
            materials: {
              type: 'OBJECT',
              properties: {
                teacher: { type: 'STRING', description: 'សម្ភារឧបទេសគ្រូ' },
                student: { type: 'STRING', description: 'សម្ភារឧបទេសសិស្ស' }
              },
              required: ['teacher', 'student']
            },
            steps: {
              type: 'ARRAY',
              description: 'ដំណាក់កាលបង្រៀនទាំង ៥ ជំហាន',
              items: {
                type: 'OBJECT',
                properties: {
                  step_number: { type: 'INTEGER' },
                  step_title: { type: 'STRING', description: 'ឧ. ជំហានទី ១ លំនឹងថ្នាក់' },
                  activities: {
                    type: 'ARRAY',
                    items: {
                      type: 'OBJECT',
                      properties: {
                        teacher_activity: { type: 'STRING', description: 'សកម្មភាពគ្រូ' },
                        content: { type: 'STRING', description: 'ខ្លឹមសារមេរៀន' },
                        student_activity: { type: 'STRING', description: 'សកម្មភាពសិស្ស' }
                      },
                      required: ['teacher_activity', 'content', 'student_activity']
                    }
                  }
                },
                required: ['step_number', 'step_title', 'activities']
              }
            }
          },
          required: ['objectives', 'materials', 'steps']
        },
        temperature: 0.3
      }
    };

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
        date: date || new Date().toLocaleDateString('km-KH'),
        duration: duration || 50,
        subject,
        grade,
        chapter: chapter || 'ទូទៅ',
        lesson_title,
        section: section || '',
        page: page || '',
        teaching_method: teaching_method || 'វិធីសាស្ត្រសិស្សមជ្ឈមណ្ឌល',
        materials_teacher: materials_teacher || lessonPlanData.materials?.teacher || '',
        materials_student: materials_student || lessonPlanData.materials?.student || '',
        teacher_name: teacher_name || ''
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
