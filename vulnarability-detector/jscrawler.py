import concurrent.futures
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from urllib import robotparser

class JSFileCrawler:
    def __init__(self, base_url, headers=None, max_depth=1):
        self.base_url = base_url
        self.domain = urlparse(base_url).netloc
        self.visited = set()
        self.to_visit = [(base_url, 0)]
        self.headers = headers or {"User-Agent": "Mozilla/5.0"}
        self.max_depth = max_depth
        self.js_files = set()
        self.robots_parser = self.get_robots_parser()

    def get_robots_parser(self):
        rp = robotparser.RobotFileParser()
        try:
            rp.set_url(urljoin(self.base_url, '/robots.txt'))
            rp.read()
        except:
            pass
        return rp

    def is_valid_url(self, url):
        return urlparse(url).netloc == self.domain and self.robots_parser.can_fetch(self.headers['User-Agent'], url)

    def crawl(self):
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            while self.to_visit:
                batch = []
                while self.to_visit and len(batch) < 5:
                    url, depth = self.to_visit.pop()
                    if depth <= self.max_depth and url not in self.visited:
                        self.visited.add(url)
                        batch.append((url, depth))
                futures = [executor.submit(self.process_url, url, depth) for url, depth in batch]
                concurrent.futures.wait(futures)

        return sorted(self.js_files)

    def process_url(self, url, depth):
        print(f"🕷️ Crawling: {url}")
        try:
            html = requests.get(url, headers=self.headers, timeout=10).text
            soup = BeautifulSoup(html, "lxml")
            self.extract_scripts(soup, url)
            self.extract_links(soup, url, depth)
        except Exception as e:
            print(f"Error crawling {url}: {e}")

    def extract_links(self, soup, current_url, depth):
        for tag in soup.find_all("a", href=True):
            href = tag.get("href")
            full_url = urljoin(current_url, href)
            if self.is_valid_url(full_url) and full_url not in self.visited:
                self.to_visit.append((full_url, depth + 1))

    def extract_scripts(self, soup, current_url):
        for script in soup.find_all("script", src=True):
            src = script.get("src")
            full_url = urljoin(current_url, src)
            if full_url.endswith(".js") and self.is_valid_url(full_url):
                self.js_files.add(full_url)
