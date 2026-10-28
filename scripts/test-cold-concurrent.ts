async function testConcurrentLoad() {
  console.log('--- CONCURRENT REQUESTS STRESS TEST ---');

  const testUrls = [
    'http://localhost:3000/',
    'http://localhost:3000/blog',
    'http://localhost:3000/dashboards/world-business',
    'http://localhost:3000/tools/open-mis',
    'http://localhost:3000/tools/bi-roi-calculator',
    'http://localhost:3000/tools/mermaid-forge',
    'http://localhost:3000/ebooks',
    'http://localhost:3000/about',
    'http://localhost:3000/contact',
    'http://localhost:3000/privacy',
  ];

  // Run 30 concurrent requests
  const requests: Promise<{ url: string; status: number; durationMs: number }>[] = [];

  for (let i = 0; i < 30; i++) {
    const url = testUrls[i % testUrls.length];
    const start = Date.now();
    requests.push(
      fetch(url)
        .then(res => ({
          url,
          status: res.status,
          durationMs: Date.now() - start,
        }))
        .catch(err => ({
          url,
          status: 500,
          durationMs: Date.now() - start,
        }))
    );
  }

  const results = await Promise.all(requests);
  let failed = 0;
  let totalTime = 0;

  for (const r of results) {
    totalTime += r.durationMs;
    if (r.status !== 200) {
      console.error(`  FAIL: ${r.url} returned status ${r.status}`);
      failed++;
    }
  }

  const avgTime = Math.round(totalTime / results.length);
  console.log(`Executed ${results.length} concurrent requests.`);
  console.log(`Average response time: ${avgTime}ms`);
  console.log(`Failed requests (non-200): ${failed}`);

  if (failed > 0) {
    console.error('Concurrent load test FAILED.');
    process.exit(1);
  } else {
    console.log('✓ Concurrent load test PASSED with 0 errors.');
    process.exit(0);
  }
}

testConcurrentLoad();
