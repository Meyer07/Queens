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


export function checkSolutions(regions,limit=2)
{
    const n = regions.length();
    const cols=Array(n).fill(-1);
    const usedCol=Array(n).fill(false);
    const usedRegion=Array(n).fill(false);
    let count=0;
    const place=(r)=>
    {
        if(count>=limit)
        {
            return;
        }
        if(r===n)
        {
            count++;
            return;
        }
        for(let c =0;c<n;c++)
        {
            const id=regions[r][c];
            if(usedCol[c] || usedRegion[id])
            {
                continue;
            }
            if(r>0 && Math.abs(cols[r-1]-c)<2)
            {
                continue;
            }
            usedCol[c]=usedRegion[id]=true;
            cols[r]=c;
            place(r+1);
            usedCol[c]=usedRegion[id]=false;
        }
    };
    place(0);
    return count;
}
const DIRS=[[1, 0], [-1, 0], [0, 1], [0, -1]];

function stayConnected(regions,n,id,r0,c0)
{
    const cells=[];
    for(let r=0;r<n;r++)
    {
        for(let c=0;c<n;c++)
        {
            if(regions[r][c]===id && !(r===r0 && c===c0))
            {
                cells.push([r,c]);
            }
        }
    }
    if(cells.length===0)
    {
        return false;
    }
    const seen = new Set([cells[0]].join());
    const stack =[cells[0]];
    while(stack.length)
    {
        const[r,c]=stack.pop();
        for(const [dr,dc]of DIRS)
        {
            const nr=r + dr, nc = c + dc;
            if (nr < 0 || nc < 0 || nr >= n || nc >= n || regions[nr][nc] !== id)
            {
                continue;
            }
            if (nr === r0 && nc === c0)
            {
                continue;
            }
            const k = `${nr},${nc}`;
            if(!seen.has(k))
            {
                seen.add(k);
                stack.push([dr,dc]);
            }
        }
    }
    return seen.size===cells.length;
}

function refine(regions,solution,steps=600)
{
    const n=regions.length;
    let score=countSolutions(regions,100);
    for(let i=0;i<steps &&score>1;i++)
    {
        const r=Math.floor(Math.random()*n);
        const c=Math.floor(Math.random()*n);
        if(solution[r]===c)
        {
            continue;
        }
        const [dr,dc]=DIRS[Math.floor(Math.random()*4)];
        const nr=r+dr;
        const nc=c+dc;
        if(nr<0 || nc<0 || nr>=n || nc>=n)
        {
            continue;
        }
        const from=regions[r][c];
        const to=regions[nr][nc];
        if (from === to || !staysConnected(regions, n, from, r, c))
        {
            continue;
        }

        regions[r][c]=to;

        const next=countSolutions(regions,100);
        if(next<=score)
        {
            score=next;
        }else
        {
            regions[r][c]=from;
        }
    }
    return score===1;
}

export function generatePuzzle(n,maxTries=40)
{
    let last;
    for(let i=0;i<maxTries;i++)
    {
        const solution=randomSolution(n);
        const regions=growRegions(n,solution);
        last={regions,solution};
        if(refine(regions,solution))
        {
            return last;
        }
    }
    return last;
}


