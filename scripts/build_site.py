#!/usr/bin/env python3
"""Render repository study content into standalone GitHub Pages HTML."""
from html import escape, unescape
import os
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit, urlunsplit
import xml.etree.ElementTree as ET

import markdown
from markdown.treeprocessors import Treeprocessor
from markdown.extensions import Extension

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs'
SOURCES = sorted(ROOT.glob('*.md')) + sorted((ROOT / 'examples').rglob('*.md'))
MANIFESTS = sorted((ROOT / 'examples').rglob('*.yaml'))
PAGES = {p: DOCS / 'guides' / (p.stem.lower().replace('_', '-') + '.html') for p in SOURCES if p.parent == ROOT}
PAGES.update({p: DOCS / p.relative_to(ROOT).with_suffix('.html') for p in SOURCES if p.parent != ROOT})
PAGES.update({p: DOCS / p.relative_to(ROOT).with_suffix('.html') for p in MANIFESTS})
FOLDERS = sorted(p for p in (ROOT / 'examples').iterdir() if p.is_dir())
PAGES.update({p: DOCS / p.relative_to(ROOT) / 'index.html' for p in FOLDERS})
PAGES[ROOT / 'examples'] = DOCS / 'examples' / 'index.html'
PAGES[DOCS] = DOCS / 'index.html'
# The examples overview also serves as the folder landing page.
PAGES[ROOT / 'examples' / 'README.md'] = DOCS / 'examples' / 'index.html'


def relative(target, output):
    return Path(os.path.relpath(target, output.parent)).as_posix()


def slug(value, separator):
    """Match GitHub heading fragments, including the two hyphens around &."""
    value = re.sub(r'[^\w\-\s]', '', value.lower())
    return re.sub(r'\s', separator, value.strip())


def resolve(value, source):
    parts = urlsplit(value)
    if parts.scheme or parts.netloc:
        prefix = 'https://github.com/YISUSVII/kubernetes-study/'
        if value.startswith(prefix + 'blob/main/') or value.startswith(prefix + 'tree/main/'):
            path = parts.path.split('/main/', 1)[1]
            target = ROOT / unquote(path)
        else:
            return None
    elif not parts.path:
        return None
    else:
        target = (source.parent / unquote(parts.path)).resolve()
    return target if target in PAGES else None


class SiteLinks(Treeprocessor):
    def run(self, tree):
        source, output = self.md.site_source, self.md.site_output
        for link in tree.iter('a'):
            href = link.get('href', '')
            target = resolve(href, source)
            if target:
                parts = urlsplit(href)
                link.set('href', urlunsplit(('', '', relative(PAGES[target], output), parts.query, parts.fragment)))
        # Study guides often reference files as inline code rather than links.
        for parent in list(tree.iter()):
            for child in list(parent):
                if child.tag != 'code' or parent.tag in ('pre', 'a') or not child.text:
                    continue
                value = child.text
                candidates = [(source.parent / value).resolve(), (ROOT / value).resolve(), (ROOT / 'examples' / value).resolve()]
                target = next((p for p in candidates if p in PAGES), None)
                if target is None:
                    matches = [p for p in PAGES if p.name == value]
                    target = matches[0] if len(matches) == 1 else None
                if target:
                    link = ET.Element('a', {'href': relative(PAGES[target], output)})
                    index = list(parent).index(child)
                    link.tail, child.tail = child.tail, None
                    parent.remove(child)
                    link.append(child)
                    parent.insert(index, link)
        for heading in tree.iter('h3'):
            match = re.match(r'Path (\d+):', ''.join(heading.itertext()))
            if match:
                ET.SubElement(heading, 'span', {'id': 'path-' + match[1], 'class': 'path-anchor', 'aria-hidden': 'true'})


class SiteExtension(Extension):
    def extendMarkdown(self, md):
        md.treeprocessors.register(SiteLinks(md), 'site-links', 1)


