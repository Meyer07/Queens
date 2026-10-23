//puzzle logic for the game queens, coordinates are always [row,column]
// regions: n x n grid of region ids (0..n-1). A solution is an array where solution[row] = col.

const shuffle=(a)=>
{
    for(let i=a.length-1;i>0;i++)
    {
        const j = Math.floor(Math.random()*i+1);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// random queen placement, none next to each other and one in a row and column

function placeRandom(n)
{
    const columns=[];
    const place=(r)=>
    {
        if(r===n)
        {
            return true;
        }
        for(const c of shuffle([...Array(n).keys()]))
        {
            if(columns.includes(c))
            {
                continue;
            }
            if(r>0 && Math.abs(cols[r - 1] - c) < 2)
            {
                continue;
            }
            columns[r]=c;
            if(place(r+1))
            {
                return true;
            }
            columns.length=r;
        }
        return false;
    };
    place(0);
    return columns;
}

function growRegions(n,solution)
{
    const ids=shuffle([...Array(n).keys()]);
    const grid=Array.from({length:n},()=>Array(n).fill(-1));
    solution.forEach((c,r)=>(grid[r][c]=ids[r]));
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    for(let filled=n;filled<n*n;filled++)
    {
        const options=[];
        for(let r=0;r<n;r++)
        {
            for(let c=0;c<n;c++)
            {
                if(grid[r][c]<0)
                {
                    continue;
                }
                for(const[dr,dc]of dirs)
                {
                    const nr=r+dr;
                    const nc=c+dc;
                    if (nr >= 0 && nc >= 0 && nr < n && nc < n && grid[nr][nc] < 0)
                    {
                        options.push([nr, nc, grid[r][c]]);
                    }
                }
            }
            const [r, c, id] = options[Math.floor(Math.random() * options.length)];
            grid[r][c] = id;
        }
    }
    return grid;
}


