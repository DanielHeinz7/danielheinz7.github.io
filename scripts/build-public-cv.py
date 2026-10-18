"""Generate the website CV from its public profile and publication record."""
from pathlib import Path
from html import escape
import json
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, PageBreak, KeepTogether

root = Path(__file__).resolve().parents[1]
profile = json.loads((root / 'src/data/profile.json').read_text())
publications = json.loads((root / 'src/data/cv-publications.json').read_text())
projects = json.loads((root / 'src/data/projects.json').read_text())
researchers = json.loads((root / 'src/data/doctoral-research.json').read_text())
for name, weight in [('Schibsted', '400'), ('SchibstedBold', '700')]:
    pdfmetrics.registerFont(TTFont(name, str(root / f'public/fonts/schibsted-{weight}.ttf')))
pdfmetrics.registerFontFamily('Schibsted', normal='Schibsted', bold='SchibstedBold')
ink = colors.HexColor('#151C18')
green = colors.HexColor('#56695A')
styles = {
    'name': ParagraphStyle('name', fontName='SchibstedBold', fontSize=26, leading=30, textColor=ink, spaceAfter=10),
    'section': ParagraphStyle('section', fontName='SchibstedBold', fontSize=13, leading=17, textColor=green, spaceBefore=19, spaceAfter=9, keepWithNext=True),
    'body': ParagraphStyle('body', fontName='Schibsted', fontSize=10.5, leading=14.5, textColor=ink, spaceAfter=7),
    'small': ParagraphStyle('small', fontName='Schibsted', fontSize=9, leading=13, textColor=green, spaceAfter=7),
}
styles['publication'] = ParagraphStyle('publication', parent=styles['body'], spaceAfter=2)
output = root / 'public/files/daniel-heinz-cv.pdf'
output.parent.mkdir(parents=True, exist_ok=True)
def p(text, style='body'):
    return Paragraph(text, styles[style])
def section(title):
    return p(escape(title), 'section')
def item(row):
    return KeepTogether([p(f'<b>{escape(row["date"])} · {escape(row["title"])}</b><br/>{escape(row["place"])}' + (f'<br/>{escape(row["note"])}' if row.get('note') else ''))])
def citation_details(paper):
    details = paper['venue']
    if paper.get('volume'):
        details += ' ' + paper['volume']
        if paper.get('issue'):
            details += '(' + paper['issue'] + ')'
    if paper.get('pages'):
        details += ', ' + paper['pages']
    elif paper.get('article_number'):
        details += ', Article ' + paper['article_number']
    details += ' · ' + str(paper['year'])
    if paper['status'] != 'published':
        details += ' · ' + paper['status'].capitalize()
    return details
flow = [p(profile['name'], 'name'), p(escape(profile['role'])+'<br/>'+escape(profile['institution'])), p('Curriculum vitae · '+profile['updated'], 'small'), p(f'<link href="mailto:{profile["email"]}">{profile["email"]}</link> · <link href="{profile["profileUrl"]}">Institutional profile</link> · <link href="https://daniel-heinz.de/cv/">Read this CV online</link>', 'small'), section('Research'), p(escape(profile['agenda'])), p(escape(profile['approach'])), section('Academic appointments')]
flow.extend(item(row) for row in profile['appointments'])
flow.append(section('Education'))
flow.extend(item(row) for row in profile['education'])
flow.extend([p(escape(profile['visits'])), section('Academic service'), p('<br/>'.join(escape(row) for row in profile['service'])), section('Volunteering'), p(escape(profile['outsideWork'])), PageBreak()])
flow.extend([section('Selected funded projects'), p(escape(profile['funding']))])
for project in projects:
    flow.append(KeepTogether([
        p(f'<b><link href="{project["url"]}">{escape(project["name"])}</link></b> · {escape(project["period"])}<br/>{escape(project["funding"])}'),
        p(escape(project['question'])+'<br/>'+escape(project['role'])),
    ]))
flow.extend([section('Doctoral research'), p('I provide day-to-day research advising. Prof. Gerhard Satzger provides formal doctoral supervision for the projects below.')])
for researcher in researchers:
    flow.append(p(f'<b><link href="{researcher["url"]}">{escape(researcher["name"])}</link></b> · {escape(researcher["since"])}<br/>{escape(researcher["topic"])}'))
flow.append(PageBreak())
for heading, papers in [('Journal articles', publications['journal_articles']), ('Selected conference papers', publications['selected_conference_papers'])]:
    if papers:
        if heading == 'Selected conference papers':
            flow.append(PageBreak())
        flow.append(section(heading))
        for paper in papers:
            flow.append(KeepTogether([p('<b>'+escape(paper['title'])+'</b><br/>'+escape(paper['full_authors'])+'<br/>'+escape(citation_details(paper)), 'publication'),p(f'<link href="{paper["url"]}">{paper["url"]}</link>', 'small')]))
flow.append(section('Teaching and advising'))
for row in profile['teaching']:
    flow.append(p('<b>'+escape(row['title'])+'</b><br/>'+escape(row['context'])))
flow.append(p(escape(profile['advising'])))
def footer(canvas, doc):
    canvas.setStrokeColor(green)
    canvas.setLineWidth(.5)
    canvas.line(46, 39, A4[0]-46, 39)
    canvas.setFont('Schibsted', 8)
    canvas.setFillColor(green)
    canvas.drawString(46, 25, 'Daniel Heinz · Curriculum vitae')
    canvas.drawRightString(A4[0]-46, 25, str(doc.page))
doc = SimpleDocTemplate(str(output), pagesize=A4, rightMargin=46, leftMargin=46, topMargin=42, bottomMargin=54, title='Daniel Heinz — Curriculum vitae', author='Daniel Heinz')
doc.build(flow, onFirstPage=footer, onLaterPages=footer)
print(output.relative_to(root))
