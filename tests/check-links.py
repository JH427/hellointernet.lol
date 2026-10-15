"""Check each surface in its own serving namespace, plus assembled root pages."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
import re
import sys

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = set()
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        for key in ('href', 'src', 'poster'):
            if attrs.get(key):
                self.links.append(attrs[key])

def check(root, files=None):
    root = Path(root).resolve()
    files = files if files is not None else list(root.rglob('*.html'))
    errors = []
    checked = 0
    for file in files:
        parser = Links()
        parser.feed(file.read_text())
        origin = 'https://local/' + str(file.relative_to(root))
        for ref in parser.links:
            url = urlsplit(urljoin(origin, ref))
            if url.netloc != 'local' or url.scheme not in ('http', 'https'):
                continue
            target = root / unquote(url.path).lstrip('/')
            if target.is_dir() or not target.suffix:
                target = target / 'index.html'
            checked += 1
            if not target.is_file():
                errors.append(f'{file.relative_to(root)} → {ref}: missing {target.relative_to(root)}')
            elif url.fragment and target.suffix == '.html':
                other = Links()
                other.feed(target.read_text())
                if unquote(url.fragment) not in other.ids:
                    errors.append(f'{file.relative_to(root)} → {ref}: missing fragment')
    for css in root.rglob('*.css'):
        for ref in re.findall(r'url\([\"\']?([^\)\"\']+)', css.read_text()):
            url = urlsplit(ref)
            if url.scheme or url.netloc or ref.startswith('#'):
                continue
            target = root / url.path.lstrip('/') if ref.startswith('/') else css.parent / url.path
            checked += 1
            if not target.is_file():
                errors.append(f'{css.relative_to(root)} → {ref}: missing CSS asset')
    if errors:
        print('\n'.join(errors))
        raise SystemExit(1)
    print(f'PASS {root.name}: {len(files)} HTML pages, {checked} internal links/assets/fragments')

if __name__ == '__main__':
    for surface in ('public-root', 'lab', 'notes', 'signal'):
        check(Path(surface) / 'dist')
    if len(sys.argv) > 1:
        tree = Path(sys.argv[1]).resolve()
        # Other mounted surfaces deliberately use their own absolute asset namespaces.
        root_pages = [tree / p.relative_to(Path('public-root/dist')) for p in Path('public-root/dist').rglob('*.html')]
        check(tree, root_pages)
