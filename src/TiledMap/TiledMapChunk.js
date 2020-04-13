import TiledMapTile from './TiledMapTile';

export default class TiledMapChunk {
    constructor() {
        this.map = new Array(16).fill(new Array(16).fill(null));
    }

    create(x, y, tile = null) {
        this.map[x][y] = tile ? tile : new TiledMapTile();
        return this.map[x][y];
    }

    get(x, y) {
        return this.map[x][y];
    }

    is(x, y) {
        return !!this.get(x, y);
    }

    getTile(x, y, tile = null) {
        return this.get(x, y) || this.create(x, y, tile);
    }

    unset(x, y) {
        const tile = this.map[x][y];
        this.map[x][y] = null;
        if (tile) {
            tile.destroy();
        }
        delete tile;
    }

    destroy() {
        for (let x = 0; x < 16; x += 1) {
            for (let y = 0; y < 16; y += 1) {
                this.unset(x, y);
            }
        }
        delete this.map;
    }
}