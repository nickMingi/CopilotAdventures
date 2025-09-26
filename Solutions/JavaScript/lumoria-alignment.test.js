// Unit tests for Celestial Alignment of Lumoria
const { calculateLightIntensities, getShadowRule } = require('./The-Celestial-Alignment-of-Lumoria');

describe('Celestial Light Intensity Calculation', () => {
  test('Mercuria receives full light', () => {
    const planets = [
      { name: 'Mercuria', distance: 0.4, diameter: 4879 },
      { name: 'Venusia', distance: 0.7, diameter: 12104 },
      { name: 'Earthia', distance: 1.0, diameter: 12742 },
      { name: 'Marsia', distance: 1.5, diameter: 6779 }
    ];
    const result = calculateLightIntensities(planets);
    expect(result[0].intensity).toBe('Full');
  });

  test('Marsia receives None (Multiple Shadows)', () => {
    const planets = [
      { name: 'Mercuria', distance: 0.4, diameter: 4879 },
      { name: 'Venusia', distance: 0.7, diameter: 12104 },
      { name: 'Earthia', distance: 1.0, diameter: 12742 },
      { name: 'Marsia', distance: 1.5, diameter: 6779 }
    ];
    const result = calculateLightIntensities(planets);
    expect(result[3].intensity).toMatch(/None/);
  });

  test('Custom system supports arbitrary planets', () => {
    const planets = [
      { name: 'A', distance: 0.2, diameter: 1000 },
      { name: 'B', distance: 0.3, diameter: 2000 },
      { name: 'C', distance: 0.4, diameter: 3000 }
    ];
    const result = calculateLightIntensities(planets);
    expect(result.length).toBe(3);
  });

  test('getShadowRule logic', () => {
    expect(getShadowRule(0,0)).toBe('Full');
    expect(getShadowRule(1,0)).toBe('Partial');
    expect(getShadowRule(0,1)).toBe('None');
    expect(getShadowRule(1,1)).toMatch(/None/);
  });
});
