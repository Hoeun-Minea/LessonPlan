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
            width: { size: 1500, type: WidthType.DXA },
            shading: { fill: 'EFEFEF' },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'ពេលវេលា', font: FONT_BODY, bold: true, size: 20 })] })]
          }),
          new TableCell({
            width: { size: 2500, type: WidthType.DXA },
            shading: { fill: 'EFEFEF' },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'ខ្លឹមសារមេរៀន', font: FONT_BODY, bold: true, size: 20 })] })]
          }),
          new TableCell({
            width: { size: 2800, type: WidthType.DXA },
            shading: { fill: 'EFEFEF' },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'សកម្មភាពគ្រូ', font: FONT_BODY, bold: true, size: 20 })] })]
          }),
          new TableCell({
            width: { size: 2800, type: WidthType.DXA },
            shading: { fill: 'EFEFEF' },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'សកម្មភាពសិស្ស', font: FONT_BODY, bold: true, size: 20 })] })]
          })
        ]
      })
    ];

    if (data.steps && Array.isArray(data.steps)) {
      for (const step of data.steps) {
        // ចំណងជើងជំហាន (Row បញ្ចូល ៤ Cells)
        tableRows.push(
          new TableRow({
            children: [
              new TableCell({
                columnSpan: 4,
                shading: { fill: 'F3F4F6' },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${step.step_title} (${step.time_allocated})`,
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

        // បញ្ចូលសកម្មភាពនីមួយៗក្នុងជំហាន
        if (step.activities && Array.isArray(step.activities)) {
          for (const act of step.activities) {
            tableRows.push(
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 1500, type: WidthType.DXA },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: step.time_allocated || '', font: FONT_BODY, size: 19 })] })]
                  }),
                  new TableCell({
                    width: { size: 2500, type: WidthType.DXA },
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
          children: [
            // ក្បាលទំព័រជាតិ
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
              children: [new TextRun({ text: '---***---', font: FONT_BODY, size: 20 })]
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
                new TextRun({ text: `${meta.grade || ''}       `, font: FONT_BODY, size: 20 }),
                new TextRun({ text: `រយៈពេល៖ `, font: FONT_BODY, bold: true, size: 20 }),
                new TextRun({ text: `${meta.duration || 50} នាទី`, font: FONT_BODY, size: 20 })
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
                new TextRun({ text: `${meta.lesson_title || ''}`, font: FONT_BODY, size: 20 })
              ]
            }),
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
              children: [new TextRun({ text: 'II. សម្ភារឧបទេស', font: FONT_TITLE, bold: true, size: 22 })]
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
          ]
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