def shell(title, body, output, toc=''):
    home = relative(DOCS / 'index.html', output)
    css = relative(DOCS / 'assets' / 'style.css', output)
    reader_css = relative(DOCS / 'assets' / 'reader.css', output)
    js = relative(DOCS / 'assets' / 'reader.js', output)
    study = relative(PAGES[ROOT / 'STUDY_GUIDE.md'], output)
    examples = relative(PAGES[ROOT / 'examples'], output)
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{escape(title)} · K8s Study</title>
<link rel="stylesheet" href="{css}" />
<link rel="stylesheet" href="{reader_css}" />
<script src="{js}" defer></script>
</head>
<body>
<div class="bg-fx" aria-hidden="true"></div>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><nav class="nav container" aria-label="Main navigation">
<a class="brand" href="{home}"><span class="brand-mark">⎈</span><span>K8s Study<span class="brand-year">.2026</span></span></a>
<div class="reader-nav"><a href="{study}">Study guide</a><a href="{examples}">Examples</a><button id="themeToggle" class="btn btn-ghost" type="button" aria-label="Toggle light/dark theme">Theme</button></div>
</nav></header>
<div class="container reader-breadcrumb"><a href="{home}">Home</a><span aria-hidden="true"> / </span><span>{escape(title)}</span></div>
<div class="container reader-layout{' has-toc' if toc else ''}">
<main id="main" class="reader-content">{body}</main>
{f'<aside class="reader-toc"><details open><summary>On this page</summary>{toc}</details></aside>' if toc else ''}
</div>
<footer class="site-footer"><div class="container footer-inner"><a href="{home}#paths">← Learning paths</a><a href="#main">Back to top ↑</a></div></footer>
</body>
</html>
'''


def write(output, content):
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(content, encoding='utf-8')


def build():
    for source in SOURCES:
        output = PAGES[source]
        md = markdown.Markdown(extensions=['fenced_code', 'tables', 'sane_lists', 'toc', SiteExtension()], extension_configs={'toc': {'slugify': slug, 'toc_depth': '2-3'}})
        md.site_source, md.site_output = source, output
        body = md.convert(source.read_text(encoding='utf-8'))
        title_match = re.search(r'<h1[^>]*>(.*?)</h1>', body, re.S)
        title = unescape(re.sub('<[^>]+>', '', title_match[1])) if title_match else source.stem
        write(output, shell(title, body, output, md.toc if md.toc_tokens else ''))
    for folder in FOLDERS:
        output = PAGES[folder]
        items = []
        for source in sorted(folder.iterdir()):
            if source in PAGES and source.is_file():
                items.append(f'<li><a href="{relative(PAGES[source], output)}">{escape(source.name)}</a></li>')
        body = f'<h1>{escape(folder.name)} examples</h1><p>Open a manifest to read its YAML or download it for your lab.</p><ul class="manifest-list">{"".join(items)}</ul>'
        write(output, shell(folder.name + ' examples', body, output))
    for source in MANIFESTS:
        output = PAGES[source]
        download = output.with_suffix('.yaml')
        download.write_bytes(source.read_bytes())
        body = f'<h1>{escape(source.name)}</h1><p><a href="index.html">← {escape(source.parent.name)} examples</a></p><div class="manifest-actions"><a class="btn btn-outline" href="{download.name}" download>Download YAML</a><button class="btn btn-outline" type="button" data-copy-code>Copy YAML</button><span role="status" id="copyStatus"></span></div><pre><code>{escape(source.read_text(encoding="utf-8"))}</code></pre>'
        write(output, shell(source.name, body, output))
    # Include technology folder navigation in the existing examples overview.
    overview = PAGES[ROOT / 'examples']
    text = overview.read_text(encoding='utf-8')
    links = ''.join(f'<li><a href="{relative(PAGES[p], overview)}">{escape(p.name)}</a></li>' for p in FOLDERS)
    text = text.replace('<main id="main" class="reader-content">', '<main id="main" class="reader-content"><nav aria-label="Example collections"><h2>Example collections</h2><ul class="manifest-list">' + links + '</ul></nav>')
    overview.write_text(text, encoding='utf-8')
    print(f'Built {len(SOURCES)} guides, {len(FOLDERS)} example collections, and {len(MANIFESTS)} manifest pages.')


if __name__ == '__main__':
    build()
