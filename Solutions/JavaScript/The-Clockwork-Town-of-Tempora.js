
/**
 * Parses a time string (HH:MM) into total minutes since midnight.
 * @param {string} timeStr - Time in HH:MM format
 * @returns {number} Total minutes since midnight
 */
function parseTimeToMinutes(timeStr) {
    const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(timeStr);
    if (!match) {
        throw new Error(`Invalid time format: ${timeStr}`);
    }
    const [, hour, minute] = match;
    return parseInt(hour, 10) * 60 + parseInt(minute, 10);
}

/**
 * Calculates the difference in minutes between a village clock and the grand clock.
 * Positive = ahead, Negative = behind
 * @param {string} clockTime - Village clock time (HH:MM)
 * @param {string} grandTime - Grand clock time (HH:MM)
 * @returns {number|null} Difference in minutes, or null if error
 */
function calculateMinuteDifference(clockTime, grandTime) {
    try {
        const clockMinutes = parseTimeToMinutes(clockTime);
        const grandMinutes = parseTimeToMinutes(grandTime);
        return clockMinutes - grandMinutes;
    } catch (err) {
        return null;
    }
}

/**
 * 여러 테스트 케이스를 실행하고 결과를 명확하게 출력합니다.
 */
function runAllTests() {
    const grandClockTime = "15:00";
    const testCases = [
        { label: 'Default', clocks: ["14:45", "15:05", "15:00", "14:40"] },
        { label: 'All Synchronized', clocks: ["15:00", "15:00", "15:00", "15:00"] },
        { label: 'All Ahead', clocks: ["15:10", "15:20", "15:30", "16:00"] },
        { label: 'All Behind', clocks: ["14:00", "13:59", "12:00", "00:00"] },
        { label: 'Invalid Inputs', clocks: ["15:00", "25:00", "14:60", "abc"] }
    ];
    console.log('=== Tempora Clock Synchronization (Test Suite) ===');
    for (const test of testCases) {
        console.log(`\n--- Test Case: ${test.label} ---`);
        console.log('Grand Clock Tower Time:', grandClockTime);
        test.clocks.forEach((clockTime, idx) => {
            const diff = calculateMinuteDifference(clockTime, grandClockTime);
            if (diff === null) {
                console.log(`Clock #${idx + 1} [${clockTime}]: Error (Invalid time)`);
            } else {
                const status = diff > 0 ? 'Ahead' : diff < 0 ? 'Behind' : 'Synchronized';
                console.log(`Clock #${idx + 1} [${clockTime}]: ${diff} min (${status})`);
            }
        });
    }
    console.log('\nAll test cases completed.');
}

// Run all test cases
runAllTests();
