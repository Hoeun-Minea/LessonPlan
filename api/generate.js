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
    const { subject, grade, chapter, lesson_title, duration, notes, custom_api_key } = req.body;

    const apiKey = custom_api_key || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: 'សូមបញ្ចូល Gemini API Key នៅក្នុងប្រព័ន្ធ ឬ ផ្ទាំងបញ្ចូល API Key ផ្ទាល់ខ្លួន!'
      });
    }

    if (!subject || !grade || !lesson_title) {
      return res.status(400).json({
        error: 'សូមបំពេញព័ត៌មានចាំបាច់ (មុខវិជ្ជា, ថ្នាក់, និងចំណងជើងមេរៀន)!'
      });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const systemInstruction = `អ្នកគឺជាអ្នកជំនាញវិធីសាស្រ្តបង្រៀន និងរៀបចំកិច្ចតែងការបង្រៀនគរុកោសល្យស្តង់ដារនៃក្រសួងអប់រំ យុវជន និងកីឡានៃព្រះរាជាណាចក្រកម្ពុជា (ជាពិសេសស្តង់ដារសាលារៀនជំនាន់ថ្មី NGS)។
ចូររៀបចំកិច្ចតែងការបង្រៀនជាភាសាខ្មែរឱ្យបានលម្អិត ត្រឹមត្រូវតាមកម្រិតថ្នាក់ និងមុខវិជ្ជា ដោយអនុវត្តតាមលំនាំ ៥ ជំហាននៃការបង្រៀន៖
ជំហានទី១៖ រដ្ឋបាលថ្នាក់ (អនាម័យ វត្តមាន វិន័យ)
ជំហានទី២៖ រំលឹកមេរៀនចាស់ ឬត្រួតពិនិត្យកិច្ចការផ្ទះ
ជំហានទី៣៖ ទំនាក់ទំនងមេរៀនថ្មី និងដំណើរការបង្រៀនខ្លឹមសារ
ជំហានទី៤៖ ពង្រឹងចំណេះដឹង និងការវាយតម្លៃ
ជំហានទី៥៖ បណ្តាំផ្ញើ និងកិច្ចការផ្ទះ

វត្ថុបំណងត្រូវបែងចែកជា ៣ ប្រការច្បាស់លាស់៖ ចំណេះដឹង, បំណិន, និង ឥរិយាបថ។`;

    const promptText = `សូមបង្កើតកិច្ចតែងការបង្រៀនលម្អិតដូចខាងក្រោម៖
- មុខវិជ្ជា៖ ${subject}
- កម្រិតថ្នាក់៖ ${grade}
- ជំពូក៖ ${chapter || 'ទូទៅ'}
- ចំណងជើងមេរៀន៖ ${lesson_title}
- រយៈពេលបង្រៀន៖ ${duration || 50} នាទី
- ចំណុចសំខាន់បន្ថែម៖ ${notes || 'គ្មាន'}`;

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
                teacher: { type: 'STRING', description: 'សម្ភារឧបទេសសម្រាប់គ្រូ' },
                student: { type: 'STRING', description: 'សម្ភារឧបទេសសម្រាប់សិស្ស' }
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
          required: ['objectives', 'materials', 'steps']
        },
        temperature: 0.4
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: `កំហុសពី Gemini API (${response.status}): ${errText}`
      });
    }

    const data = await response.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawJson) {
      return res.status(500).json({ error: 'ពុំទទួលបានចម្លើយពី AI ទេ' });
    }

    const lessonPlanData = JSON.parse(rawJson);

    return res.status(200).json({
      success: true,
      meta: {
        subject,
        grade,
        chapter,
        lesson_title,
        duration: duration || 50,
        date: new Date().toLocaleDateString('km-KH')
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
