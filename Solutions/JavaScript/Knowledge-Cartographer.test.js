// Knowledge Cartographer Unit Tests
const path = require('path');
const fs = require('fs');
const cartographer = require('./Knowledge-Cartographer');

const TEST_DOMAIN1 = 'quantum-computing';
const TEST_DOMAIN2 = 'artificial-intelligence';
const MERGED_DOMAIN = 'merged-test-domain';

function cleanupMerged() {
  // Remove merged files if exist
  ['entities','relationships','sources','media'].forEach(suffix => {
    const f = path.join(__dirname, '../../akashic-archives-demo/topics', `${MERGED_DOMAIN}-${suffix}.json`);
    if (fs.existsSync(f)) fs.unlinkSync(f);
  });
  // Remove from index
  const idxPath = path.join(__dirname, '../../akashic-archives-demo/indexes/domains.json');
  let idx = cartographer.loadJSON(idxPath);
  if (idx) {
    idx = idx.filter(d => d.id !== MERGED_DOMAIN);
    fs.writeFileSync(idxPath, JSON.stringify(idx, null, 2), 'utf-8');
  }
}

describe('Knowledge Cartographer Advanced Features', () => {
  afterAll(cleanupMerged);

  test('Can merge two domains', () => {
    cartographer.mergeDomains([TEST_DOMAIN1, TEST_DOMAIN2], MERGED_DOMAIN);
    const merged = cartographer.loadTopicData(MERGED_DOMAIN);
    expect(merged.entities.length).toBeGreaterThan(0);
    expect(merged.relationships.length).toBeGreaterThan(0);
    expect(merged.sources.length).toBeGreaterThan(0);
  });

  test('Can export merged domain as JSON', () => {
    cartographer.exportDomain(MERGED_DOMAIN, 'json');
    const exportPath = path.join(__dirname, '../../akashic-archives-demo/topics', `${MERGED_DOMAIN}-export.json`);
    expect(fs.existsSync(exportPath)).toBe(true);
    const data = cartographer.loadJSON(exportPath);
    expect(data.entities.length).toBeGreaterThan(0);
  });

  test('Can recommend entities', () => {
    const merged = cartographer.loadTopicData(MERGED_DOMAIN);
    const firstId = merged.entities[0].id;
    // Should not throw
    cartographer.recommend(firstId, MERGED_DOMAIN);
  });

  test('Can analyze domain', () => {
    // Should not throw
    cartographer.analyzeDomain(MERGED_DOMAIN);
  });
});
