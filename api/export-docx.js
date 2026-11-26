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

    // បង្កើតតារាងដំណើរការបង្រៀន ៣ ជួរឈរ (សកម្មភាពគ្រូ | ខ្លឹមសារមេរៀន | សកម្មភាពសិស្ស)
    const tableRows = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 3200, type: WidthType.DXA },
            shading: { fill: 'E5E7EB' },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'សកម្មភាពគ្រូ', font: FONT_BODY, bold: true, size: 20 })] })]
          }),
          new TableCell({
            width: { size: 3200, type: WidthType.DXA },
            shading: { fill: 'E5E7EB' },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'ខ្លឹមសារមេរៀន', font: FONT_BODY, bold: true, size: 20 })] })]
          }),
          new TableCell({
            width: { size: 3200, type: WidthType.DXA },
            shading: { fill: 'E5E7EB' },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'សកម្មភាពសិស្ស', font: FONT_BODY, bold: true, size: 20 })] })]
          })
        ]
      })
    ];

    if (data.steps && Array.isArray(data.steps)) {
      for (const step of data.steps) {
        // ចំណងជើងជំហាននីមួយៗ (Full width across 3 columns)
        tableRows.push(
          new TableRow({
            children: [
              new TableCell({
                columnSpan: 3,
                shading: { fill: 'F3F4F6' },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: step.step_title,
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

        // បញ្ចូលសកម្មភាពក្នុងជំហាន
        if (step.activities && Array.isArray(step.activities)) {
          for (const act of step.activities) {
            tableRows.push(
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 3200, type: WidthType.DXA },
                    children: [new Paragraph({ children: [new TextRun({ text: act.teacher_activity || '', font: FONT_BODY, size: 19 })] })]
                  }),
                  new TableCell({
                    width: { size: 3200, type: WidthType.DXA },
                    children: [new Paragraph({ children: [new TextRun({ text: act.content || '', font: FONT_BODY, size: 19 })] })]
                  }),
                  new TableCell({
                    width: { size: 3200, type: WidthType.DXA },
                    children: [new Paragraph({ children: [new TextRun({ text: act.student_activity || '', font: FONT_BODY, size: 19 })] })]
                  })
                ]
              })
            );
          }
        }
      }
    }

    // តារាងហត្ថលេខាផ្នែកខាងក្រោម (២ ប្រអប់ឆ្វេង-ស្ដាំ គ្មាន Border)
    const signTable = new Table({
      width: { size: 9600, type: WidthType.DXA },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE }
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 4800, type: WidthType.DXA },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'បានឃើញ និងឯកភាព', font: FONT_BODY, bold: true, size: 20 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'វិ.ហ.ស.សេរីភាព, ថ្ងៃទី.......ខែ.......... ឆ្នាំ២០២...', font: FONT_BODY, size: 19 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'នាយកសាលា', font: FONT_BODY, bold: true, size: 20 })] }),
                new Paragraph({ text: '' }),
                new Paragraph({ text: '' }),
                new Paragraph({ text: '' })
              ]
            }),
            new TableCell({
              width: { size: 4800, type: WidthType.DXA },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '', font: FONT_BODY, size: 20 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `វិ.ហ.ស.សេរីភាព, ថ្ងៃទី.......ខែ.......... ឆ្នាំ២០២...`, font: FONT_BODY, size: 19 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'ហត្ថលេខាគ្រូបង្រៀន', font: FONT_BODY, bold: true, size: 20 })] }),
                new Paragraph({ text: '' }),
                new Paragraph({ text: '' }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: meta.teacher_name ? `(${meta.teacher_name})` : '', font: FONT_BODY, size: 19 })] })
              ]
            })
          ]
        })
      ]
    });

    const docChildren = [
      // ចំណងជើងធំ
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'កិច្ចតែងការបង្រៀន', font: FONT_TITLE, bold: true, size: 26 })]
      }),
      new Paragraph({ text: '' }),

      // ព័ត៌មានក្បាលកិច្ចតែងការ
      new Paragraph({
        children: [
          new TextRun({ text: 'កាលបរិច្ឆេទ\t៖ ', font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: `${meta.date || ''}\t\t`, font: FONT_BODY, size: 20 }),
          new TextRun({ text: 'រយៈពេលបង្រៀន\t៖ ', font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: `${meta.duration || 50} នាទី`, font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'មុខវិជ្ជា\t\t៖ ', font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: `${meta.subject || ''}\t\t`, font: FONT_BODY, size: 20 }),
          new TextRun({ text: 'ថ្នាក់ទី\t\t៖ ', font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: `${meta.grade || ''}`, font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'ជំពូកទី\t\t៖ ', font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: `${meta.chapter || ''}`, font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'មេរៀនទី\t\t៖ ', font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: `${meta.lesson_title || ''}`, font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'ផ្នែកទី\t\t៖ ', font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: `${meta.section || 'ចំណុចសំខាន់'}`, font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'ទំព័រ\t\t៖ ', font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: `${meta.page || 'តាមសៀវភៅពុម្ព'}`, font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'វិធីសាស្ត្របង្រៀន\t៖ ', font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: `${meta.teaching_method || 'វិធីសាស្ត្រសិស្សមជ្ឈមណ្ឌល'}`, font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({ text: '' }),

      // វត្ថុបំណងនៃមេរៀន
      new Paragraph({
        children: [new TextRun({ text: 'វត្ថុបំណងនៃមេរៀន', font: FONT_TITLE, bold: true, size: 22 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: 'បន្ទាប់ពីបញ្ចប់មេរៀន សិស្សនឹងអាច៖', font: FONT_BODY, italic: true, size: 20 })]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'វិជ្ជាសម្បទា\t៖ ', font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: data.objectives?.knowledge || '', font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'បំណិនសម្បទា\t៖ ', font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: data.objectives?.skills || '', font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'ចរិយាសម្បទា\t៖ ', font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: data.objectives?.attitudes || '', font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({ text: '' }),

      // សម្ភារឧបទេស
      new Paragraph({
        children: [new TextRun({ text: 'សម្ភារឧបទេស', font: FONT_TITLE, bold: true, size: 22 })]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'គ្រូ\t៖ ', font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: meta.materials_teacher || data.materials?.teacher || 'សៀវភៅពុម្ព, ស្លាយមេរៀន, កុំព្យូទ័រ ហ្វឺត', font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'សិស្ស\t៖ ', font: FONT_BODY, bold: true, size: 20 }),
          new TextRun({ text: meta.materials_student || data.materials?.student || 'សៀវភៅពុម្ព កុំព្យូទ័រ ប៊ិច សៀវភៅសរសេរ', font: FONT_BODY, size: 20 })
        ]
      }),
      new Paragraph({ text: '' }),

      // ដំណើរការបង្រៀន
      new Paragraph({
        children: [new TextRun({ text: 'ដំណើរការបង្រៀន', font: FONT_TITLE, bold: true, size: 22 })]
      }),
      new Table({
        width: { size: 9600, type: WidthType.DXA },
        rows: tableRows
      }),
      new Paragraph({ text: '' }),
      new Paragraph({ text: '' }),

      // ហត្ថលេខា
      signTable
    ];

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
