// api/export-docx.js - Vercel Serverless Function & Express compatible
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } = require('docx');

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
    const { meta, data } = req.body;

    if (!data || !meta) {
      return res.status(400).json({ error: 'ទិន្នន័យមិនគ្រប់គ្រាន់សម្រាប់ Export ជាឯកសារ Word ទេ!' });
    }

    const FONT_TITLE = 'Khmer OS Muol Light';
    const FONT_BODY = 'Khmer OS Siemreap';

    // បង្កើតជួរដេកសម្រាប់តារាងសកម្មភាពទាំង ៥ ជំហាន
    const tableRows = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 1400, type: WidthType.DXA },
            shading: { fill: 'E2E8F0' },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'ពេលវេលា', font: FONT_BODY, bold: true, size: 20 })] })]
          }),
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            shading: { fill: 'E2E8F0' },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'ខ្លឹមសារមេរៀន', font: FONT_BODY, bold: true, size: 20 })] })]
          }),
          new TableCell({
            width: { size: 2800, type: WidthType.DXA },
            shading: { fill: 'E2E8F0' },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'សកម្មភាពគ្រូ', font: FONT_BODY, bold: true, size: 20 })] })]
          }),
          new TableCell({
            width: { size: 2800, type: WidthType.DXA },
            shading: { fill: 'E2E8F0' },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'សកម្មភាពសិស្ស', font: FONT_BODY, bold: true, size: 20 })] })]
          })
        ]
      })
    ];

    if (data.steps && Array.isArray(data.steps)) {
      for (const step of data.steps) {
        // ចំណងជើងជំហាន
        tableRows.push(
          new TableRow({
            children: [
              new TableCell({
                columnSpan: 4,
                shading: { fill: 'EFF6FF' },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `📌 ${step.step_title} (${step.time_allocated})`,
                        font: FONT_BODY,
                        bold: true,
                        size: 20
                      })
                    ]
                  })
                ]
              })
            ]
          })
        );

        // សកម្មភាពក្នុងជំហាននីមួយៗ
        if (step.activities && Array.isArray(step.activities)) {
          for (const act of step.activities) {
            tableRows.push(
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 1400, type: WidthType.DXA },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: step.time_allocated || '', font: FONT_BODY, size: 19 })] })]
                  }),
                  new TableCell({
                    width: { size: 2600, type: WidthType.DXA },
                    children: [new Paragraph({ children: [new TextRun({ text: act.content || '', font: FONT_BODY, size: 19 })] })]
                  }),
                  new TableCell({
                    width: { size: 2800, type: WidthType.DXA },
                    children: [new Paragraph({ children: [new TextRun({ text: act.teacher_activity || '', font: FONT_BODY, size: 19 })] })]
                  }),
                  new TableCell({
                    width: { size: 2800, type: WidthType.DXA },
                    children: [new Paragraph({ children: [new TextRun({ text: act.student_activity || '', font: FONT_BODY, size: 19 })] })]
                  })
                ]
              })
            );
          }
        }
      }
    }

    const docChildren = [
      // ក្បាលទំព័រជាតិ និងសាលារៀន
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'ព្រះរាជាណាចក្រកម្ពុជា', font: FONT_TITLE, bold: true, size: 22 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'ជាតិ សាសនា ព្រះមហាក្សត្រ', font: FONT_TITLE, bold: true, size: 22 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: '---***---', font: FONT_BODY, size: 18 })]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `សាលារៀន៖ `, font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: `${meta.school_name || 'វិទ្យាល័យ ហ៊ុន សែន សេរីភាព'}`, font: FONT_BODY, size: 20 }),
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `គ្រូបង្រៀន៖ `, font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: `${meta.teacher_name || '...........................................'}       `, font: FONT_BODY, size: 20 }),
          new TextRun({ text: `កាលបរិច្ឆេទ៖ `, font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: `${meta.teaching_date || ''}`, font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({ text: '' }),

      // ចំណងជើងកិច្ចតែងការ
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'កិច្ចតែងការបង្រៀន', font: FONT_TITLE, bold: true, size: 26 })]
      }),
      new Paragraph({ text: '' }),

      // ព័ត៌មានទូទៅ
      new Paragraph({
        children: [
          new TextRun({ text: `មុខវិជ្ជា៖ `, font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: `${meta.subject || ''}       `, font: FONT_BODY, size: 20 }),
          new TextRun({ text: `ថ្នាក់ទី៖ `, font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: `${meta.grade || ''} ${meta.class_section ? `(${meta.class_section})` : ''}       `, font: FONT_BODY, size: 20 }),
          new TextRun({ text: `ម៉ោងបង្រៀន៖ `, font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: `${meta.period || 'ម៉ោងទី១'} (រយៈពេល ${meta.duration || 50} នាទី)`, font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `ជំពូកទី៖ `, font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: `${meta.chapter || ''}`, font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `មេរៀនទី / ចំណងជើង៖ `, font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: `${meta.lesson_title || ''}`, font: FONT_BODY, bold: true, size: 20 })
        ]
      })
    ];

    if (meta.sub_topics) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `ខ្លឹមសាររង / ចំណុចសំខាន់៖ `, font: FONT_BODY, bold: true, size: 20 }),
            new TextRun({ text: `${meta.sub_topics}`, font: FONT_BODY, size: 20 })
          ]
        })
      );
    }

    if (meta.teaching_method) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `វិធីសាស្ត្របង្រៀន៖ `, font: FONT_BODY, bold: true, size: 20 }),
            new TextRun({ text: `${meta.teaching_method}`, font: FONT_BODY, size: 20 })
          ]
        })
      );
    }

    if (meta.textbook_ref) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `ឯកសារយោង៖ `, font: FONT_BODY, bold: true, size: 20 }),
            new TextRun({ text: `${meta.textbook_ref}`, font: FONT_BODY, size: 20 })
          ]
        })
      );
    }

    docChildren.push(
      new Paragraph({ text: '' }),
      // វត្ថុបំណង
      new Paragraph({
        children: [new TextRun({ text: 'I. វត្ថុបំណង', font: FONT_TITLE, bold: true, size: 22 })]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: '• ចំណេះដឹង៖ ', font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: data.objectives?.knowledge || '', font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: '• បំណិន៖ ', font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: data.objectives?.skills || '', font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: '• ឥរិយាបថ៖ ', font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: data.objectives?.attitudes || '', font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({ text: '' }),

      // សម្ភារឧបទេស
      new Paragraph({
        children: [new TextRun({ text: 'II. សម្ភារឧបទេស និងបច្ចេកវិទ្យា', font: FONT_TITLE, bold: true, size: 22 })]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: '• សម្រាប់គ្រូ៖ ', font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: data.materials?.teacher || '', font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: '• សម្រាប់សិស្ស៖ ', font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: data.materials?.student || '', font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({ text: '' }),

      // ដំណើរការបង្រៀន
      new Paragraph({
        children: [new TextRun({ text: 'III. ដំណើរការបង្រៀន (ដំណាក់កាល ៥ ជំហាន)', font: FONT_TITLE, bold: true, size: 22 })]
      }),
      new Table({
        width: { size: 9600, type: WidthType.DXA },
        rows: tableRows
      })
    );

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1000,
                bottom: 1000,
                left: 1200,
                right: 1200
              }
            }
          },
          children: docChildren
        }
      ]
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="Lesson_Plan_${Date.now()}.docx"`);
    res.setHeader('Content-Length', buffer.length);
    return res.end(buffer);
  } catch (error) {
    console.error('Word Export Error:', error);
    return res.status(500).json({ error: error.message || 'បរាជ័យក្នុងការបង្កើតឯកសារ Word' });
  }
};
