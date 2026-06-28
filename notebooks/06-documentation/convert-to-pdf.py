from markdown_pdf import MarkdownPdf, Section

# Initialize the PDF converter
pdf = MarkdownPdf(toc_level=2)

# Read your Markdown file content
with open("capstone-project-report.md", "r", encoding="utf-8") as f:
    md_content = f.read()

# Add the Markdown content as a section to the PDF
pdf.add_section(Section(md_content))

# Save the generated PDF file
pdf.save("output.pdf")
