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

function saveJSON(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function listDomains() {
    const domains = loadJSON(path.join(INDEXES_DIR, 'domains.json'));
    if (!domains) return [];
    return domains;
}

function listTopics() {
    return fs.readdirSync(TOPICS_DIR)
        .map(f => f.replace(/-(entities|relationships|sources|media)\.json$/, ''))
        .filter((v, i, a) => a.indexOf(v) === i);
}

function loadTopicData(topic) {
    const entities = loadJSON(path.join(TOPICS_DIR, `${topic}-entities.json`)) || [];
    const relationships = loadJSON(path.join(TOPICS_DIR, `${topic}-relationships.json`)) || [];
    const sources = loadJSON(path.join(TOPICS_DIR, `${topic}-sources.json`)) || [];
    const media = loadJSON(path.join(TOPICS_DIR, `${topic}-media.json`)) || [];
    return { entities, relationships, sources, media };
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
    const { entities, relationships, sources, media } = loadTopicData(topic);
    printMysticalHeader(`Knowledge Domain: ${topic}`);
    console.log('\nEntities:');
    entities.forEach(printEntity);
    console.log('\nRelationships:');
    relationships.forEach(rel => printRelationship(rel, entities));
    console.log('\nConcept Clusters:');
    analyzeConnections(relationships, entities);
    console.log('\nSources:');
    sources.forEach(printSource);
    if (media && media.length) {
        console.log('\nMultimedia:');
        media.forEach(m => console.log(`  - ${m.type}: ${m.url}`));
    }
}

// --- Advanced MCP Integrations ---

// 1. Knowledge Graph Merge
function mergeDomains(domains, mergedName) {
    // Merge entities, relationships, sources, media
    let merged = { entities: [], relationships: [], sources: [], media: [] };
    let entityMap = {};
    domains.forEach(domain => {
        const { entities, relationships, sources, media } = loadTopicData(domain);
        entities.forEach(e => {
            if (!entityMap[e.id]) {
                entityMap[e.id] = e;
                merged.entities.push(e);
            }
        });
        merged.relationships.push(...relationships);
        merged.sources.push(...sources);
        merged.media.push(...(media || []));
    });
    // Save merged
    saveJSON(path.join(TOPICS_DIR, `${mergedName}-entities.json`), merged.entities);
    saveJSON(path.join(TOPICS_DIR, `${mergedName}-relationships.json`), merged.relationships);
    saveJSON(path.join(TOPICS_DIR, `${mergedName}-sources.json`), merged.sources);
    saveJSON(path.join(TOPICS_DIR, `${mergedName}-media.json`), merged.media);
    // Add to index
    let domainsIdx = loadJSON(path.join(INDEXES_DIR, 'domains.json'));
    if (domainsIdx && !domainsIdx.find(d => d.id === mergedName)) {
        domainsIdx.push({ id: mergedName, name: mergedName.replace(/-/g, ' '), description: `Merged domain: ${domains.join(', ')}` });
        saveJSON(path.join(INDEXES_DIR, 'domains.json'), domainsIdx);
    }
    console.log(`Merged domains [${domains.join(', ')}] into '${mergedName}'`);
}

// 2. Automated Knowledge Update Workflow (scaffold)
function updateKnowledge(domain) {
    // Placeholder: In real MCP, would re-scrape and update files
    console.log(`[Automated Update] Would trigger MCP update for domain: ${domain}`);
}

// 3. Multimedia Content Discovery/Organization (scaffold)
function discoverMedia(domain) {
    // Placeholder: In real MCP, would scrape and save media.json
    console.log(`[Media Discovery] Would discover and save media for domain: ${domain}`);
}

// 4. Knowledge Sharing/Export Pipeline
function exportDomain(domain, format) {
    const { entities, relationships, sources } = loadTopicData(domain);
    if (format === 'csv') {
        // Export entities and relationships as CSV
        let csv = 'type,id,name,desc\n';
        entities.forEach(e => csv += `entity,${e.id},${e.name},${e.description || ''}\n`);
        relationships.forEach(r => csv += `rel,${r.source},${r.type},${r.target}\n`);
        fs.writeFileSync(path.join(TOPICS_DIR, `${domain}-export.csv`), csv, 'utf-8');
        console.log(`Exported ${domain} as CSV.`);
    } else if (format === 'json') {
        saveJSON(path.join(TOPICS_DIR, `${domain}-export.json`), { entities, relationships, sources });
        console.log(`Exported ${domain} as JSON.`);
    } else {
        console.log('Export format not supported.');
    }
}

// 5. Advanced Graph Analytics/Insights (scaffold)
function analyzeDomain(domain) {
    const { entities, relationships } = loadTopicData(domain);
    // Example: Most connected entity
    let counts = {};
    relationships.forEach(r => {
        counts[r.source] = (counts[r.source] || 0) + 1;
        counts[r.target] = (counts[r.target] || 0) + 1;
    });
    let maxId = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, null);
    let maxEntity = entities.find(e => e.id === maxId);
    if (maxEntity) {
        console.log(`Most connected entity: ${maxEntity.name} (${counts[maxId]} connections)`);
    } else {
        console.log('No analytics available.');
    }
}

