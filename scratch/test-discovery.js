/**
 * Exact port of .NET Framework 4.x / Mono System.Random
 * Implementation of the Subtractive Generator algorithm.
 */
class SystemRandom {
    constructor(seed) {
        this.MBIG = 2147483647;
        this.MSEED = 161803398;
        this.seedArray = new Array(56);
        this.inext = 0;
        this.inextp = 0;

        let subtraction = (seed === -2147483648) ? 2147483647 : Math.abs(seed);
        let mj = this.MSEED - subtraction;
        this.seedArray[55] = mj;
        let mk = 1;
        for (let i = 1; i < 55; i++) {
            let ii = (21 * i) % 55;
            this.seedArray[ii] = mk;
            mk = mj - mk;
            if (mk < 0) mk += this.MBIG;
            mj = this.seedArray[ii];
        }
        for (let k = 1; k < 5; k++) {
            for (let i = 1; i < 56; i++) {
                this.seedArray[i] -= this.seedArray[1 + (i + 30) % 55];
                if (this.seedArray[i] < 0) this.seedArray[i] += this.MBIG;
            }
        }
        this.inext = 0;
        this.inextp = 21;
    }

    sample() {
        if (++this.inext >= 56) this.inext = 1;
        if (++this.inextp >= 56) this.inextp = 1;
        let retVal = this.seedArray[this.inext] - this.seedArray[this.inextp];
        if (retVal < 0) retVal += this.MBIG;
        this.seedArray[this.inext] = retVal;
        return retVal * (1.0 / this.MBIG);
    }

    range(min, max) {
        if (min === max) return min;
        return min + Math.floor(this.sample() * (max - min));
    }
}

const seed = 483666093;

function getGrid(masterSeed, level, stage, width, height) {
    const levelId = (level * 1000) + stage;
    const rng = new SystemRandom(masterSeed + levelId);
    const coords = Array.from({length: width * height}, (_, i) => i);
    for (let i = coords.length - 1; i > 0; i--) {
        const j = rng.range(0, i + 1);
        [coords[i], coords[j]] = [coords[j], coords[i]];
    }
    return coords;
}

function solveLevel(level, width, height, targetData) {
    console.log(`\n--- Level ${level} (${width}x${height}) ---`);
    for (let s = 1; s <= targetData.length; s++) {
        const list = getGrid(seed, level, s, width, height);
        const fruit = targetData[s-1].F;
        const gems = targetData[s-1].G;
        const fruitIdx = list.indexOf(fruit);
        const gemsIndices = gems.map(g => list.indexOf(g)).sort((a,b) => a-b);
        
        // Find first few elements to see the pattern
        const firstElements = list.slice(0, Math.max(fruitIdx, ...gemsIndices) + 1);
        
        console.log(`Stage ${s}: F=${fruit}(@${fruitIdx}), G=[${gems.join(',')}] (@${JSON.stringify(gemsIndices)})`);
        console.log(`   List Prefix: ${JSON.stringify(list.slice(0, 12))}...`);
    }
}

const L0_DATA = [
    { F: 8, G: [1] },
    { F: 8, G: [7] },
    { F: 6, G: [7] }
];

const L1_DATA = [
    { F: 5, G: [12,13,15,9,10,11,4,7,0,2,3] },
    { F: 2, G: [12,10,11] },
    { F: 14, G: [15,5,2] },
    { F: 7, G: [8,6,0] }
];

const L2_DATA = [
    { F: 3, G: [21,22,23,24,16,17,18,19,10,12,13,5,6,7,9,1,2] },
    { F: 20, G: [22,15,10,0,4] },
    { F: 0, G: [11,5,7,8,2] },
    { F: 15, G: [10,11,12,5,2] },
    { F: 3, G: [20,21,22,23,24,16,18,19,10,11,12,13,5,7,0,2,4] }
];

const L3_DATA = [
    { F: 13, G: [29,22,23,16,19,11] },
    { F: 16, G: [27,20,22,10,3,4] }
];

solveLevel(0, 3, 3, L0_DATA);
solveLevel(1, 4, 4, L1_DATA);
solveLevel(2, 5, 5, L2_DATA);
solveLevel(3, 5, 6, L3_DATA);
