export function handleExport(files, jsPDF) {
  const normalizeText = (str) => str.replace(/\u00A0/g, " ").normalize("NFKC");

  const doc = new jsPDF();

  const x = 15;
  let y = 20;
  const lineSpacing = 5;
  const paragraphSpacing = 3;

  Object.values(files).map((file) => {
    doc.setFontSize(14);
    doc.setFont("LiberationSansBold", "bold");
    const fileNameText = `${normalizeText(file.name)}:`;
    const splitFileName = doc.splitTextToSize(fileNameText, 180);

    doc.text(splitFileName, x - 5, y);
    y += splitFileName.length * lineSpacing;
    y += paragraphSpacing;
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setFont("LiberationSans-BaDn", "normal");
    doc.text("Streszczenie: ", x, y);
    y += paragraphSpacing * 2;
    const fileDescriptionText = normalizeText(file.description);
    const maxWidthDescription = 200;
    const splitFileDescription = doc.splitTextToSize(
      fileDescriptionText,
      maxWidthDescription
    );

    doc.setFont("LiberationSansItalic-RJre", "italic");
    doc.setFontSize(10);
    doc.text(splitFileDescription, x + 5, y);
    y += splitFileDescription.length * lineSpacing;

    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    if (file.messages && file.messages.length > 1) {
      doc.setFontSize(12);
      doc.setFont("LiberationSans-BaDn", "normal");
      doc.text("Historia czatu:", x, y);
      y += paragraphSpacing * 2;
      doc.setFontSize(10);
      file.messages.slice(1).forEach((message) => {
        const new_x = message.sender === "ai" ? x + 20 : x + 5;
        if (message.sender === "ai") {
          doc.setFont("LiberationSansItalic-RJre", "italic");
        } else {
          if (y > 260) {
            doc.addPage();
            y = 20;
          }
          doc.setFont("LiberationSans-BaDn", "normal");
        }
        const messageContent = normalizeText(message.text);

        const splitMessage = doc.splitTextToSize(messageContent, 160);

        doc.text(splitMessage, new_x, y);
        y += splitMessage.length * lineSpacing;
        y += paragraphSpacing;
      });
      y += paragraphSpacing * 2;
    }

    if (y > 260) {
      doc.addPage();
      y = 20;
    }
  });
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("pl-PL");
  doc.save(`Wielik_streszczenie_${formattedDate}.pdf`);
}
