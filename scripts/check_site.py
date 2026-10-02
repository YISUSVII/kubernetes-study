#!/usr/bin/env python3
"""Check static and JavaScript-rendered site links, anchors, and YAML downloads."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import subprocess
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links = []
        self.ids = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag in ('a', 'link') and 'href' in attrs:
            self.links.append(attrs['href'])
        if tag == 'script' and 'src' in attrs:
            self.links.append(attrs['src'])


def check():
    pages = {p: Page(p.read_text(encoding='utf-8')) for p in DOCS.rglob('*.html')}
    # Execute the actual home-page renderers to include their dynamically built links.
    js = '''
const fs = require('fs');
const vm = require('vm');
const nodes = {};
const context = {document: {
  addEventListener() {},
  getElementById(id) { return nodes[id] ||= {innerHTML: '', querySelectorAll() { return []; }}; },
  querySelector(selector) { return this.getElementById(selector); }
}};
vm.createContext(context);
vm.runInContext(fs.readFileSync('docs/assets/script.js', 'utf8'), context);
vm.runInContext('observeReveal = () => {}; renderTechGrid(); renderPaths(); renderVersionTable(); renderDeprecations(); renderExamples();', context);
process.stdout.write(Object.values(nodes).map(n => n.innerHTML).join(''));
'''
    rendered = subprocess.run(['node', '-e', js], cwd=ROOT, capture_output=True, text=True, check=True).stdout
    homepage = pages[DOCS / 'index.html']
    homepage.feed(rendered)
    errors = []
    for path, page in pages.items():
        for identifier, count in Counter(page.ids).items():
            if count > 1:
                errors.append(f'{path.relative_to(DOCS)}: duplicate ID {identifier}')
        for href in page.links:
            url = urlsplit(href)
            if url.scheme or url.netloc:
                if href.startswith('https://github.com/YISUSVII/kubernetes-study/blob/') or href.startswith('https://github.com/YISUSVII/kubernetes-study/tree/'):
                    errors.append(f'{path.relative_to(DOCS)}: content still opens GitHub: {href}')
                continue
            target = (path.parent / unquote(url.path)).resolve() if url.path else path
            if target.is_dir():
                target /= 'index.html'
            if not target.is_relative_to(DOCS):
                errors.append(f'{path.relative_to(DOCS)}: link escapes site: {href}')
            elif not target.exists():
                errors.append(f'{path.relative_to(DOCS)}: missing {href}')
            elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
                errors.append(f'{path.relative_to(DOCS)}: missing anchor {href}')
            elif target.suffix == '.md':
                errors.append(f'{path.relative_to(DOCS)}: Markdown navigation: {href}')
    paths = [href for href in homepage.links if href.startswith('guides/study-guide.html#path-')]
    expected = [f'guides/study-guide.html#path-{n}' for n in range(1, 7)]
    if paths != expected:
        errors.append('Home page must link all six learning paths to their study guide sections')
    for source in (ROOT / 'examples').rglob('*.yaml'):
        download = DOCS / source.relative_to(ROOT)
        if not download.exists() or download.read_bytes() != source.read_bytes():
            errors.append(f'YAML download differs from source: {source.relative_to(ROOT)}')
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f'Checked {len(pages)} HTML pages, all six learning paths, rendered home-page links, and YAML downloads: OK')


if __name__ == '__main__':
    check()
