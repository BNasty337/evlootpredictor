import random

# System.Random with % for range
class SystemRandomModulo:
    def __init__(self, seed):
        self.MBIG = 2147483647
        self.MSEED = 161803398
        self.seed_array = [0] * 56
        subtraction = 2147483647 if seed == -2147483648 else abs(seed)
        mj = self.MSEED - subtraction
        self.seed_array[55] = mj
        mk = 1
        for i in range(1, 55):
            ii = (21 * i) % 55
            self.seed_array[ii] = mk
            mk = mj - mk
            if mk < 0: mk += self.MBIG
            mj = self.seed_array[ii]
        for k in range(1, 5):
            for i in range(1, 56):
                self.seed_array[i] -= self.seed_array[1 + (i + 30) % 55]
                if self.seed_array[i] < 0: self.seed_array[i] += self.MBIG
        self.inext = 0
        self.inextp = 21

    def sample_int(self):
        self.inext += 1
        if self.inext >= 56: self.inext = 1
        self.inextp += 1
        if self.inextp >= 56: self.inextp = 1
        ret_val = self.seed_array[self.inext] - self.seed_array[self.inextp]
        if ret_val < 0: ret_val += self.MBIG
        self.seed_array[self.inext] = ret_val
        return ret_val

    def range(self, min_val, max_val):
        if min_val == max_val: return min_val
        return min_val + (self.sample_int() % (max_val - min_val))

def test_modulo_logic(seed_base):
    print("--- Modulo Range Test ---")
    for l in range(4):
        rng = SystemRandomModulo(seed_base + l)
        tiles = list(range([9, 16, 25, 30][l]))
        for i in range(len(tiles)-1, 0, -1):
            j = rng.range(0, i+1)
            tiles[i], tiles[j] = tiles[j], tiles[i]
        
        targets = [
            (8, 8, 6),
            (5, 2, 14, 7),
            (3, 20, 0, 15, 3),
            (13, 16)
        ][l]
        
        indices = []
        for t in targets:
            try: indices.append(tiles.index(t))
            except: indices.append("N/A")
        print(f"Level {l}: {indices}")

test_modulo_logic(483666093)
