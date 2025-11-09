# Backend Service để cào dữ liệu EBSCO Library

Vì EBSCO có CORS restrictions, chúng ta cần một backend service để proxy/scrape dữ liệu.

## Cách 1: Node.js Backend với Puppeteer (Web Scraping)

### Setup

```bash
mkdir backend-library-scraper
cd backend-library-scraper
npm init -y
npm install express cors puppeteer axios cheerio
npm install --save-dev @types/express @types/cors typescript ts-node
```

### Code

Tạo file `server.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Endpoint để search books
app.get('/api/search-library', async (req, res) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const searchUrl = `https://research.ebsco.com/c/wsq2qv/search/results?q=${encodeURIComponent(query as string)}&autocorrect=y&expanders=thesaurus&expanders=fullText&expanders=concept&limiters=None&searchMode=all&searchSegment=all-results`;

    // Option 1: Use Puppeteer for dynamic content
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for results to load
    await page.waitForSelector('.result-item', { timeout: 10000 }).catch(() => {});
    
    const books = await page.evaluate(() => {
      const results = Array.from(document.querySelectorAll('.result-item, .search-result, article'));
      
      return results.map((item, index) => {
        const titleEl = item.querySelector('h2, h3, .title, [data-testid="title"]');
        const authorEl = item.querySelector('.authors, .author, [data-testid="authors"]');
        const publisherEl = item.querySelector('.publisher, [data-testid="publisher"]');
        const yearEl = item.querySelector('.date, .year, [data-testid="date"]');
        const abstractEl = item.querySelector('.abstract, .description');
        const imageEl = item.querySelector('img');
        
        return {
          id: `ebsco-${index}`,
          title: titleEl?.textContent?.trim() || 'Unknown Title',
          author: authorEl?.textContent?.trim() || 'Unknown Author',
          publisher: publisherEl?.textContent?.trim(),
          year: yearEl?.textContent?.trim(),
          coverImage: imageEl?.src,
          description: abstractEl?.textContent?.trim(),
          availability: 'available',
          location: 'EBSCO Database',
        };
      });
    });

    await browser.close();

    res.json({
      books: books.slice(0, parseInt(limit as string)),
      total: books.length,
      page: parseInt(page as string),
      hasMore: books.length > parseInt(limit as string),
    });

  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch library data',
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Library scraper backend running on http://localhost:${PORT}`);
});
```

### Run

```bash
npx ts-node server.ts
```

## Cách 2: Python Backend với BeautifulSoup

```bash
mkdir python-library-scraper
cd python-library-scraper
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install flask flask-cors requests beautifulsoup4 selenium
```

```python
# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

app = Flask(__name__)
CORS(app)

@app.route('/api/search-library', methods=['GET'])
def search_library():
    query = request.args.get('query')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    
    if not query:
        return jsonify({'error': 'Query is required'}), 400
    
    try:
        url = f"https://research.ebsco.com/c/wsq2qv/search/results?q={query}&autocorrect=y&expanders=thesaurus&expanders=fullText&expanders=concept"
        
        # Use Selenium for dynamic content
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        driver = webdriver.Chrome(options=options)
        driver.get(url)
        
        # Wait for results
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "result-item"))
        )
        
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        driver.quit()
        
        results = soup.find_all(class_=['result-item', 'search-result'])
        
        books = []
        for idx, item in enumerate(results[:limit]):
            title = item.find(['h2', 'h3'], class_='title')
            author = item.find(class_='authors')
            
            books.append({
                'id': f'ebsco-{idx}',
                'title': title.text.strip() if title else 'Unknown',
                'author': author.text.strip() if author else 'Unknown',
                'availability': 'available',
                'location': 'EBSCO Database'
            })
        
        return jsonify({
            'books': books,
            'total': len(books),
            'page': page,
            'hasMore': len(results) > limit
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=3001, debug=True)
```

## Cập nhật Frontend

Trong file `frontend/src/utils/vnu-library.ts`, uncomment phần backend proxy:

```typescript
// OPTION 2: Backend Proxy approach (recommended)
const response = await axios.get('http://localhost:3001/api/search-library', {
  params: { query, page, limit },
  timeout: 15000,
});

return response.data;
```

## Docker Setup (Optional)

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  library-scraper:
    build: ./backend-library-scraper
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
```

## Lưu ý quan trọng

1. **Legal**: Kiểm tra Terms of Service của EBSCO trước khi scrape
2. **Rate Limiting**: Implement rate limiting để tránh bị ban
3. **Caching**: Cache kết quả để giảm requests
4. **Error Handling**: Xử lý lỗi khi website thay đổi cấu trúc
5. **Authentication**: EBSCO có thể cần authentication token

## Cách test

```bash
# Terminal 1: Start backend
cd backend-library-scraper
npm start

# Terminal 2: Start frontend
cd frontend
yarn dev

# Browser: Navigate to http://localhost:3000/library
# Search for any keyword
```
