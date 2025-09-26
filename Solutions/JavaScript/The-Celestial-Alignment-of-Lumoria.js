// The Celestial Alignment of Lumoria - Planetary Light Intensity System
// Fantasy adventure: Calculate the light intensity received by each planet in the Lumoria system
// Language: JavaScript (Node.js)
//
// 행성 데이터 정의 (이름, 거리(AU), 크기(km))
// 사용자 정의 항성계 지원: planets 배열을 외부에서 주입 가능
const defaultPlanets = [
    { name: 'Mercuria', distance: 0.4, diameter: 4879 },
    { name: 'Venusia', distance: 0.7, diameter: 12104 },
    { name: 'Earthia', distance: 1.0, diameter: 12742 },
    { name: 'Marsia', distance: 1.5, diameter: 6779 }
];




/**
 * 거리순으로 행성 정렬 (가까운 순)
 */
function sortPlanetsByDistance(planets) {
    return [...planets].sort((a, b) => a.distance - b.distance);
}

/**
 * 각 행성에 대해 태양에 더 가까운 더 큰/작은 행성의 개수 계산
 * @param {Array} sortedPlanets - 거리순 정렬된 행성 배열
 * @returns {Array} - 각 행성별로 {name, closerLarger, closerSmaller}
 */
// 과학적 그림자 계산: 각 행성의 각도와 그림자 범위 계산
function countCloserPlanets(sortedPlanets) {
    return sortedPlanets.map((planet, idx) => {
        let closerLarger = 0, closerSmaller = 0;
        for (let i = 0; i < idx; i++) {
            if (sortedPlanets[i].diameter > planet.diameter) closerLarger++;
            if (sortedPlanets[i].diameter < planet.diameter) closerSmaller++;
        }
        return {
            name: planet.name,
            closerLarger,
            closerSmaller
        };
    });
}

/**
 * 그림자 규칙 적용
 * - Full: 더 가까운 더 큰 행성이 0개, 더 가까운 더 작은 행성이 0개
 * - Partial: 더 가까운 더 큰 행성이 1개 이상, 더 가까운 더 작은 행성이 0개
 * - None: 더 가까운 더 큰 행성이 0개, 더 가까운 더 작은 행성이 1개 이상
 * - None (Multiple Shadows): 더 가까운 더 큰 행성이 1개 이상, 더 가까운 더 작은 행성이 1개 이상
 * @param {number} closerLarger
 * @param {number} closerSmaller
 * @returns {string}
 */
function getShadowRule(closerLarger, closerSmaller) {
    if (closerLarger === 0 && closerSmaller === 0) return 'Full';
    if (closerLarger > 0 && closerSmaller === 0) return 'Partial';
    if (closerLarger === 0 && closerSmaller > 0) return 'None';
    if (closerLarger > 0 && closerSmaller > 0) return 'None (Multiple Shadows)';
    return 'Unknown';
}

/**
 * 메인 함수: 행성별 빛 강도 계산 및 출력
 */

// 빛 강도 계산 및 시각화 데이터 반환 (테스트/애니메이션/보고서/다양한 시스템 지원)
function calculateLightIntensities(planets) {
    const sorted = sortPlanetsByDistance(planets);
    const closerCounts = countCloserPlanets(sorted);
    return sorted.map((planet, idx) => {
        const { closerLarger, closerSmaller } = closerCounts[idx];
        const shadow = getShadowRule(closerLarger, closerSmaller);
        return {
            name: planet.name,
            distance: planet.distance,
            diameter: planet.diameter,
            intensity: shadow
        };
    });
}

// SVG/애니메이션용 데이터 생성 (좌표, 반지름 등)
function getPlanetSVGData(planets, width = 800, height = 200) {
    const sorted = sortPlanetsByDistance(planets);
    const minDist = Math.min(...sorted.map(p => p.distance));
    const maxDist = Math.max(...sorted.map(p => p.distance));
    const minDia = Math.min(...sorted.map(p => p.diameter));
    const maxDia = Math.max(...sorted.map(p => p.diameter));
    // 태양 위치
    const sunX = 60, sunY = height/2;
    const planetArea = width - 120;
    return sorted.map((planet, idx) => {
        // 거리 비율로 x좌표
        const x = sunX + ((planet.distance - minDist) / (maxDist - minDist)) * planetArea;
        // 크기 비율로 반지름
        const r = 10 + 30 * ((planet.diameter - minDia) / (maxDia - minDia));
        return {
            name: planet.name,
            x, y: sunY, r,
            distance: planet.distance,
            diameter: planet.diameter
        };
    });
}

// 콘솔 출력
function displayLumoriaLight(planets = defaultPlanets) {
    console.log('🌌=== The Celestial Alignment ===🌌');
    console.log('Planet         Distance(AU)   Diameter(km)   Light Intensity');
    console.log('-------------------------------------------------------------');
    const results = calculateLightIntensities(planets);
    results.forEach(planet => {
        let symbol = '';
        switch (planet.intensity) {
            case 'Full': symbol = '☀️'; break;
            case 'Partial': symbol = '🌗'; break;
            case 'None': symbol = '🌑'; break;
            case 'None (Multiple Shadows)': symbol = '🌑🌑'; break;
            default: symbol = '?';
        }
        console.log(
            `${planet.name.padEnd(14)} ${planet.distance.toFixed(2).padEnd(13)} ${planet.diameter.toString().padEnd(13)} ${symbol}  (${planet.intensity})`
        );
    });
    console.log('-------------------------------------------------------------');
    console.log('Legend: ☀️ Full | 🌗 Partial | 🌑 None | 🌑🌑 None (Multiple Shadows)');
}

// 메인 실행
if (require.main === module) {
    try {
        displayLumoriaLight();
    } catch (err) {
        console.error('Error in celestial calculation:', err.message);
    }
}

// 모듈 내보내기 (테스트/확장/웹/애니메이션 지원)
module.exports = {
    calculateLightIntensities,
    getShadowRule,
    getPlanetSVGData,
    displayLumoriaLight
};



/**
 * To run:
 *   node The-Celestial-Alignment-of-Lumoria.js
 *
 * This adventure demonstrates:
 * - Array sorting and mapping
 * - Fantasy-themed variable naming
 * - Shadow rule logic
 * - Beautiful console output
 * - Error handling and documentation
 */