// 6. Knowledge Recommendation System (scaffold)
function recommend(entityId, domain) {
    const { relationships, entities } = loadTopicData(domain);
    let recs = relationships.filter(r => r.source === entityId || r.target === entityId)
        .map(r => r.source === entityId ? r.target : r.source);
    recs = [...new Set(recs)];
    recs.forEach(id => {
        const ent = entities.find(e => e.id === id);
        if (ent) console.log(`Recommended: ${ent.name} (${ent.type})`);
    });
    if (!recs.length) console.log('No recommendations found.');
}

// 7. Integration with External Knowledge Bases/APIs (scaffold)
function importExternal(api, query) {
    // Placeholder: In real MCP, would fetch and merge
    console.log(`[External Integration] Would import from ${api} with query '${query}'`);
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
    console.log('\nCommands:');
    console.log('  explore [num]         - Explore a domain');
    console.log('  merge [a] [b] [name]  - Merge two domains');
    console.log('  export [num] [fmt]    - Export domain (csv/json)');
    console.log('  analyze [num]         - Analyze domain');
    console.log('  recommend [id] [num]  - Recommend for entity in domain');
    console.log('  update [num]          - Automated update');
    console.log('  media [num]           - Discover media');
    console.log('  import [api] [query]  - Import from external');
    console.log('  q                     - Quit');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('\nEnter command: ', answer => {
        const [cmd, ...args] = answer.trim().split(/\s+/);
        if (cmd === 'q') {
            rl.close();
            return;
        }
        if (cmd === 'explore') {
            const idx = parseInt(args[0], 10) - 1;
            if (isNaN(idx) || idx < 0 || idx >= domains.length) {
                console.log('Invalid selection.');
                rl.close();
                setTimeout(mainMenu, 500);
                return;
            }
            const topic = domains[idx].id;
            rl.close();
            showTopic(topic);
            setTimeout(mainMenu, 500);
            return;
        }
        if (cmd === 'merge') {
            if (args.length < 3) {
                console.log('Usage: merge [a] [b] [name]');
            } else {
                mergeDomains([args[0], args[1]], args[2]);
            }
            rl.close();
            setTimeout(mainMenu, 500);
            return;
        }
        if (cmd === 'export') {
            const idx = parseInt(args[0], 10) - 1;
            const fmt = args[1];
            if (isNaN(idx) || idx < 0 || idx >= domains.length || !fmt) {
                console.log('Usage: export [num] [csv|json]');
            } else {
                exportDomain(domains[idx].id, fmt);
            }
            rl.close();
            setTimeout(mainMenu, 500);
            return;
        }
        if (cmd === 'analyze') {
            const idx = parseInt(args[0], 10) - 1;
            if (isNaN(idx) || idx < 0 || idx >= domains.length) {
                console.log('Usage: analyze [num]');
            } else {
                analyzeDomain(domains[idx].id);
            }
            rl.close();
            setTimeout(mainMenu, 500);
            return;
        }
        if (cmd === 'recommend') {
            const entityId = args[0];
            const idx = parseInt(args[1], 10) - 1;
            if (!entityId || isNaN(idx) || idx < 0 || idx >= domains.length) {
                console.log('Usage: recommend [entityId] [num]');
            } else {
                recommend(entityId, domains[idx].id);
            }
            rl.close();
            setTimeout(mainMenu, 500);
            return;
        }
        if (cmd === 'update') {
            const idx = parseInt(args[0], 10) - 1;
            if (isNaN(idx) || idx < 0 || idx >= domains.length) {
                console.log('Usage: update [num]');
            } else {
                updateKnowledge(domains[idx].id);
            }
            rl.close();
            setTimeout(mainMenu, 500);
            return;
        }
        if (cmd === 'media') {
            const idx = parseInt(args[0], 10) - 1;
            if (isNaN(idx) || idx < 0 || idx >= domains.length) {
                console.log('Usage: media [num]');
            } else {
                discoverMedia(domains[idx].id);
            }
            rl.close();
            setTimeout(mainMenu, 500);
            return;
        }
        if (cmd === 'import') {
            const api = args[0];
            const query = args.slice(1).join(' ');
            if (!api || !query) {
                console.log('Usage: import [api] [query]');
            } else {
                importExternal(api, query);
            }
            rl.close();
            setTimeout(mainMenu, 500);
            return;
        }
        console.log('Unknown command.');
        rl.close();
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
    loadJSON, saveJSON, listDomains, listTopics, loadTopicData, analyzeConnections,
    mergeDomains, exportDomain, analyzeDomain, recommend, updateKnowledge, discoverMedia, importExternal
};
