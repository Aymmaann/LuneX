import { useContext, useState } from 'react';
import { GeminiContext } from '@/context/GeminiContext';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import getResponse from '@/config/gemini';
import { uploadPDFToS3 } from '@/utils/s3Upload';

const CryptoReportGenerator = () => {
  const { savedCryptos } = useContext(GeminiContext);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateAnalysisContent = async () => {
    const cryptoSummary = savedCryptos.map(crypto => {
      return `
        Name: ${crypto.name} (${crypto.symbol.toUpperCase()})
        Current Price: $${crypto.current_price.float || crypto.current_price}
        Price Change: ${crypto.price_change_percentage}%
        Risk Score: ${crypto.risk_score}/10
        Volatility: ${crypto.volatility_score}
        Recommendation: ${crypto.recommendation}
        Investment Score: ${crypto.investment_score}/10
        ${crypto.performance_category ? `Performance Category: ${crypto.performance_category}` : ''}
        ${crypto.monitoring_duration ? `Monitoring Duration: ${crypto.monitoring_duration}` : ''}
      `;
    }).join('\n\n');

    const userName = JSON.parse(localStorage.getItem('user-info')).name
    const prompt = `
        You are FinBot, an expert financial analyst in the crypto market.

        Create a professional cryptocurrency investment report for the user **${userName}** on behalf of the app **LuneX**.

        Use the following format:
        - No need to add "LuneX Crypto Monitoring Report", "Insights by", or the date — that’s handled elsewhere.
        - Just include the core content starting from the executive summary.

        You are analyzing this portfolio:

        ${cryptoSummary}

        Structure the report in this markdown format:

        1. # Executive Summary
        2. # Individual Asset Analysis
        - For each asset, include:
            - Price analysis
            - Risk assessment
            - Growth potential
            - Recommendation
        3. # Portfolio Diversification
        4. # Market Trend Analysis
        5. # Future Outlook
        6. # Action Items

        Use:
        - Markdown syntax: **bold**, *italic*, bullet points (-), headers (#, ##)
        - Keep tone professional, analytical, clear, and data-driven.

        Do not restate your name or the user's name at the top.
    `;

    // Get the analysis from Gemini
    setProgress(30);
    const analysis = await getResponse(prompt);
    setProgress(60);
    console.log(analysis);
    return analysis;
  };

  const parseMarkdownLine = (line) => {
    const regex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|[^*]+)/g;
    const parts = [];
    let match;
  
    while ((match = regex.exec(line)) !== null) {
      const raw = match[0];
      let fontType = 'regular';
      let text = raw;
  
      if (/^\*\*\*[^*]+\*\*\*$/.test(raw)) {
        fontType = 'boldItalic';
        text = raw.slice(3, -3);
      } else if (/^\*\*[^*]+\*\*$/.test(raw)) {
        fontType = 'bold';
        text = raw.slice(2, -2);
      } else if (/^\*[^*]+\*$/.test(raw)) {
        fontType = 'italic';
        text = raw.slice(1, -1);
      }
      parts.push({ text, fontType });
    }
    return parts;
  };
  
  const generatePDF = async (content) => {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const margin = 50;

    // Embed fonts
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman); 
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold); 
    const italicFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic); 
    const boldItalicFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic); 


    // Add title
    page.drawText('LuneX Crypto Monitoring Report', {
      x: margin,
      y: height - margin - 20,
      size: 24,
      font: boldFont,
      color: rgb(0, 0, 0.7),
    });

    // Add by line
    page.drawText(`Insights by: FinBot`, {
      x: margin,
      y: height - margin - 40,
      size: 12,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Add date
    const currentDate = new Date().toLocaleDateString();
    page.drawText(`Generated on: ${currentDate}`, {
      x: margin,
      y: height - margin - 60,
      size: 12,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });

    const contentLines = content.split('\n');
    let yPosition = height - margin - 70;
    const lineHeight = 16;
    const fontSize = 12;
    const headingFontSize = 18;
    const subHeadingFontSize = 14;

    for (let i = 0; i < contentLines.length; i++) {
      let line = contentLines[i];
      let currentFont = font;
      let currentSize = fontSize;
      let lineSpacing = lineHeight;
      let isBoldLine = false;

      if (line.startsWith('# ')) {
        currentFont = boldFont;
        currentSize = headingFontSize;
        line = line.replace(/^# /, '');
        yPosition -= 10;
      } else if (line.startsWith('## ')) {
        currentFont = boldFont;
        currentSize = subHeadingFontSize;
        line = line.replace(/^## /, '');
        yPosition -= 5;
      } else if (line.startsWith('### ')) {
        currentFont = boldFont;
        currentSize = subHeadingFontSize; 
        line = line.replace(/^### /, '');
        yPosition -= 5;
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        line = `  • ${line.substring(2)}`;
      } else if (line.startsWith('---')) {
        page.drawLine({
          start: { x: margin, y: yPosition + 5 },
          end: { x: width - margin, y: yPosition + 5 },
          thickness: 1,
          color: rgb(0.5, 0.5, 0.5),
        });
        yPosition -= 15;
        continue;
      } else if (line.startsWith('**') && line.endsWith('**')) {
        currentFont = boldFont;
        line = line.replace(/^\*\*|\*\*$/g, '');
        isBoldLine = true; // Flag to maintain regular size for full bold lines
      } else if (line.startsWith('*') && line.endsWith('*')) {
        currentFont = italicFont || font;
        line = line.replace(/^\*|\*$/g, '');
      }

      const words = line.split(' ');
      let lineBuffer = '';

      const parsedParts = parseMarkdownLine(line);
    let xPosition = margin + (line.startsWith('  •') ? 10 : 0);

    for (const part of parsedParts) {
        let selectedFont = font;
        if (part.fontType === 'bold') selectedFont = boldFont;
        else if (part.fontType === 'italic') selectedFont = italicFont;
        else if (part.fontType === 'boldItalic') selectedFont = boldItalicFont;

        const result = splitAndDrawText(
            part.text,
            selectedFont,
            currentSize,
            xPosition,
            yPosition,
            page,
            pdfDoc,
            width,
            margin,
            lineHeight
        );

        xPosition = result.x;
        yPosition = result.yPos;
        page = result.page;
    }

        yPosition -= lineHeight;
        if (yPosition < margin) {
            page = pdfDoc.addPage();
            yPosition = height - margin;
        }

      if (lineBuffer) {
        page.drawText(lineBuffer, {
          x: margin + (line.startsWith('  •') ? 10 : 0),
          y: yPosition,
          size: currentSize,
          font: currentFont,
          color: rgb(0, 0, 0),
        });
        yPosition -= lineSpacing;
      }

      yPosition -= 2;

      if (yPosition < margin) {
        page = pdfDoc.addPage();
        yPosition = height - margin;
      }
    }

    const lastPage = pdfDoc.getPages()[pdfDoc.getPages().length - 1];
    lastPage.drawText(`Portfolio Summary: ${savedCryptos.length} cryptocurrencies monitored`, {
      x: margin,
      y: margin / 2,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  };

  const splitAndDrawText = (text, fontObj, fontSize, xStart, yPos, page, pdfDoc, width, margin, lineHeight) => {
    const words = text.split(' ');
    let x = xStart;
  
    for (let word of words) {
      const wordWidth = fontObj.widthOfTextAtSize(word + ' ', fontSize);
  
      if (x + wordWidth > width - margin) {
        yPos -= lineHeight;
        x = xStart;
        if (yPos < margin) {
          page = pdfDoc.addPage();
          yPos = page.getSize().height - margin;
        }
      }
  
      page.drawText(word + ' ', {
        x,
        y: yPos,
        size: fontSize,
        font: fontObj,
        color: rgb(0, 0, 0),
      });
  
      x += wordWidth;
    }
  
    return { x, yPos, page };
  };
  
  const handleGenerateReport = async () => {
    if (savedCryptos.length === 0) {
      alert('You need to have saved cryptocurrencies to generate a report.');
      return;
    }

    setIsGenerating(true);
    setProgress(10);
    
    try {
      const analysisContent = await generateAnalysisContent();
      
      setProgress(80);
      const pdfBytes = await generatePDF(analysisContent);
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, 'Crypto_Investment_Report.pdf');

      const user = JSON.parse(localStorage.getItem('user-info'));
      const fileName = `Crypto_Investment_Report_${Date.now()}.pdf`;
      await uploadPDFToS3(blob, fileName, user.email);
      setProgress(100);

      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate or upload report. Please try again later.');
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleGenerateReport}
        disabled={isGenerating}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
          isGenerating 
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 text-zinc-100 hover:bg-blue-700'
        }`}
      >
        {isGenerating ? 'Generating Report...' : 'Generate PDF Report'}
      </button>
      
      {isGenerating && (
        <div className="mt-3 w-full max-w-md">
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-zinc-400 mt-1 text-center">
            {progress < 30 && 'Analyzing your portfolio...'}
            {progress >= 30 && progress < 60 && 'Generating insights...'}
            {progress >= 60 && progress < 80 && 'Creating report...'}
            {progress >= 80 && progress < 100 && 'Preparing download...'}
            {progress === 100 && 'Download ready!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CryptoReportGenerator;