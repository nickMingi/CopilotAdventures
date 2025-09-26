// Knowledge Cartographer: Akashic Archives Explorer
// Phase 2: Application to Explore the Knowledge Base
// Author: GitHub Copilot
//
// Usage: node Knowledge-Cartographer.js
//
// Only uses Node.js built-in modules: fs, path, readline

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ARCHIVE_ROOT = path.join(__dirname, '../../akashic-archives-demo');
const TOPICS_DIR = path.join(ARCHIVE_ROOT, 'topics');
const INDEXES_DIR = path.join(ARCHIVE_ROOT, 'indexes');

function loadJSON(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
        return null;
    }
}

function listDomains() {
    const domains = loadJSON(path.join(INDEXES_DIR, 'domains.json'));
    if (!domains) return [];
    return domains;
}

function listTopics() {
    return fs.readdirSync(TOPICS_DIR)
        .map(f => f.replace(/-(entities|relationships|sources)\.json$/, ''))
        .filter((v, i, a) => a.indexOf(v) === i);
}

function loadTopicData(topic) {
    const entities = loadJSON(path.join(TOPICS_DIR, `${topic}-entities.json`)) || [];
    const relationships = loadJSON(path.join(TOPICS_DIR, `${topic}-relationships.json`)) || [];
    const sources = loadJSON(path.join(TOPICS_DIR, `${topic}-sources.json`)) || [];
    return { entities, relationships, sources };
}

function printMysticalHeader(title) {
    console.log('\n✨🔮=== ' + title + ' ===🔮✨');
}

function printEntity(entity) {
    console.log(`  • ${entity.name} (${entity.type})`);
    if (entity.description) console.log(`    - ${entity.description}`);
}

function printRelationship(rel, entities) {
    const src = entities.find(e => e.id === rel.source);
    const tgt = entities.find(e => e.id === rel.target);
    if (src && tgt) {
        console.log(`    ↳ ${src.name} --[${rel.type}]→ ${tgt.name}`);
    }
}

function printSource(source) {
    console.log(`  - ${source.title} [${source.credibility}]`);
    console.log(`    ${source.url}`);
}

function analyzeConnections(relationships, entities) {
    // Find clusters: group by target
    const clusters = {};
    relationships.forEach(rel => {
        if (!clusters[rel.target]) clusters[rel.target] = [];
        clusters[rel.target].push(rel.source);
    });
    // Print clusters with more than one connection
    Object.entries(clusters).forEach(([target, sources]) => {
        if (sources.length > 1) {
            const tgt = entities.find(e => e.id === target);
            if (tgt) {
                console.log(`  ✦ Cluster: ${tgt.name} is connected to ${sources.length} entities.`);
            }
        }
    });
}

function showTopic(topic) {
    const { entities, relationships, sources } = loadTopicData(topic);
    printMysticalHeader(`Knowledge Domain: ${topic}`);
    console.log('\nEntities:');
    entities.forEach(printEntity);
    console.log('\nRelationships:');
    relationships.forEach(rel => printRelationship(rel, entities));
    console.log('\nConcept Clusters:');
    analyzeConnections(relationships, entities);
    console.log('\nSources:');
    sources.forEach(printSource);
}

function mainMenu() {
    printMysticalHeader('Akashic Archives Explorer');
    const domains = listDomains();
    if (!domains.length) {
        console.log('No knowledge domains found.');
        return;
    }
    console.log('Available Knowledge Domains:');
    domains.forEach((d, i) => {
        console.log(`  [${i + 1}] ${d.name}`);
    });
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('\nEnter domain number to explore, or q to quit: ', answer => {
        if (answer.toLowerCase() === 'q') {
            rl.close();
            return;
        }
        const idx = parseInt(answer, 10) - 1;
        if (isNaN(idx) || idx < 0 || idx >= domains.length) {
            console.log('Invalid selection.');
            rl.close();
            return;
        }
        const topic = domains[idx].id;
        rl.close();
        showTopic(topic);
        setTimeout(mainMenu, 500);
    });
}

if (require.main === module) {
    try {
        mainMenu();
    } catch (e) {
        console.error('Mystical error:', e.message);
    }
}

// Exports for testing/extension
module.exports = {
    loadJSON, listDomains, listTopics, loadTopicData, analyzeConnections
};
