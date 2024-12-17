import PDFDocument from 'pdfkit';

interface StudentGrade {
  courseCode: string;
  courseName: string;
  credits: number;
  grade: number;
  semester: string;
}

interface StudentInfo {
  firstName: string;
  lastName: string;
  studentId: string;
  academicYear: string;
}

interface SemesterSummary {
  semester: string;
  grades: StudentGrade[];
  average: number;
  totalCredits: number;
  validatedCredits: number;
}

export class PDFService {
  private static organizeBySemester(grades: StudentGrade[]): SemesterSummary[] {
    const semesters = grades.reduce((acc, grade) => {
      if (!acc[grade.semester]) {
        acc[grade.semester] = [];
      }
      acc[grade.semester].push(grade);
      return acc;
    }, {} as Record<string, StudentGrade[]>);

    return Object.entries(semesters)
      .map(([semester, semesterGrades]) => {
        const totalCredits = semesterGrades.reduce(
          (sum, g) => sum + g.credits,
          0
        );
        const weightedSum = semesterGrades.reduce(
          (sum, g) => sum + g.grade * g.credits,
          0
        );
        const validatedCredits = semesterGrades.reduce(
          (sum, g) => sum + (g.grade >= 10 ? g.credits : 0),
          0
        );

        return {
          semester,
          grades: semesterGrades,
          average: weightedSum / totalCredits,
          totalCredits,
          validatedCredits,
        };
      })
      .sort((a, b) => a.semester.localeCompare(b.semester));
  }

  static async generateTranscript(
    studentInfo: StudentInfo,
    grades: StudentGrade[]
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const chunks: Buffer[] = [];
        const doc = new PDFDocument({ margin: 50 });

        doc.on('data', chunks.push.bind(chunks));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // En-tête
        doc
          .fontSize(20)
          .text('IUT de Laval', { align: 'center' })
          .moveDown()
          .fontSize(16)
          .text('Relevé de notes', { align: 'center' })
          .moveDown();

        // Informations étudiant
        doc
          .fontSize(12)
          .text(`Étudiant: ${studentInfo.firstName} ${studentInfo.lastName}`)
          .text(`Numéro étudiant: ${studentInfo.studentId}`)
          .text(`Année universitaire: ${studentInfo.academicYear}`)
          .moveDown();

        // Organisation par semestre
        const semesterSummaries = this.organizeBySemester(grades);
        const colWidths = [80, 200, 70, 70];
        const startX = 50;

        semesterSummaries.forEach((semester) => {
          doc
            .fontSize(14)
            .text(`Semestre ${semester.semester}`, startX)
            .moveDown();

          // Tableau des notes
          const tableTop = doc.y;
          const headers = ['Code', 'Cours', 'Crédits', 'Note'];
          const lineHeight = 20;

          // En-tête du tableau
          let x = startX;
          headers.forEach((header, i) => {
            doc
              .text(header, x, tableTop)
              .underline(x, tableTop + 15, colWidths[i], 1);
            x += colWidths[i];
          });

          // Contenu du tableau
          let y = tableTop + 20;
          semester.grades.forEach((grade) => {
            x = startX;
            doc
              .text(grade.courseCode, x, y)
              .text(grade.courseName, (x += colWidths[0]), y)
              .text(grade.credits.toString(), (x += colWidths[1]), y)
              .text(Number(grade.grade).toFixed(2), (x += colWidths[2]), y);
            y += lineHeight;
          });

          // Résumé du semestre
          const summaryX = startX + colWidths[0] + colWidths[1];
          doc
            .moveDown(2)
            .text(
              `Moyenne du semestre: ${semester.average.toFixed(2)}/20`,
              summaryX
            )
            .text(
              `Crédits validés: ${semester.validatedCredits}/${semester.totalCredits} ECTS`,
              summaryX
            )
            .moveDown();
        });

        // Signature
        doc
          .moveDown(2)
          .text(
            `Fait à Laval, le ${new Date().toLocaleDateString('fr-FR')}`,
            startX
          )
          .moveDown()
          .text('Le Directeur des Études', startX);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
